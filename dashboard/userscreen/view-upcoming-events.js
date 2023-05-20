
const validateForm = ({ location }) => {

    if (location.length <= 0) return { msg: 'Enter location to search', sts: false }

    return { sts: 'success', msg: 'all fields are valid' }
}

function setupTable() {

    const table = document.getElementById('tableEvent')

    const btnSearch = document.getElementById('btnSearch')

    btnSearch.onclick = () => {

        apiFetchAllLocationEvents(table, document.getElementById('location').value)
    }

    apiFetchAllEvents(table)
}

setupTable()

function propulateActualData(table, events) {
    while (table.rows.length > 1) {
        table.deleteRow(1)
    }
    for (const event of events) {
        const { id, title, startdate, enddate, location, time } = event
        const viewPageUrl = `./view-event.html?id=${id}`

        const row = table.insertRow()
        row.insertCell(0).innerHTML = id
        row.insertCell(1).innerHTML = title
        row.insertCell(2).innerHTML = startdate
        row.insertCell(3).innerHTML = enddate
        row.insertCell(4).innerHTML = location
        row.insertCell(5).innerHTML = time
      
        const bookSlotCell = row.insertCell(6);
        const bookSlotButton = document.createElement("button");
        bookSlotButton.textContent = "Book Slot";
        bookSlotButton.classList.add("button"); // Add CSS class for styling
        bookSlotButton.addEventListener("click", () => {
            // Handle book slot button click event here
            // You can redirect to the view page using the viewPageUrl
            // or perform any other desired action
            window.location.href = viewPageUrl;
        });
        
        bookSlotCell.appendChild(bookSlotButton);
    }
}


function apiFetchAllEvents(table) {

    axios.get('http://localhost:8080/admin/events')
        .then(res => {
            const { data } = res
            propulateActualData(table, data)
        })
        .catch(err => console.log(err))
}

function apiFetchAllLocationEvents(table, loc) {

    const url = `http://localhost:8080/attendee/events`
    axios.get(url, {
        params: {
            location: loc
        }
    })
        .then(res => {
            const { data } = res
            propulateActualData(table, data)
        })
        .catch(err => console.log(err))
}
function logOut() {
    localStorage.setItem("userId", null)
    window.location.href = "../../loginpage/login.html"
}