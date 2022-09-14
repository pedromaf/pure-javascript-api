export class Api {

    static tokenName = "@Empresas:token"
    static isAdminName = "@Empresas:is_admin"
    static uuidName = "@Empresas:uuid"

    static baseUrl = "http://localhost:6278/"
    static token = localStorage.getItem(this.tokenName) || null
    static isAdmin = localStorage.getItem(this.isAdminName) || null
    static uuid = localStorage.getItem(this.uuidName) || null
    static headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`
    }

    static async login(data) {
        const url = this.baseUrl + "auth/login"
        let responseStatusCode = null

        const response = await fetch(url,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                responseStatusCode = res.status
                return res
            })
            .then(res => res.json())
        
        if (responseStatusCode == 200) {
            localStorage.setItem(this.tokenName, response.token)
            localStorage.setItem(this.isAdminName, response.is_admin)
            localStorage.setItem(this.uuidName, response.uuid)
            
            if(response.is_admin) {
                window.location.assign("dashboardAdmin.html")
            } else {
                window.location.assign("dashboardUser.html")
            }
        }

        return response
    }

    static logout() {
        localStorage.setItem(this.tokenName, null)
        localStorage.setItem(this.isAdminName, null)
        localStorage.setItem(this.uuidName, null)

        window.location.assign("../../index.html")
    }

    static async cadastro(data) {
        const url = this.baseUrl + "auth/register/user"
        let responseStatusCode

        const response = await fetch(url,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                responseStatusCode = res.status
                return res
            })
            .then(res => res.json())
        
        if (responseStatusCode == 201) {
            alert("Cadastro realizado com sucesso.")
            window.location.assign("src/pages/login.html")
        }

        return response
    }

    static async getListaEmpresas(sector = null) {
        let url = this.baseUrl + "companies"
        
        if (sector) {
            url += "/" + sector
        }

        return await fetch(url, {
            method: "GET",
            headers: this.headers
        })
        .then(res => {
            if (res.status == 200) {
                return res
            } else {
                return null
            }
        })
        .then(res => res.json())
    }

    static async getEmpresaByName(name) {
        const listaEmpresas = await this.getListaEmpresas()
        let searchResult = null

        if(listaEmpresas) {
            if(Array.isArray(listaEmpresas)) {
                listaEmpresas.forEach(empresa => {
                    if (empresa.name == name) {
                        searchResult = empresa
                    }
                })
            } else {
                if (listaEmpresas.name == name) {
                    return listaEmpresas
                }
            }
        }

        return searchResult
    }

    static async getEmpresaIdByName(nomeEmpresa) {
        const empresa = await this.getEmpresaByName(nomeEmpresa)

        if(empresa == null) {
            return null
        } else {
            return empresa.uuid
        }
    }

    static async getSetores() {
        const url = this.baseUrl + "sectors"

        return await fetch(url,
            {
                method: "GET",
                headers: this.headers
            })
            .then(res => {
                if (res.status == 200) {
                    return res
                } else {    
                    return null
                }
            })
            .then(res => res.json())
    }

    static async getSetorId(description) {
        const sectorsList = this.getSetores()
        let sectorId = null

        const response = await sectorsList.then(res => {
            if (res == null) {
                return null
            } else if (res == 0) {
                return res
            } else if (Array.isArray(res)) {
                res.forEach(sector => {
                    if (sector.description == description) {
                        sectorId = sector.uuid
                    }
                })
            } else {
                if (res.description == description) {
                    sectorId = res.uuid
                }
            }

            return res
        })

        return sectorId
    }

    static async getDepartamentos(data) {
        const empresaId = await this.getEmpresaIdByName(data.empresaName)
        const url = this.baseUrl + "departments/" + empresaId
        let returnDepartamento = null

        const response = await fetch(url,
            {
                method: "GET",
                headers: this.headers
            })
            .then(res => res.json())
        
        returnDepartamento = response
        
        if (returnDepartamento && Array.isArray(response)) {
            if(data.name) {
                returnDepartamento = []
                response.forEach(departamento => {
                    if(departamento.name == data.name) {
                        returnDepartamento = departamento
                    }
                })
            }
        }

        return returnDepartamento
    }

    static async getFuncionariosByDepartamento(nomeDepartamento, nomeEmpresa) {
        const empresaId = await this.getEmpresaIdByName(nomeEmpresa)
        const departamentoId = await this.getDepartamentoIdByName(nomeDepartamento, empresaId)
        const usuarios = await this.getAllUsers()
        let listaFuncionarios = []

        if (Array.isArray(usuarios)) {
            if (usuarios.length > 0) {
                usuarios.forEach(usuario => {
                    if (usuario.department_uuid == departamentoId) {
                        listaFuncionarios.push(usuario)
                    }
                })
            }
        } else {
            if (usuarios.department_uuid == departamentoId) {
                listaFuncionarios.push(usuarios)
            }
        }

        return listaFuncionarios
    }

    static verifyCompanieName(departamento, empresaId) {
        const empresas = departamento.companies

        if (Array.isArray(empresas)) {
            empresas.forEach(empresa => {
                if (empresa.uuid == empresaId) {
                    return true
                }
            })
        } else if (empresas.uuid == empresaId) {
            return true
        }

        return false
    }

    static async getDepartamentoIdByName(nomeDepartamento, empresaId) {
        const url = this.baseUrl + "departments"
        let departamentoId = null

        const response = await fetch(url,
            {
                method: "GET",
                headers: this.headers
            })
            .then(res => res.json())

        if(Array.isArray(response)) {
            if(response.length > 0) {
                response.forEach(departamento => {
                    if(departamento.name == nomeDepartamento) {
                        if (this.verifyCompanieName(departamento, empresaId)) {
                            departamentoId = departamento.uuid
                        }
                    }
                })
            }
        } else {
            if(response.name == nomeDepartamento) {
                if (this.verifyCompanieName(response, empresaId)) {
                    departamentoId = response.uuid
                }
            }
        }

        return departamentoId
    }

    static async getAllUsers() {
        const url = this.baseUrl + "users"
        
        return await fetch(url,
            {
                method: "GET",
                headers: this.headers
            })
            .then(res => res.json())
    }

    static async getListaFuncionarios(data) {
        const allUsers = this.getAllUsers()
        const empresaId = this.getEmpresaIdByName(data.empresa)
        const departamentoId = this.getDepartamentoIdByName(data.departamento, empresaId)
        const listaFuncionarios = []

        if(Array.isArray(allUsers)) {
            allUsers.forEach(user => {
                if(user.department_uuid == departamentoId) {
                    listaFuncionarios.push(user)
                }
            })
        } else if (allUsers.department_uuid == departamentoId) {
            listaFuncionarios.push(allUsers)
        }

        return listaFuncionarios
    }

    static async getUsuariosSemDepartamento() {
        const url = this.baseUrl + "admin/out_of_work"

        const response = await fetch(url,
            {
                method: "GET",
                headers: this.headers
            })
            .then(res => res.json())
        
        return response
    }

    static async getUsuarioIdByName(nomeUsuario) {
        const usuarios = await this.getAllUsers()
        let usuarioId = null

        if (Array.isArray(usuarios)) {
            if (usuarios.length > 0) {
                usuarios.forEach(usuario => {
                    if(usuario.username == nomeUsuario) {
                        usuarioId = usuario.uuid
                        return
                    }
                })
            }
        } else {
            usuarioId = usuarios.uuid
        }

        return usuarioId
    }

    static async contratarFuncionario(data, nomeUsuario) {
        const url = this.baseUrl + "departments/hire"
        let responseStatusCode

        const response = await fetch(url,
            {
                method: "PATCH",
                headers: this.headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                responseStatusCode = res.status
                return res
            })

        switch (responseStatusCode) {
            case 200:
                return "Usuário " + nomeUsuario + " contratado com sucesso."
            case 404:
                return "Usuário " + nomeUsuario + " não encontrado."
            case 400:
                return "O usuário " + nomeUsuario + " já está associado a um departamento."
            default:
                return "Ocorreu um erro ao processar a solicitação."
        }
    }

    static async demitirFuncionario(idFuncionario, nomeUsuario) {
        const url = this.baseUrl + "departments/dismiss/" + idFuncionario
        let responseStatusCode

        const response = await fetch(url,
            {
                method: "PATCH",
                headers: this.headers
            })
            .then(res => {
                responseStatusCode = res.status
                return res
            })
        
        switch (responseStatusCode) {
            case 200:
                return "Usuário " + nomeUsuario + " demitido com sucesso."
            case 404:
                return "Usuário " + nomeUsuario + " não encontrado."
            case 400:
                return "O usuário " + nomeUsuario + " não está associado a um departamento."
            default:
                return "Ocorreu um erro ao processar a solicitação."
        }
    }

    static async cadastrarEmpresa(data) {
        const url = this.baseUrl + "companies"
        let responseStatusCode

        const response = await fetch(url,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                responseStatusCode = res.status
                return res
            })
            .then(res => res.json())
        
        if (responseStatusCode == 201) {
            alert("Empresa cadastrada com sucesso.")
            window.location.assign("dashboardAdmin.html")
        }

        return response
    }

    static async cadastrarDepartamento(data) {
        const url = this.baseUrl + "departments"
        let responseStatusCode

        const response = await fetch(url,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                responseStatusCode = res.status
                return res
            })
            .then(res => res.json())

        if (responseStatusCode == 201) {
            alert("Departamento cadastrado com sucesso.")
            window.location.assign("dashboardAdmin.html")
        }

        return response
    }

    static async editarDepartamento(data, departamentoId) {
        const url = this.baseUrl + "departments/" + departamentoId
        let responseStatusCode

        const response = await fetch(url,
            {
                method: "PATCH",
                headers: this.headers,
                body: JSON.stringify(data)
            })
            .then(res => {
                responseStatusCode = res.status
                return res
            })
        
        switch(responseStatusCode) {
            case 200:
                return "Departamento editado com sucesso."
            case 404:
                return "Departamento não encontrado."
            case 401:
                return "Você não tem permissão para editar departamentos."
            case 400:
                return "Ocorreu um erro. Informações inválidas (400 Bad Request)."
                default:
                return "Ocorreu um erro inesperado."
        }
    }
}