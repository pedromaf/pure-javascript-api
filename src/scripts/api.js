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

    //TODO: logout()

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
            window.location.assign("src/pages/login.html")
        }

        return response
    }

    static async getListaEmpresas(sector = null) {
        let url = this.baseUrl + "companies"
        
        if (sector != null) {
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
                response.forEach(departamento => {
                    if(departamento.name == data.name) {
                        returnDepartamento = departamento
                    }
                })
            }

            return returnDepartamento
        }

        return returnDepartamento
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
            window.location.assign("dashboardAdmin.html")
        }

        return response
    }
}