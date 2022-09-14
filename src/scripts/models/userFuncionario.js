import { Api } from "../api.js"

class userFuncionario {

    static createEmpresaDiv(empresa) {
        const div = document.createElement("div")
        const nome = document.createElement("h3")
        const descricao = document.createElement("p")
        const horaAbertura = document.createElement("p")
    
        nome.innerHTML = empresa.name
        descricao.innerHTML = empresa.description
        horaAbertura.innerHTML = empresa.opening_hours

        div.appendChild(nome)
        div.appendChild(horaAbertura)
        div.appendChild(descricao)

        return div
    }

    static async loadMinhaEmpresa() {
        const empresa = document.getElementById("empresaDiv")

        const response = await Api.getAllDepartamentosFromMinhaEmpresa()

        if(response.error) {
            empresa.innerHTML = "Você não pertence a nenhuma empresa."
            
            return
        }

        const empresaId = response.uuid

        const minhaEmpresa = await Api.getEmpresaById(empresaId)

        empresa.appendChild(this.createEmpresaDiv(minhaEmpresa))
    }

    static createDepartamentoDiv(departamento) {
        const div = document.createElement("div")
        const nome = document.createElement("h3")
        const descricao = document.createElement("p")

        nome.innerHTML = departamento.name
        descricao.innerHTML = departamento.description

        div.appendChild(nome)
        div.appendChild(descricao)

        return div
    }

    static async loadMeuDepartamento() {
        const departamentoDiv = document.getElementById("departamentoDiv")
        
        const response = await Api.getMeuDepartamento()
        
        if(response == null || response.error) {
            departamentoDiv.innerText = "Você não pertence a um departamento."
            return
        }

        departamentoDiv.appendChild(this.createDepartamentoDiv(response))
    
    }

    static async loadMeusColegasTrabalho() {
        const listaColegas = document.getElementById("listaColegas")

        const response = await Api.getColegasTrabalho()

        if(Array.isArray(response)) {
            if(response.length > 0) {
                response.forEach(usuario => {
                    listaColegas.appendChild(createUserDiv(usuario))
                })
            } else {
                const p = document.createElement("p")
                p.innerHTML = "Você não possui colegas de trabalho."
                
                listaColegas.appendChild(p)
            }
        } else {
            listaColegas.appendChild(createUserDiv(response))
        }
    }
}

function loadPageContent() {
    userFuncionario.loadMinhaEmpresa()
    userFuncionario.loadMeuDepartamento()
    userFuncionario.loadMeusColegasTrabalho()
}

loadPageContent()