const token = localStorage.getItem('token');

async function handleCancel(id) {
    try {
        const response = await fetch(`https://gghs2023.cafe24.com/cancel/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        
        // Replace the element with the class 'seat marked'
        const seatElement = document.getElementById(id);
        if (seatElement) {
            const markedDiv = document.createElement('div');
            markedDiv.classList.add('seat', 'marked');
            seatElement.parentNode.replaceChild(markedDiv, seatElement);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchData() {
    try {
        const response = await fetch(`https://gghs2023.cafe24.com/dash`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log(data);

        const lansContainer = document.querySelector('.lans');

        for (let key in data) {
            if (key === 'result' && !data[key]) {
                break;
            }

            // Create and append a header for each key
            const header = document.createElement('h3');
            header.textContent = key;
            lansContainer.appendChild(header);

            // Create and append a container div for each key
            const container = document.createElement('div');
            container.classList.add('container', key);
            lansContainer.appendChild(container);

            data[key][0].forEach((row, rowIndex) => {
                // Create a row div
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row', rowIndex.toString());
                container.appendChild(rowDiv);

                row.forEach((seat, seatIndex) => {
                    const seatElement = document.createElement(seat === '' ? 'div' : 'button');

                    if (seat === '') {
                        seatElement.classList.add('seat', 'empty');
                    } else if (seat === '-') {
                        seatElement.classList.add('seat', 'marked');
                    } else {
                        seatElement.classList.add('seat', 'occupied');
                        const parts = data[key][1][rowIndex].toString().split(',');
                        seatElement.id = parts[seatIndex];
                        seatElement.textContent = seat;
                        seatElement.addEventListener('click', () => handleCancel(seatElement.id));
                    }

                    rowDiv.appendChild(seatElement);
                });
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchData);