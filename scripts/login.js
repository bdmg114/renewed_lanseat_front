async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://gghs2023.cafe24.com/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('token', data.access);
        window.location.href = 'dashboard.html'; // Redirect to dashboard or desired page
    } catch (error) {
        document.getElementById('error-message').textContent = 'Invalid username or password.';
        console.error('Error:', error);
    }
}

document.querySelector("#login").addEventListener('click', login);