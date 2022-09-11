import { Api } from "../api.js"

class dashboardAdmin {

    static listaEmpresasUser = new Array()

    static loadSetores() {
        const listaSetores = document.getElementById("listaSetoresDiv")
        const responseList = Api.getSetores()
        
        listaSetores.innerHTML = ""

        responseList.then(res => {
            if (res == null) {
                listaSetores.innerHTML = "Ocorreu um erro ao carregar a lista de setores."
            } else if (res.length == 0) {
                listaSetores.innerHTML = "Não há setores até o momento."
            } else if (Array.isArray(res)) {
                res.forEach(setor => {
                    let name = document.createElement("p")
                    
                    name.innerHTML = setor.description
    
                    listaSetores.appendChild(name)
                })
            } else {
                let name = document.createElement("p")
    
                name.innerHTML = res.description
    
                listaSetores.appendChild(name)
            }
        })
    }

    static pageContentLoad() {
        this.loadSetores()
    }
}

dashboardAdmin.pageContentLoad()