// IMPORT
import { User } from '../classi/userClass.js'
import { fetchJSONUsers } from '../fetchJSON/fetch_utenti_mockup.js'
import { querySearch } from '../fetchAPI/querySearchDeezer.js'
import { catchArtist } from '../fetchAPI/fetchArtistObg.js'
import { catchAlbum } from '../fetchAPI/fetchAlbumObg.js'

// VARIABILI UNICHE DELLA CLASSE
let currentUser = "User"
let loadedUsers = [] // Utenti da JSON
let storagedUsers = [] // Utenti da LocalStorage
let dinamicUsers = [] //Utenti da JSON + utenti da localstorage
const albumDaSuggerire = []
const artistiDaSuggerire = []
const playstDaSuggerire = []
const trackDegliAltri = []
 
// METODI LISTENER 

const settaDirezioneDropDown = function () { // Imposta la direzione del dropdown in base alla dimensione dello schermo
    const dropdownDiv = document.getElementById('navDropLogin')
    if (window.innerWidth >= 768) {
        dropdownDiv.classList.add('dropstart')
        dropdownDiv.classList.remove('dropdown')
    } else {
        dropdownDiv.classList.add('dropdown')
        dropdownDiv.classList.remove('dropstart')
    }
}

const registraUtente = function() { // Registra un nuovo utente in localstorage e lancia il metodo login con parametro il nuovo utente
//Aggiungo il nuovo utente a storagedUsers e lo setto in localstorage
preventDefalut()
const nomeNuovoUtente = document.getElementById('nomeNuovoUtente').value
if(isValidUser(nomeNuovoUtente)){
    const nuovoUtente = new User(nomeNuovoUtente)
    storagedUsers.push(nuovoUtente)
    localStorage.setItem('users', JSON.stringify(storagedUsers))
    login(nuovoUtente)
}
}   


// UTILITY
function isValidUser(userValue) {

    for (let i = 0; i < dinamicUsers.length; i++) {
        if (dinamicUsers[i].nome === userValue) {
            return true
        }
    }   

    if(userValue !== "User" && userValue === true && userValue !== "login"){
        return true
    } else {
        return false
    }
}

// DOM MANIPULATION

const setLoginForm = function(arrayUser) { //Imposta la navBar col form per l'iscrizione e gli utenti esistenti
    const outerDiv = document.createElement('div')
    outerDiv.className = 'container-fluid p-0 p-md-2 m-0'

    const buttonDiv = document.createElement('div')
    buttonDiv.className = 'd-none d-md-inline m-1'

    // Funzione per creare un bottone con icona
    const createButton = (iconClass) => {
        const button = document.createElement('button')
        button.setAttribute('type', 'button')
        button.className = 'btn btn-outline-secondary p-1 rounded-circle'

        const icon = document.createElement('i')
        icon.className = iconClass
        button.appendChild(icon)
        return button
    }

    const prevButton = document.createElement('button')
    prevButton.setAttribute('type', 'button')
    prevButton.className = 'btn btn-outline-secondary p-1 rounded-circle mx-3 '
    const nextButton = document.createElement('button')
    nextButton.setAttribute('type', 'button')
    nextButton.className = 'btn btn-outline-secondary p-1 rounded-circle mx-3 '
    const innerPrev = document.createElement('i')
    const innerNext = document.createElement('i')
    innerPrev.innerHTML = `<i class="bi bi-chevron-left p-1 m-0 "></i>`
    innerNext.innerHTML = `<i class="bi bi-chevron-right p-1 m-0 "></i>`
    prevButton.appendChild(innerPrev)
    nextButton.appendChild(innerNext)

    buttonDiv.appendChild(prevButton)
    buttonDiv.appendChild(nextButton)

    outerDiv.appendChild(buttonDiv)

    const dropdownDiv = document.createElement('div')
    dropdownDiv.className = 'p-1 d-flex align-items-center justify-content-center dropstart'
    dropdownDiv.id = 'navDropLogin'
    const dropdownButton = document.createElement('button')
    dropdownButton.setAttribute('type', 'button')
    dropdownButton.className = 'btn btn-outline-light rounded-pill p-1 px-3 col- d-flex align-items-center justify-content-center gap-1 text-align-start'
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown')
    dropdownButton.setAttribute('aria-expanded', 'false')
    dropdownButton.style.maxWidth = '60vw !important'

    const img = document.createElement('img')
    img.src = './assets/icons/person-circle.svg'
    dropdownButton.appendChild(img)

    const span = document.createElement('span')
    span.textContent = 'Login'
    dropdownButton.appendChild(span)

    dropdownDiv.appendChild(dropdownButton)

    const dropdownMenu = document.createElement('ul')
    dropdownMenu.className = 'dropdown-menu dropdown-menu-login p-1 rounded-3'


    const listItemInputDiv = document.createElement('li')


    const inputDiv = document.createElement('div')
    inputDiv.className = 'd-flex'

    const input = document.createElement('button')
    input.className = 'btn btn-outline-primary text-dark rounded-pill p-1 px-3 m-2'
    const signIn = document.createElement('a')
    signIn.setAttribute('href', '#')
    signIn.setAttribute('data-bs-toggle', 'modal')
    signIn.setAttribute('data-bs-target', '#modalLogin')
    signIn.innerHTML= `<i class="bi bi-person-add"></i> Registrati`
    input.appendChild(signIn)

    inputDiv.appendChild(input)
    listItemInputDiv.appendChild(inputDiv)

    const listItemUserLi = function(user) {
        const listItem = document.createElement('li')
        listItem.className = 'd-flex align-items-center bg-dark'
        const userImg = document.createElement('img')
        userImg.className = 'rounded-circle img-fluid m-0 p-0'
        userImg.src = user.img
        userImg.style.width = '20px'
        userImg.style.height = '20px'
        listItem.appendChild(userImg)
        const userLi = document.createElement('a')
        userLi.className = 'dropdown-item text-white fs-6 m-0 p-0 customLiHover'
        userLi.setAttribute('href', '#')
        userLi.textContent = user.nome
        listItem.appendChild(userLi)

        return listItem
    }

for (let indiceUtenti = 0; indiceUtenti < arrayUser.length; indiceUtenti++) {
    dropdownMenu.appendChild(listItemUserLi(arrayUser[indiceUtenti]))
}

    dropdownMenu.appendChild(listItemInputDiv)

    dropdownDiv.appendChild(dropdownMenu)
    outerDiv.appendChild(dropdownDiv)
    document.getElementById('navBar').appendChild(outerDiv)
}

const login = function(user) {
    console.log("Utente valido:", user)
  }

const updateUser = function (arrayUser) {
    currentUser = JSON.parse(sessionStorage.getItem("CFy_CurrentUser"))
  
    if (currentUser !== null && isValidUser(currentUser)) {

      login(currentUser)

    } else {
        setLoginForm(arrayUser)
    }
}
  



// LISTENER DOM
window.addEventListener('resize', settaDirezioneDropDown)//Cambia la classe dropdown dropstar alla navbar in base alla larghezza dello schermo
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('formRegistrazione').addEventListener('submit', registraUtente)
})


// INIZIO ESECUZIONE


fetchJSONUsers()
.then(arrayUser => {
    updateUser(arrayUser) // Mette sullo schermo il pulsante per il login
settaDirezioneDropDown() // Modifica il pulsante per il login, necessario usare dopo
})
.catch(error => {
    console.error('Errore durante il caricamento degli utenti:', error)
})

//querySearch("Avenged se")
catchAlbum("6715844")