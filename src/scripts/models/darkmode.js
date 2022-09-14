class Darkmode {

    static darkModeFlag = false

    static changeMode() {
        if (!this.darkModeFlag) {
            this.darkModeFlag = true
            this.darkMode()
        } else {
            this.darkModeFlag = false
            this.lightMode()
        }
    }



    static darkMode() {

        const header = document.querySelector('header')
        const body = document.querySelector('body')

        header.classList.add('darkmode-header');
        body.classList.add('darkmode-body')


    }

    static lightMode() {

        const header = document.querySelector('header')
        const body = document.querySelector('body')

        header.classList.remove('darkmode-header')
        body.classList.remove('darkmode-body')

    }
}
function darkmodeEvent() {
    const darkModeBtn = document.querySelector('#darkmode')
    console.log(darkModeBtn);
    darkModeBtn.addEventListener("click", (event) => {
        event.preventDefault()
        Darkmode.changeMode()
    })
}

darkmodeEvent()
