import { Api } from "../api.js"

class funcionarios {

    static createFuncionarioDiv(funcionario) {
        const div = document.createElement("div")
        const nome = document.createElement("h3")
        const nivel = document.createElement("p")
        const tipo = document.createElement("p")

        nome.innerHTML = funcionario.username
        nivel.innerHTML = "Nível " + funcionario.professional_level
        tipo.innerHTML = "Modalidade: " + funcionario.kind_of_work

        div.appendChild(nome)
        div.appendChild(nivel)
        div.appendChild(tipo)

        return div
    }

    static async pesquisarFuncionarios() {
        const nomeEmpresa = document.getElementById("searchEmpresaName").value
        const nomeDepartamento = document.getElementById("searchDepartamentoName").value
        const listaFuncionariosTitle = document.getElementById("listaFuncionariosTitle")
        const searchResultDiv = document.getElementById("searchResultDiv")
        const errorMsgList = document.getElementById("errorMsgList")
        const data = {
            empresa: nomeEmpresa,
            departamento: nomeDepartamento
        }

        errorMsgList.innerHTML = ""
        searchResultDiv.innerHTML = ""

        listaFuncionariosTitle.innerHTML = "Funcionários do " + nomeDepartamento + " da " + nomeEmpresa

        if(!data.empresa) {
            const erroEmpresa = document.createElement("p")
            erroEmpresa.innerHTML = "Nome da empresa não pode ser vazio."
            errorMsgList.appendChild(erroEmpresa)
        }

        if(!data.departamento) {
            const erroDepartamento = document.createElement("p")
            erroDepartamento.innerHTML = "Nome do departamento não pode ser vazio."
            errorMsgList.appendChild(erroDepartamento)
        }

        const response = await Api.getListaFuncionarios(data)

        if(response.length > 0) {
            response.forEach(funcionario => {
                searchResultDiv.appendChild(this.createFuncionarioDiv(funcionario))
            })
        } else {
            searchResultDiv.innerHTML = "Nenhum funcionário encontrado." 
        }
    }

    static async contratarFuncionario() {
        const nomeEmpresa = document.getElementById("contratarEmpresaName").value
        const nomeDepartamento = document.getElementById("contratarDepartamentoName").value
        const nomeUsuario = document.getElementById("contratarUsuarioName").value

        if (nomeEmpresa == "" || nomeDepartamento == "" || nomeUsuario == "") {
            alert("Todos os campos devem ser preenchidos.")
            
            return 
        }

        const empresaId = await Api.getEmpresaIdByName(nomeEmpresa)
        const departamentoId = await Api.getDepartamentoIdByName(nomeDepartamento, empresaId)
        const usuarioId = await Api.getUsuarioIdByName(nomeUsuario)

        const data = {
            user_uuid: usuarioId,
            department_uuid: departamentoId
        }

        const response = await Api.contratarFuncionario(data, nomeUsuario)
        alert(response)
    }
}

function contratarFuncionarioPageEventLoader() {
    const contratarButton = document.getElementById("contratarButton")

    contratarButton.addEventListener("click", event => {
        event.preventDefault()

        funcionarios.contratarFuncionario()
    })
}

function pesquisarFuncionariosPageEventLoader() {
    const searchButton = document.getElementById("searchButton")

    searchButton.addEventListener("click", event => {
        event.preventDefault()

        funcionarios.pesquisarFuncionarios()
    })
}

switch(document.title) {
    case "Pesquisar Funcionários":
        pesquisarFuncionariosPageEventLoader()
        break
    case "Contratar Funcionário":
        contratarFuncionarioPageEventLoader()
        break
    default:
}