import { Api } from "../api.js"

class logout {
    static async logout() {
        Api.logout()
    }
}

function loadLogoutEvent() {
    const logoutButton = document.getElementById("logoutButton")

    logoutButton.addEventListener("click", event => {
        event.preventDefault()

        logout.logout()
    })
}

loadLogoutEvent()