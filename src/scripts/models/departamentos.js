import { Api } from "../api.js"

class departamentos {

    static async criarDepartamento() {
        const nomeDepartamento = document.getElementById("cadastroDepartamentoNome").value
        const descricaoDepartamento = document.getElementById("cadastroDepartamentoDescricao").value
        const nomeEmpresa = document.getElementById("cadastroDepartamentoNomeEmpresa").value
        const errorMsgList = document.getElementById("errorMsgList")
        const empresaId = await Api.getEmpresaIdByName(nomeEmpresa)

        if (nomeDepartamento == "" || descricaoDepartamento == "" || nomeEmpresa == "") {
            alert("Todos os campos devem ser preenchidos.")

            return
        }

        if (!empresaId) {
            alert("A empresa " + nomeEmpresa + " não está cadastrada.")

            return
        }

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

    static criarDepartamentoDiv(departamento) {
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
                    listaDepartamentos.appendChild(this.criarDepartamentoDiv
                (departamento))
                })
            } else {
                listaDepartamentos.innerHTML = "Nenhum departamento encontrado."
            }
        } else {
            listaDepartamentos.appendChild(this.criarDepartamentoDiv
        (response))
        }
    }

    static async editarDepartamento() {
        const empresa = document.getElementById("editarDepartamentoNomeEmpresa").value
        const departamento = document.getElementById("editarDepartamentoNome").value
        const novaDescricao = document.getElementById("editarDepartamentoDescricao").value

        if (empresa == "" || departamento == "" || novaDescricao == "") {
            alert("Todos os campos devem ser preenchidos.")

            return
        }

        const empresaId = await Api.getEmpresaIdByName(empresa)
        const departamentoId = await Api.getDepartamentoIdByName(departamento, empresaId)

        const data = {
            description: novaDescricao
        }

        const response = await Api.editarDepartamento(data, departamentoId)
        
        alert(response)
    }

    static async deletarDepartamento() {
        const empresa = document.getElementById("deletarDepartamentoNomeEmpresa").value
        const departamento = document.getElementById("deletarDepartamentoNome").value
        
        if(empresa == "" || departamento == "") {
            alert("Todos os campos devem ser preenchidos.")

            return
        }
        
        const empresaId = await Api.getEmpresaIdByName(empresa)
        const departamentoId = await Api.getDepartamentoIdByName(departamento, empresaId)

        const listaFuncionariosContratados = await Api.getFuncionariosByDepartamento(departamento, empresa)

        if (Array.isArray(listaFuncionariosContratados)) {
            if (listaFuncionariosContratados.length > 0) {
                listaFuncionariosContratados.forEach(async funcionario => {
                    let res = await Api.demitirFuncionario(funcionario.uuid, funcionario.username)
                })
            }
        } else {
            let res = await Api.demitirFuncionario(listaFuncionariosContratados.uuid, listaFuncionariosContratados.username)
        }

        const response = await Api.deletarDepartamento(departamentoId)
        
        alert(response)
    }

    static createFuncionarioDiv(funcionario) {
        const div = document.createElement("div")
        const nome = document.createElement("p")
        const email = document.createElement("p")
        const nivel = document.createElement("p")
        const tipo = document.createElement("p")

        nome.innerHTML = "Nome: " + funcionario.username
        email.innerHTML = "Email: " + funcionario.email
        nivel.innerHTML = "Proficiência: " + funcionario.professional_level
        tipo.innerHTML = "Modalidade de trabalho: " + funcionario.kind_of_work

        div.appendChild(nome)
        div.appendChild(email)
        div.appendChild(nivel)
        div.appendChild(tipo)

        return div
    }

    static async searchFuncionariosByDepartamento() {
        const empresa = document.getElementById("listagemFuncionariosNomeEmpresa").value
        const departamento = document.getElementById("listagemFuncionariosNomeDepartamento").value
        const listaFuncionarios = document.getElementById("listaFuncionarios")
        const searchTitle = document.getElementById("searchTitle")

        if (empresa == "" || departamento == "") {
            alert("Todos os campos devem ser preenchidos.")

            return
        }

        listaFuncionarios.innerHTML = ""
        searchTitle.innerHTML = ""

        const response = await Api.getFuncionariosByDepartamento(departamento, empresa)

        searchTitle.innerHTML = "Funcionários do " + departamento + " da " + empresa

        if (Array.isArray(response)) {
            if (response.length > 0) {
                response.forEach(funcionario => {
                    listaFuncionarios.appendChild(this.createFuncionarioDiv(funcionario))
                })
            } else {
                const p = document.createElement("p")
                p.innerHTML = "Nenhum funcionário encontrado."
                
                listaFuncionarios.appendChild(p)
            }
        } else {
            listaFuncionarios.appendChild(this.createFuncionarioDiv(response))
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

function editarDepartamentosPageEventLoader() {
    const editarButton = document.getElementById("editarButton")

    editarButton.addEventListener("click", event => {
        event.preventDefault()

        departamentos.editarDepartamento()
    })
}

function deletarDepartamentosPageEventLoader() {
    const deletarButton = document.getElementById("deletarButton")

    deletarButton.addEventListener("click", event => {
        event.preventDefault()

        departamentos.deletarDepartamento()
    })
}


function listagemFuncionariosPageEventLoader() {
    const searchButton = document.getElementById("pesquisarButton")

    searchButton.addEventListener("click", event => {
        event.preventDefault()

        departamentos.searchFuncionariosByDepartamento()
    })
}

switch(document.title) {
    case "Cadastrar Departamento":
        criarDepartamentosPageEventLoader()
        break
    case "Pesquisar Departamentos":
        pesquisarDepartamentosPageEventLoader()
        break
    case "Listagem de Funcionários":
        listagemFuncionariosPageEventLoader()
        break
    case "Editar Departamento":
        editarDepartamentosPageEventLoader()
        break
    case "Deletar Departamento":
        deletarDepartamentosPageEventLoader()
        break
    default:
}