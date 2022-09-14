import { Api } from "../api.js"

class dashboardAdmin {

    static listaEmpresasUser = new Array()

    static async loadSetores() {
        const listaSetores = document.getElementById("listaSetoresDiv")
        const responseList = await Api.getSetores()
        
        listaSetores.innerHTML = ""

        if (responseList == null) {
            listaSetores.innerHTML = "Ocorreu um erro ao carregar a lista de setores."
        } else if (responseList.length == 0) {
            listaSetores.innerHTML = "Não há setores até o momento."
        } else if (Array.isArray(responseList)) {
            responseList.forEach(setor => {
                let name = document.createElement("p")
                
                name.innerHTML = setor.description

                listaSetores.appendChild(name)
            })
        } else {
            let name = document.createElement("p")

            name.innerHTML = responseList.description

            listaSetores.appendChild(name)
        }
    }

    static async loadDepartamentos() {
        const listaDepartamentos = document.getElementById("listaDepartamentos")
        let departamentos = await Api.getAllDepartamentos()

        if (departamentos == null) {
            listaDepartamentos.innerHTML = "Ocorreu um erro ao carregar a lista de setores."
        } else if (departamentos.length == 0) {
            listaDepartamentos.innerHTML = "Não há setores até o momento."
        } else if (Array.isArray(departamentos)) {
            departamentos.forEach(departamento => {
                let name = document.createElement("h3")
                let description = document.createElement("p")

                name.innerHTML = departamento.name
                description.innerHTML = departamento.description

                listaDepartamentos.appendChild(name)
                listaDepartamentos.appendChild(description)
            })
        } else {
            let name = document.createElement("h3")

            name.innerHTML = listaDepartamentos.name
            description.innerHTML = listaDepartamentos.description

            listaDepartamentos.appendChild(name)
            listaDepartamentos.appendChild(description)
        }
    }

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

    static async loadFuncionarios() {
        const listaFuncionarios = document.getElementById("listaFuncionarios")
        const response = await Api.getAllFuncionarios()

        listaFuncionarios.innerHTML = ""

        if (Array.isArray(response)) {
            if(response.length > 0) {
                response.forEach(funcionario => {
                    listaFuncionarios.appendChild(this.createFuncionarioDiv(funcionario))
                })
            } else {
                const p = document.createElement("p")
                p.innerHTML = "Não há funcionários cadastrados."
                listaFuncionarios.appendChild(p)
            }
        } else {
            listaFuncionarios.appendChild(this.createFuncionarioDiv(response))
        }   
    }

    static pageContentLoad() {
        this.loadSetores()
        this.loadDepartamentos()
        this.loadFuncionarios()
    }
}

dashboardAdmin.pageContentLoad()