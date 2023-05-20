const validateForm = ({ title, description, startdate, enddate, location, time }) => {

    if (title.length <= 0) return { msg: 'invalid title', sts: false }
    if (location.length <= 0) return { msg: 'invalid location', sts: false }
    if (description.length <= 0) return { msg: 'invalid description', sts: false }
    if (!validateDate(startdate)) return { msg: 'invalid startdate', sts: false }
    if (!validateDate(enddate)) return { msg: 'invalid enddate', sts: false }
    if (time.length <= 0) return { msg: 'invalid time', sts: false }

    return { sts: 'success', msg: 'all fields are valid' }
}
function validateDate(dateStr) {
    if (!dateStr) {
        return false;
    }
    const currentDate = new Date();
    const inputDate = new Date(dateStr);
    return inputDate >= currentDate;
}
const readIdQueryParam = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params.id
}

function apiGetEventDetails() {
    const id = readIdQueryParam()

    axios.get(`http://localhost:8080/admin/events/${id}`)
        .then(httpReponse => httpReponse.data)
        .then(data => populateForm(document.getElementById('form-update-link'), data.bd))
        .catch(err => console.log(err))
}

function apiUpdateExistingForm(invoice, form) {
    axios.put('http://localhost:8080/admin/updateevent', invoice)
        .then(httpResponse => httpResponse.data)
        .then(data => console.log(data.msg))
        .then(res => {
            console.log(res)
            showSuccessModal()
        })
        .catch(err => console.log(err))
}

function populateForm(form, data) {
    const { elements } = form;

    const entries = Object.entries(data)

    for (const entry of entries) {
        const [key, value] = entry
        const inputField = elements.namedItem(key)
        if (inputField) inputField.value = value
    }

}

function setupForm() {
    const err = document.getElementById('errMsg')
    err.style.display = 'none'
    const formEvent = document.getElementById('form-update-link')

    formEvent.onsubmit = ev => {
        const formData = new FormData(ev.target)

        ev.preventDefault()

        const rawData = Object.fromEntries(formData.entries())
        const id = readIdQueryParam()
        const event = { ...rawData, id }
        const { sts, msg } = validateForm(rawData)
        if (sts) apiUpdateExistingForm(event, formEvent)
        else {
            err.style.display = 'block'
            err.innerHTML = `<strong>${msg}</strong>`
        }

    }

}

setupForm()

apiGetEventDetails()

function showSuccessModal() {
    const myModalEl = document.getElementById('successModal');
    const modal = new bootstrap.Modal(myModalEl)
    modal.show()
}
function logOut() {
    localStorage.setItem("userId", null)
    window.location.href = "../../loginpage/login.html"
}

function goToTicketSetting() {
    const id = readIdQueryParam()
    window.location.href = `./ticket.html?id=${id}`
}