const readIdQueryParam = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params.id
}

function apiGetEventDetails() {
    const id = readIdQueryParam()

    axios.get(`http://localhost:8080/admin/events/${id}`)
        .then(function (response) {
            console.log(JSON.stringify(id));
            const data = response.data.bd;
            console.log(JSON.stringify(response.data));
          
            document.getElementById('title').textContent = data.title;
            document.getElementById('description').textContent = data.description;
            document.getElementById('startdate').textContent = data.startdate;
            document.getElementById('enddate').textContent = data.enddate;
            document.getElementById('time').textContent = data.time;
            document.getElementById('location').textContent = data.location;
            document.getElementById('fid').value = id;
            alert( document.getElementById('fid').value);
            //console.log(JSON.stringify(data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

function setupForm() {
    const formEvent = document.getElementById('view-eventdetails')

    formEvent.onsubmit = ev => {
        ev.preventDefault()
        showSuccessModal()
    }
}

setupForm()

apiGetEventDetails()

function logOut() {
    localStorage.setItem("userId", null)
    window.location.href = "../../loginpage/login.html"
}

function showSuccessModalEventBook() {
    const myModalEl = document.getElementById('successModalEventByUserId');
    const modal = new bootstrap.Modal(myModalEl)
    modal.show()
}

function bookEventByUserId() {
    const userId = localStorage.getItem("userId");

    const eventId = readIdQueryParam()

    const headers = {
        'content-type': 'application/json'
    }
    axios.post(`http://localhost:8080/attendee/${userId}/event/${eventId}`, { headers })

        .then(res => {
            showSuccessModalEventBook()
            hideSetBookEvent()
        }).catch(err => console.log(err))
}

function hideSetBookEvent() {
    const container = document.getElementById("successModal");
    container.style.display = "none";
}

function showSuccessModal() {
    const myModalEl = document.getElementById('successModal');
    const modal = new bootstrap.Modal(myModalEl)
    modal.show()
}
function showPrice() {
    var eventId = document.getElementById('fid').value;
    axios
        .get(`http://localhost:8080/attendee/tickets/${eventId}`)
        .then(response => {
            const data = response.data;

            if (data && data.length > 0) {
                const ticketPrices = data.map(item => `<li>${item.type}: ${item.price}</li>`).join('');

                const span1 = document.getElementById('span1');
                span1.innerHTML = `<ul>${ticketPrices}</ul>`;
            } else {
                const span1 = document.getElementById('span1');
                span1.textContent = 'Price data not available';
            }
        })
        .catch(err => {
            console.log(err);
            const span1 = document.getElementById('span1');
            span1.textContent = 'Error fetching prices';
});
}
 
  
  
  

  
  
  
  