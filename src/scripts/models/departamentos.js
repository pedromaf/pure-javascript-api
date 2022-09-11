import { Api } from "../api.js"

class departamentos {

    static getDepartamentosByEmpresaName() {

    }

    static async criarDepartamento() {
        const nomeDepartamento = document.getElementById("cadastroDepartamentoNome").value
        const descricaoDepartamento = document.getElementById("cadastroDepartamentoDescricao").value
        const nomeEmpresa = document.getElementById("cadastroDepartamentoNomeEmpresa").value
        const errorMsgList = document.getElementById("errorMsgList")
        const empresaId = await Api.getEmpresaIdByName(nomeEmpresa)

        const data = {
            name: nomeDepartamento,
            description: descricaoDepartamento,
            company_uuid: empresaId
        }

        const response = await Api.cadastrarDepartamento(data)
        
        errorMsgList.innerHTML = ""

        if (response.error) {
            if (Array.isArray(response.error)) {
                response.error.forEach(element => {
                    let error = document.createElement("p")
                    error.innerText = element

                    errorMsgList.appendChild(error)
                });
            } else {
                let error = document.createElement("p")
                error.innerText = response.error

                errorMsgList.appendChild(error)
            }
        }
    }
}



function criarDepartamentosPageEventLoader() {
    const cadastroButton = document.getElementById("cadastroButton")

    cadastroButton.addEventListener("click", event => {
        event.preventDefault()

        departamentos.criarDepartamento()
    })
}


switch(document.title) {
    case "Cadastrar Departamento":
        criarDepartamentosPageEventLoader()
        break
    default:
}