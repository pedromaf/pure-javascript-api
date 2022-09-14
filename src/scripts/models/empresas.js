import { Api } from "../api.js";

class empresas {

    static async getListaDepartamentos(empresa) {
        let listaDepartamentos = []
        const data = {
            empresaName: empresa,
            name: null
        }
        const response = await Api.getDepartamentos(data)
        

        if (response) {
            if (Array.isArray(response)) {
                response.forEach(element => {
                    listaDepartamentos.push(element)
                })
            } else {
                listaDepartamentos.push(response)
            }
        }

        return listaDepartamentos
    }

    static async createCarrosselDiv(empresa) {
        const carrosselDiv = document.createElement("div")
        const prevButton = document.createElement("button")
        const nextButton = document.createElement("button")
        const departamentoDiv = document.createElement("div")
        const listaDepartamentos = await this.getListaDepartamentos(empresa.name)
        let DivId = 0

        carrosselDiv.id = empresa.name.replaceAll(" ", "") + "CarrosselDiv"
        carrosselDiv.className = "carrosselDepartamentos"

        if(!listaDepartamentos || !listaDepartamentos.length) {
            const pMsg = document.createElement("p")
            pMsg.innerHTML = "Não possui departamentos."
            carrosselDiv.appendChild(pMsg)
            
            return carrosselDiv
        }

        listaDepartamentos.forEach(departamento => {
            let div = document.createElement("div")
            let pNome = document.createElement("p")
            let pDescricao = document.createElement("p")

            div.id = empresa.name.replaceAll(" ", "") + DivId++
            div.style.display = "none"

            pNome.innerHTML = departamento.name
            pDescricao.innerHTML = departamento.description

            div.appendChild(pNome)
            div.appendChild(pDescricao)

            departamentoDiv.appendChild(div)
        })

        departamentoDiv.firstElementChild.style.display = "block"

        prevButton.innerHTML = "Anterior"
        nextButton.innerHTML = "Próximo"

        prevButton.className = "prevButton"
        departamentoDiv.className = "listaDepartamentosDiv"
        nextButton.className = "nextButton"

        carrosselDiv.appendChild(prevButton)
        carrosselDiv.appendChild(departamentoDiv)
        carrosselDiv.appendChild(nextButton)

        return carrosselDiv
    }

    static async createEmpresaDiv(empresa, simplified = false) {
        let empresaDiv = document.createElement("div")
        let name = document.createElement("h3")
        let description = document.createElement("p")
        let sector = document.createElement("p")
        let openingHours = document.createElement("p")

        name.innerHTML = empresa.name
        description.innerHTML = "Descrição: " + empresa.description
        sector.innerHTML = "Setor: " + empresa.sectors["description"]
        openingHours.innerHTML = "Abre às: " + empresa.opening_hours

        empresaDiv.appendChild(name)
        empresaDiv.appendChild(sector)
        empresaDiv.appendChild(openingHours)
        
        if(!simplified) {
            let departaments = document.createElement("p")
            let carrosselDiv = await this.createCarrosselDiv(empresa)
        
            departaments.innerHTML = "Departamentos: "
            
            empresaDiv.appendChild(departaments)
            empresaDiv.appendChild(carrosselDiv)
        }

        empresaDiv.appendChild(description)

        return empresaDiv
    }

    static async searchEmpresaByName(name) {
        const resultDiv = document.getElementById("searchEmpresaResult")
        let response = null

        resultDiv.innerHTML = ""

        if (name) {
            response = await Api.getEmpresaByName(name)
        } else {
            alert("Digite o nome da empresa para fazer a pesquisa.")
            
            return
        }

        if(!response) {
            const p = document.createElement("p")

            p.innerHTML = "Nenhuma empresa encontrada."
            
            resultDiv.appendChild(p)
        } else {
            let empresaDiv = await this.createEmpresaDiv(response)

            resultDiv.appendChild(empresaDiv)

            loadCarrosselButtonEvents(empresaDiv)
        }
    }

