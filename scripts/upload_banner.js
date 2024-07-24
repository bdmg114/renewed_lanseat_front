var token = localStorage.getItem('token');
const text_field = document.getElementById("Uid");

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // First fetch for the login token
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
        const token = data.access;
        localStorage.setItem('token', token);

        const secondResponse = await fetch('https://gghs2023.cafe24.com/new_scrolls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                value: document.getElementById('text_field').value
            })
        });

        if (!secondResponse.ok) {
            throw new Error(`HTTP error! Status: ${secondResponse.status}`);
        }

        const secondData = await secondResponse.json();
        console.log('Success:', secondData);
    }
    catch (error) {
        document.getElementById('error-message').textContent = 'Invalid username or password.';
        console.error('Error:', error);
    }
}

function submit_texts() {
    login();
}

document.querySelector("#submit").addEventListener('click', submit_texts);