import { Api } from "../api.js";

class cadastro {

    static systemRegister() {

        const registerButton = document.getElementById("cadastroButton")
        const usernameField = document.getElementById("cadastroUsername")
        const emailField = document.getElementById("cadastroEmail")
        const passwordField = document.getElementById("cadastroPassword")
        const professionalLevelField = document.getElementById("cadastroProfessionalLevel")
        const errorMsgList = document.getElementById("errorMsgList")

        registerButton.addEventListener("click", async (event) => {
            event.preventDefault()

            const data = {
                password: passwordField.value,
                email: emailField.value,
                professional_level: professionalLevelField.value,
                username: usernameField.value
            }

            const response = Api.cadastro(data)

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

cadastro.systemRegister()