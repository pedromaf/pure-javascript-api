import { Api } from "../api.js"

class login {

    static systemLogin() {
        
        const loginButton = document.getElementById("loginButton")
        const emailField = document.getElementById("loginEmail")
        const passwordField = document.getElementById("loginPassword")
        const errorMsgList = document.getElementById("errorMsgList")

        loginButton.addEventListener("click", async (event) => {
            event.preventDefault()
            
            const data = {
                email: emailField.value,
                password: passwordField.value
            }

            const response = Api.login(data)

            response.then((res) => {
                errorMsgList.innerHTML = ""
                
                if (res.error) {
                    if (Array.isArray(res.error)) {
                        res.error.forEach(element => {
                            let error = document.createElement("p")
                            error.innerText = element
    
                            errorMsgList.appendChild(error)
                        });
                    } else {
                        let error = document.createElement("p")
                        error.innerText = res.error
    
                        errorMsgList.appendChild(error)
                    }
                }
            })
        })
    }
}

login.systemLogin()