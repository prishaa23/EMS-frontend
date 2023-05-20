const validateTicket = ({ price }) => {

    if (price <= 0) return { msg: 'Price must be greater than 0', sts: false }

    return { sts: 'success', msg: 'all fields are valid' }
}

const readIdQueryParam = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params.id
}

function goBack() {
    window.history.back();
}
function backToUpdate() {
    window.history.back();
}


function setupForm() {

    const err = document.getElementById('errMsg')
    err.style.display = 'none'

    const formSignup = document.getElementById('set-ticket-form')

    formSignup.onsubmit = ev => {
        ev.preventDefault()

        const formData = new FormData(ev.target)

        const user = Object.fromEntries(formData.entries())
        console.log(user)

        const { sts, msg } = validateTicket(user)

        if (sts) apiSignup(user, formSignup)
        else {
            err.style.display = 'block'
            err.innerHTML = `<strong>${msg}</strong>`
        }
    }
}

setupForm()

function apiSignup(user, form) {
    const headers = {
        'content-type': 'application/json'
    }
    const id = readIdQueryParam()
    axios.post(`http://localhost:8080/admin/events/${id}/tickets`, user, { headers })
        .then(res => {
            showSuccessTicket()
        }).catch(err => console.log(err))
}


function showSuccessTicket() {
    const myModalEl = document.getElementById('successModal');
    const modal = new bootstrap.Modal(myModalEl)
    modal.show()
}