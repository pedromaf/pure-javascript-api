import { Api } from "../api.js"

class departamentos {

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

    static createDepartamentoDiv(departamento) {
        const departamentoDiv = document.createElement("div")
        const h3Nome = document.createElement("h3")
        const pDescricao = document.createElement("p")

        h3Nome.innerHTML = departamento.name
        pDescricao.innerHTML = departamento.description

        departamentoDiv.appendChild(h3Nome)
        departamentoDiv.appendChild(pDescricao)

        return departamentoDiv
    }

    static async pesquisarDepartamentos() {
        const nomeEmpresa = document.getElementById("pesquisarDepartamentoNomeEmpresa").value
        const nomeDepartamento = document.getElementById("pesquisarDepartamentoNome").value
        const listaDepartamentos = document.getElementById("listaDepartamentos")
        const searchTitle = document.getElementById("searchTitle")
        const data = {
            empresaName: nomeEmpresa,
            name: nomeDepartamento
        }
        
        if (nomeEmpresa == "") {
            alert("É necessário inserir o nome da empresa.")
            
            return
        }
        
        let response = await Api.getDepartamentos(data)

        listaDepartamentos.innerHTML = ""
        searchTitle.innerHTML = "Departamentos de " + nomeEmpresa
        
        if(Array.isArray(response)) {
            if (response.length > 0) {
                response.forEach(departamento => {
                    listaDepartamentos.appendChild(this.createDepartamentoDiv(departamento))
                })
            } else {
                listaDepartamentos.innerHTML = "Nenhum departamento encontrado."
            }
        } else {
            listaDepartamentos.appendChild(this.createDepartamentoDiv(response))
        }
    }
}

function pesquisarDepartamentosPageEventLoader() {
    const pesquisarButton = document.getElementById("pesquisarButton")

    pesquisarButton.addEventListener("click", event => {
        event.preventDefault()

        departamentos.pesquisarDepartamentos()
    })
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
    case "Pesquisar Departamentos":
        pesquisarDepartamentosPageEventLoader()
        break
    default:
}