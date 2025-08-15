document.addEventListener("DOMContentLoaded", function () {

    // input with id username on change event
    const usernameInput = document.getElementById('username');
    usernameInput.addEventListener('input', function () {
        const username = usernameInput.value;

        // add validation to username value to check whether it has at least one Capital Letter, 1 special character, 1 number and is at least 8 characters long
        const usernamePattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (usernamePattern.test(username)) {
            localStorage.setItem('username', username);
            usernameInput.classList.remove('is-invalid');
            usernameInput.classList.add('is-valid');
            let errorMessage = document.getElementById('usernameError');
            if (errorMessage) {
            errorMessage.remove();
            }
        } else {
            usernameInput.classList.remove('is-valid');
            usernameInput.classList.add('is-invalid');
            let errorMessage = document.getElementById('usernameError');
            if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.id = 'usernameError';
            errorMessage.style.color = 'red';
            usernameInput.parentNode.insertBefore(errorMessage, usernameInput.nextSibling);
            }
            errorMessage.textContent = "Username must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.";
        }

        // if (username) {
        //     localStorage.setItem('username', username);
        // } else {
        //     localStorage.removeItem('username');
        // }
    });    

    const ctx = document.getElementById('barChart').getContext('2d');
    window.barChart = new Chart(ctx, { // Make barChart globally accessible
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Income',
                data: [], // Initialize with an empty array
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Expenses',
                data: [], // Initialize with an empty array
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
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

    const downloadButton = document.getElementById('downloadChartBtn');
    downloadButton.addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = barChart.toBase64Image();
        link.download = 'chart.png';
        link.click();
    });
});

function updateChart() {
    const incomeInputs = document.querySelectorAll('[id$="-income"]');
    const expensesInputs = document.querySelectorAll('[id$="-expenses"]');

    const incomeData = Array.from(incomeInputs).map(input => Number(input.value) || 0);
    const expensesData = Array.from(expensesInputs).map(input => Number(input.value) || 0);

    barChart.data.datasets[0].data = incomeData;
    barChart.data.datasets[1].data = expensesData;
    barChart.update();
}