    static async loadListaEmpresas(filter = null, simplified = false) {
        const listaEmpresas = document.getElementById("listaEmpresas")
        let appliedFilter = null
        let responseList

        if(filter) {
            appliedFilter = document.getElementById("appliedFilter")
            appliedFilter.innerHTML = ""
        }

        listaEmpresas.innerHTML = ""

        if (filter && filter != "Nenhum") {
            appliedFilter.innerHTML = "Setor: " + filter 
            responseList = await Api.getListaEmpresas(filter)
        } else {
            responseList = await Api.getListaEmpresas()
        }
        
        if (responseList == null) {
            listaEmpresas.innerHTML = "Ocorreu um erro ao carregar a lista de empresas."
        } else if (responseList.length == 0) {
            listaEmpresas.innerHTML = "Nenhuma empresa encontrada neste setor."
        } else if (Array.isArray(responseList)) {
            responseList.forEach(async empresa => {
                let empresaDiv = await this.createEmpresaDiv(empresa, simplified)
                
                listaEmpresas.appendChild(empresaDiv)

                loadCarrosselButtonEvents(empresaDiv)
            })
        } else {
            let empresaDiv = await this.createEmpresaDiv(responseList, simplified)

            listaEmpresas.appendChild(empresaDiv)

            loadCarrosselButtonEvents(empresaDiv)
        }
    }

    static async populateSetorSelect() {
        const select = document.getElementById("setorSelect")
        const listaSetores = await Api.getSetores()
        let option

        option = document.createElement("option")
        option.value = "Nenhum"
        option.innerHTML = "Nenhum"

        select.appendChild(option)

        if (Array.isArray(listaSetores)) {
            if (listaSetores.length > 0) {
                listaSetores.forEach(setor => {
                    option = document.createElement("option")
                    option.value = setor.description
                    option.innerHTML = setor.description

                    select.appendChild(option)
                })
            }
        } else {
            option = document.createElement("option")
            option.value = listaSetores.description
            option.innerHTML = listaSetores.description

            select.appendChild(option)
        }
    }

    static async cadastrarEmpresa() {
        const nome = document.getElementById("cadastroEmpresaNome").value
        const descricao = document.getElementById("cadastroEmpresaDescricao").value
        const horaAbertura = document.getElementById("cadastroEmpresaHoraAbertura").value
        const setor = document.getElementById("setorSelect").value
        const errorMsgList = document.getElementById("errorMsgList")
        const responseSetorId = await Api.getSetorId(setor)

        if(nome == "" || descricao == "" || horaAbertura == "" || setor == "") {
            alert("Todos os campos devem ser preenchidos.")

            return
        }

        if (!responseSetorId) {
            alert("O setor " + setor + " não está cadastrado na plataforma.")
        }

        const data = {
            name: nome,
            description: descricao,
            opening_hours: horaAbertura,
            sector_uuid: responseSetorId
        }
        
        const responseCreation = await Api.cadastrarEmpresa(data)
        
        errorMsgList.innerHTML = ""

        if (responseCreation.error) {
            if (Array.isArray(responseCreation.error)) {
                responseCreation.error.forEach(element => {
                    let error = document.createElement("p")
                    error.innerText = element

                    errorMsgList.appendChild(error)
                });
            } else {
                let error = document.createElement("p")
                error.innerText = responseCreation.error

                errorMsgList.appendChild(error)
            }
        }
    }
}

