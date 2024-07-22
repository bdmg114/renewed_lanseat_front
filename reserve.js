// 좌석 렌더링
async function renderSeats() {
    const info = JSON.parse(window.localStorage.getItem("UserInfo"));
    if (info != null) {
        document.querySelector('.profile').innerHTML = `환영합니다. <strong>${info['Uid']}</strong>`;

        const seatResponse = await fetch(`https://gghs2023.cafe24.com/seat/${info['SeatId']}`);
        const seatData = await seatResponse.json();
        
        let index = 0;
        document.querySelector('.seat_name').textContent 
            = seatData['seat_name'].replace('_', ' ') + ' 랜선석';

        for (const key in seatData['seat_list']) {
            const row = document.createElement('div');
            row.className = `row ${index.toString()}`;
            document.querySelector('.container').appendChild(row);

            let j = 0;
            seatData['seat_list'][key].forEach(seat => {
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat';
                seatDiv.id = seat;

                if (seat === '') {
                    seatDiv.classList.add('empty');
                    seatDiv.id = null;
                } else if (seatData['reserved'][0][key][j] === '-') {
                    // do nothing, just keep the 'seat' class
                } else if (seatData['reserved'][0][key][j] === info['Uid']) {
                    seatDiv.classList.add('mine');
                } else {
                    seatDiv.classList.add('occupied');
                }
                row.appendChild(seatDiv);
                j += 1;
            });
            index += 1;
        }
    }
}

// 좌석 선택 처리
function selectSeat() {
    const container = document.querySelector('.container');

    let selected;
    container.addEventListener('click', e => {
        if (e.target.classList.contains('seat') &&
            !e.target.classList.contains('occupied') &&
            !e.target.classList.contains('empty')) {
            if (selected != null) {
                selected.classList.remove('selected');
            }
            e.target.classList.toggle('selected');
            selected = e.target;

            const selectedSeat = document.querySelector('.selected_seat');
            if (selectedSeat) {
                selectedSeat.textContent = `선택한 좌석:${selected.id}`;
            }
            const seatName = document.querySelector('.seat_name');
            if (seatName) {
                console.log(`${seatName.textContent.replace(' 랜선석', '').replace(' ', '_')}${selected.id.toString()}`);
            }
        }
    });

    const info = JSON.parse(window.localStorage.getItem("UserInfo"));
    console.log(info);
}

async function submit() {
    // Clear any previous errors
    const errorList = document.querySelector('.error ul');
    if (errorList) {
        errorList.innerHTML = '';
    }

    // Retrieve user information from localStorage
    const info = JSON.parse(window.localStorage.getItem("UserInfo"));

    // Check if info and selected seat are valid
    if (info != null && selected != null) {
        try {
            // Prepare the fetch request
            const response = await fetch("https://gghs2023.cafe24.com/reserve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    seat: `${document.querySelector('.seat_name').textContent.replace(' 랜선석', '').replace(' ', '_')}${selected.id}`,
                    student: info['Uid']
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (!result['result'] && result['error']) {
                // Display error message if reservation failed
                if (errorList) {
                    const errorItem = document.createElement('li');
                    errorItem.textContent = result['error'];
                    errorList.appendChild(errorItem);
                }
            } else {
                // Clear the selected seat and any previous errors on success
                selected.classList.remove('selected');
                selected = null;
                if (errorList) {
                    errorList.innerHTML = '';
                }
                location.reload();
            }
        } catch (error) {
            console.error("Error:", error);
            if (errorList) {
                const errorItem = document.createElement('li');
                errorItem.textContent = '예약 요청 중 오류가 발생했습니다.';
                errorList.appendChild(errorItem);
            }
        }
    } else {
        // Display an error if info or selected seat is invalid
        if (errorList) {
            const errorItem = document.createElement('li');
            errorItem.textContent = '정보를 입력하세요';
            errorList.appendChild(errorItem);
        }
    }
}

selectSeat();
renderSeats();