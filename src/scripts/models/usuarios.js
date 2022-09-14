import { Api } from "../api.js"

class usuarios {

    static async deletarUsuario() {
        const nome = document.getElementById("deletarUsuarioNome").value

        if (nome == "") {
            alert("Digite o nome do usuário.")

            return
        }

        const usuarioId = await Api.getUsuarioIdByName(nome)

        const response = await Api.deletarUsuario(usuarioId)

        alert(response)
    }

    static async editarUsuario() {
        const nome = document.getElementById("editarUsuarioNome").value
        const nivel = document.getElementById("editarUsuarioNivel").value
        const tipo = document.getElementById("editarUsuarioKindWork").value

        if (nome == "") {
            alert("é necessário informar o nome do usuário")

            return
        }

        if (nivel == "" && tipo == "") {
            alert("Nenhum informação para alteração foi submetida.")
            
            return
        }   

        const usuarioId = await Api.getUsuarioIdByName(nome)

        const data = {
            kind_of_work: tipo,
            professional_level: nivel
          }

        const response = await Api.editarUsuario(data, usuarioId)
    }
}

function deletarUsuarioPageEventLoader() {
    const deletarButton = document.getElementById("deletarButton")

    deletarButton.addEventListener("click", event => {
        event.preventDefault()

        usuarios.deletarUsuario()
    })
}

function editarUsuarioPageEventLoader() {
    const editarButton = document.getElementById("editarButton")

    editarButton.addEventListener("click", event => {
        event.preventDefault()

        usuarios.editarUsuario()
    })
}

switch(document.title) {
    case "Deletar Usuário":
        deletarUsuarioPageEventLoader()
        break
    case "Editar Usuário":
        editarUsuarioPageEventLoader()
        break
}