function loadCarrosselButtonEvents(empresaDiv) {
    const carrosselDiv = empresaDiv.childNodes

    carrosselDiv.forEach(node => {
        if (node.className == "carrosselDepartamentos") {
            node.childNodes.forEach(child => {
                if(child.className == "prevButton") {
                    child.addEventListener("click", event => {
                        event.preventDefault()

                        let currentDepartamentoPrev
                        let previousDepartamento
                        let currentIndexPrev = 0
                        let finalDepartamentoFlag = false
                        let foundFlag = false
                        let nomeEmpresa = node.id.replace("CarrosselDiv", "")
                        
                        currentDepartamentoPrev = document.getElementById(nomeEmpresa + currentIndexPrev)

                        while (currentDepartamentoPrev) {
                            if (currentDepartamentoPrev.style.display == "block") {
                                foundFlag = true
                                if (previousDepartamento && currentDepartamentoPrev != previousDepartamento) {
                                    currentDepartamentoPrev.style.display = "none"
                                    previousDepartamento.style.display = "block"
                                    
                                    break
                                } else if (!previousDepartamento) {
                                    currentDepartamentoPrev.style.display = "none"
                                    finalDepartamentoFlag = true
                                }
                            }

                            if (!foundFlag) {
                                let next = document.getElementById(nomeEmpresa + ++currentIndexPrev)
                                if (!next) {
                                    currentDepartamentoPrev.style.display = "none"
                                    previousDepartamento.style.display = "block"
                                    
                                    break
                                }
                                previousDepartamento = currentDepartamentoPrev
                                currentDepartamentoPrev = next
                            } else {
                                previousDepartamento = currentDepartamentoPrev
                                currentDepartamentoPrev = document.getElementById(nomeEmpresa + ++currentIndexPrev)
                            }
                        }

                        if (finalDepartamentoFlag) {
                            previousDepartamento.style.display = "block"
                        }
                    })
                }

                if(child.className == "nextButton") {
                    child.addEventListener("click", event => {
                        event.preventDefault()

                        let currentDepartamento
                        let currentIndex = 0
                        let nomeEmpresa = node.id.replace("CarrosselDiv", "")
                        
                        currentDepartamento = document.getElementById(nomeEmpresa + currentIndex)

                        while (currentDepartamento) {
                            if (currentDepartamento.style.display == "block") {
                                let next = document.getElementById(nomeEmpresa + ++currentIndex)
                                
                                currentDepartamento.style.display = "none"

                                if (next) {
                                    next.style.display = "block"
                                    
                                    break
                                } else {
                                    currentDepartamento = document.getElementById(nomeEmpresa + 0)
                                    currentDepartamento.style.display = "block"
                                }
                            }

                            currentDepartamento = document.getElementById(nomeEmpresa + ++currentIndex)
                        }
                    })
                }
            })
        }
    })
}

function setorFilterEventLoader() {
    const filterButton = document.getElementById("filterButton")
    const clearFilterButton = document.getElementById("clearFilterButton")

    filterButton.addEventListener("click", (event) => {
        event.preventDefault()

        const filter = document.getElementById("setorSelect").value

        empresas.loadListaEmpresas(filter)
    })

    clearFilterButton.addEventListener("click", (event) => {
        event.preventDefault()

        empresas.loadListaEmpresas()
    })
}

function homeSetorFilterEventLoader() {
    const filterButton = document.getElementById("filterButton")
    const clearFilterButton = document.getElementById("clearFilterButton")

    filterButton.addEventListener("click", (event) => {
        event.preventDefault()

        const filter = document.getElementById("filterSector").value

        empresas.loadListaEmpresas(filter, true)
    })

    clearFilterButton.addEventListener("click", (event) => {
        event.preventDefault()

        empresas.loadListaEmpresas(null, true)
    })
}

function cadastrarEmpresaPageEventLoader() {
    const cadastroButton = document.getElementById("cadastroButton")

    cadastroButton.addEventListener("click", async (event) => {
        event.preventDefault()
        
        empresas.cadastrarEmpresa()
    })
}

function pesquisarEmpresaPageEventLoader() {
    const searchButton = document.getElementById("searchButton")

    searchButton.addEventListener("click", event => {
        event.preventDefault()
        const searchName = document.getElementById("empresaNome").value

        empresas.searchEmpresaByName(searchName)
    })
}

switch(document.title) {
    case "Home":
        empresas.loadListaEmpresas(null, true)
        homeSetorFilterEventLoader()
        break
    case "Listar Empresas":
        empresas.loadListaEmpresas(null)
        empresas.populateSetorSelect()
        setorFilterEventLoader()
        break
    case "Cadastrar Empresa":
        empresas.populateSetorSelect()
        cadastrarEmpresaPageEventLoader()
        break
    case "Pesquisar Empresa":
        pesquisarEmpresaPageEventLoader()
        break
    case "Dashboard Admin":
        empresas.loadListaEmpresas(null, false)
        break
    default:
}