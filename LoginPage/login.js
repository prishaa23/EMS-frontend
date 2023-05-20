const forgotPasswordLink = document.getElementById("forgot-password");

forgotPasswordLink.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "./forgot-password/forgotpass.html";
});

const signup = document.getElementById("sign-up-page")
signup.addEventListener("click", function (event) {
  window.location.href = "../sign-up/signup.html"
});


const validateForm = ({ email, password }) => {

  if (email.length <= 0) return { msg: 'invalid email', sts: false }
  if (password.length <= 0) return { msg: 'invalid password', sts: false }

  return { sts: 'success', msg: 'all fields are valid' }
}

function setupForm() {

  const err = document.getElementById('errMsg')
  err.style.display = 'none'

  const formSignup = document.getElementById('formLogin')

  formSignup.onsubmit = ev => {

    ev.preventDefault()
    const formData = new FormData(ev.target)

    const user = Object.fromEntries(formData.entries())
    console.log(user)

    const { sts, msg } = validateForm(user)

    if (sts) apiLogin(user, formSignup)
    else {
      err.style.display = 'block'
      err.innerHTML = `<strong>${msg}</strong>`
    }
  }
}

setupForm()

function apiLogin(user, form) {
  const headers = {
    'content-type': 'application/json'
  }
  console.log("inside api")
  axios.post('http://localhost:8080/user/loginv2', user, { headers })
    .then(httpResponse => {
      form.reset()
      // console.log(httpResponse)
      console.log(httpResponse.data.bd)
      return httpResponse.data

    }).then(data => {
      console.log(data)
      const { role, id } = data.bd
      localStorage.setItem("userId", id)
      if (role === 'admin') window.location.href = '../dashboard/adminscreen/admin-dash.html'
      else window.location.href = '../dashboard/userscreen/user-dash.html'
    })
    .catch(err => {
      console.log(err)
      const errDv = document.getElementById('errMsg')
      errDv.style.display = 'block'
      errDv.innerHTML = `<strong>${err.response.data.msg}</strong>`
    })
}
