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
                let name = document.createElement("p")
                let description = document.createElement("p")

                name.innerHTML = departamento.name
                description.innerHTML = departamento.description

                listaDepartamentos.appendChild(name)
                listaDepartamentos.appendChild(description)
            })
        } else {
            let name = document.createElement("p")

            name.innerHTML = listaDepartamentos.name
            description.innerHTML = listaDepartamentos.description

            listaDepartamentos.appendChild(name)
            listaDepartamentos.appendChild(description)
        }
    }

    static pageContentLoad() {
        this.loadSetores()
        this.loadDepartamentos()
    }
}

dashboardAdmin.pageContentLoad()