document.addEventListener("DOMContentLoaded", () => {
    // Input with id username on change event
    const usernameInput = document.getElementById('username');
    usernameInput?.addEventListener('input', () => {
        const username = usernameInput.value;

        // Validation pattern for username
        const usernamePattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        const errorMessage = document.getElementById('usernameError');
        if (usernamePattern.test(username)) {
            localStorage.setItem('username', username);
            usernameInput.classList.remove('is-invalid');
            usernameInput.classList.add('is-valid');
            errorMessage?.remove();
        } else {
            usernameInput.classList.remove('is-valid');
            usernameInput.classList.add('is-invalid');

            if (!errorMessage) {
                const newErrorMessage = document.createElement('div');
                newErrorMessage.id = 'usernameError';
                newErrorMessage.style.color = 'red';
                newErrorMessage.textContent = "Username must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.";
                usernameInput.parentNode.insertBefore(newErrorMessage, usernameInput.nextSibling);
            } else {
                errorMessage.textContent = "Username must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.";
            }
        }
    });

    // Initialize Chart.js
    const ctx = document.getElementById('barChart')?.getContext('2d');
    if (ctx) {
        window.barChart = new Chart(ctx, { // Make barChart globally accessible
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Income',
                        data: [], // Initialize with an empty array
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: [], // Initialize with an empty array
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Monthly Income vs Expenses'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Download Chart as Image
    const downloadButton = document.getElementById('downloadChartBtn');
    downloadButton?.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = barChart.toBase64Image();
        link.download = 'chart.png';
        link.click();
    });
});

// Update Chart Data
const updateChart = () => {
    const incomeInputs = document.querySelectorAll('[id$="-income"]');
    const expensesInputs = document.querySelectorAll('[id$="-expenses"]');

    const incomeData = Array.from(incomeInputs, input => Number(input.value) || 0);
    const expensesData = Array.from(expensesInputs, input => Number(input.value) || 0);

    if (window.barChart) {
        barChart.data.datasets[0].data = incomeData;
        barChart.data.datasets[1].data = expensesData;
        barChart.update();
    }
};