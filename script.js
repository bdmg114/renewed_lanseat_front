const Uid_field = document.getElementById("Uid");
const Seat_select = document.getElementById("SeatSel");

function goto_reserve() {
    // 아이디를 입력하지 않아도 넘어가던 문제 수정
    if (Uid_field.value == "") {
        alert("아이디를 입력해주세요.");
        return;
    }

    let Uinfo = {
        "Uid": Uid_field.value,
        "SeatId": Seat_select.selectedIndex
    };
    window.localStorage.setItem('UserInfo', JSON.stringify(Uinfo));
    console.log(`${Seat_select.options[Seat_select.selectedIndex].text} ${Uid_field.value}`);
    window.location.href = './reserve.html';
}

// 좌석 목록 불러오기
async function renderSeats() {
    const response = await fetch("https://gghs2023.cafe24.com/seat_list");
    const data = await response.json();
    for (const seat of data) {
        // <option>을 추가해서
        const option = document.createElement('option');
        option.value = seat;
        option.textContent = seat.replace('_', ' ');

        // 드롭다운 리스트에 추가
        document.querySelector('.seatlist').append(option);
    }

    const info = JSON.parse(window.localStorage.getItem("UserInfo"));
    if (info != null) {
        console.log(info['SeatId']);
        Uid_field.value = info['Uid'];
        Seat_select.selectedIndex = Number(info['SeatId']);
        console.log(Seat_select.selectedIndex);
    }
}

// 신청 멘트 받아오기
async function fetchScrollTextsAndPopulate() {
    const response = await fetch("https://gghs2023.cafe24.com/scroll_texts");
    const data = await response.json();
    
    for (const text of data) {
        console.log(text.value);
        const li = document.createElement('li');
        li.textContent = text.value;
        document.querySelector('.banner > ul').append(li);
    }
}

renderSeats();
fetchScrollTextsAndPopulate();