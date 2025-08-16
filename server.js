const express = require('express');
const cors = require('cors'); // Import the cors package
const nodemailer = require('nodemailer');
const app = express();

// Enable CORS for all origins or specify allowed origins
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Replace with your frontend's origin
    methods: ['GET', 'POST'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));

// Increase the request body size limit
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.post('/send-email', async (req, res) => {
    console.log('Received request to send email');
    const { email, chartImage } = req.body;

    if (!email || !chartImage) {
        return res.status(400).send('Email and chart image are required.');
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.resend.com', // Replace with your SMTP server (e.g., smtp.mailtrap.io, smtp.gmail.com)
            port: 587, // Use 587 for TLS or 465 for SSL
            secure: false, // Set to true if using port 465
            auth: {
                user: 'resend', // Replace with your SMTP username
                pass: '', // Replace with your SMTP password
            },
        });

        const mailOptions = {
            from: 'test@resend.dev',
            to: email,
            subject: 'Your Chart Image',
            html: '<p>Here is your chart:</p>',
            attachments: [
                {
                    filename: 'chart.png',
                    content: chartImage.split('base64,')[1],
                    encoding: 'base64',
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));