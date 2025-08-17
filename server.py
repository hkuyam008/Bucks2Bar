from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import re
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import base64
import time

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Simple in-memory rate limiter
rate_limits = {}

def rate_limit(ip: str, max_requests: int, window_seconds: int):
    now = time.time()
    window = rate_limits.setdefault(ip, [])
    # Remove timestamps outside the window
    window[:] = [t for t in window if now - t < window_seconds]
    if len(window) >= max_requests:
        return False
    window.append(now)
    return True

class EmailRequest(BaseModel):
    email: str
    chartImage: str

@app.post("/send-email")
async def send_email(request: Request, body: EmailRequest):
    ip = request.client.host
    if not rate_limit(ip, max_requests=10, window_seconds=15*60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many email requests from this IP, please try again later."
        )

    email = body.email
    chart_image = body.chartImage

    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not email or not re.match(email_regex, email):
        raise HTTPException(status_code=400, detail="Invalid email address.")

    if not chart_image or not chart_image.startswith('data:image/'):
        raise HTTPException(status_code=400, detail="Invalid chart image.")

    try:
        smtp_user = os.getenv('SMTP_USER')
        smtp_pass = os.getenv('SMTP_PASS')
        smtp_host = 'smtp.resend.com'
        smtp_port = 587

        msg = EmailMessage()
        msg['Subject'] = 'Your Chart Image'
        msg['From'] = 'test@resend.dev'
        msg['To'] = email
        msg.set_content('Here is your chart:', subtype='html')
        # Extract base64 content
        base64_content = chart_image.split('base64,')[1]
        img_data = base64.b64decode(base64_content)
        msg.add_attachment(img_data, maintype='image', subtype='png', filename='chart.png')

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

        return {"message": "Email sent successfully."}
    except Exception as error:
        print('Error sending email:', error)
        raise HTTPException(status_code=500, detail="Failed to send email.")

# To run: uvicorn server:app --reload --port 3000