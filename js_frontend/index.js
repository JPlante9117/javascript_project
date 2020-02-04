const d = document
const BASE_URL = 'http://localhost:3000'

function setAttributes(element, attrs){
    for(let key in attrs){
        element.setAttribute(key, attrs[key])
    }
}

function homePage(){
    let main = d.querySelector('main')
    let div = d.createElement('div')
    div.setAttribute('class', 'container')
    div.setAttribute('id', 'container')
    main.appendChild(div)

    let tabletop = d.createElement('button')
    setAttributes(tabletop, {'id': 'tt_button'})
    tabletop.appendChild(d.createTextNode("Tabletop Games"))
    tabletop.addEventListener('click', event => loadTTG(event))

    let video = d.createElement('button')
    setAttributes(video, {'id': 'vg_button'})
    video.appendChild(d.createTextNode("Video Games"))
    video.addEventListener('click', event => loadVG(event))
    div.innerHTML = "<h1>What Kind of Game Will You Be Playing?</h1>"
    div.appendChild(tabletop)
    div.appendChild(video)
}

function loadTTG(event){
    event.preventDefault()
    fetch(BASE_URL + '/categories/1')
    .then(resp => resp.json())
    .then(category => {
        let div = d.querySelector('main #container')
        div.setAttribute('class', '')
        let games = category.games
        div.innerHTML = "<h1>Select a Tabletop Game</h1>"
        let buttons = generateNewButton(1)
        div.appendChild(buttons)
        let table = generateBaseTable()
        div.appendChild(table)
        for(let i = 0; i < games.length; i++){
            generateGameRow(games, table, i)
        }
        console.log(category.genres.map((genre) => `this is the ${genre.title}`))
        closeNav()
    })
}

function loadVG(event){
    event.preventDefault()
    fetch(BASE_URL + '/categories/2')
    .then(resp => resp.json())
    .then(category => {
        let div = d.querySelector('main #container')
        div.setAttribute('class', '')
        let games = category.games
        div.innerHTML = "<h1>Select a Video Game</h1>"
        let buttons = generateNewButton(2)
        div.appendChild(buttons)
        let table = generateBaseTable()
        div.appendChild(table)
        for(let i = 0; i < games.length; i++){
            generateGameRow(games, table, i)
        }
        closeNav()
    })
}

d.addEventListener("DOMContentLoaded", () =>{
    homePage()
    d.getElementById('sideNavTTG').addEventListener('click', (event) => {
        loadTTG(event)
    })
    d.getElementById('sideNavVG').addEventListener('click', (event) => loadVG(event))
})

function generateBaseTable(){
    let headerArr = ['Game Title', 'Game Genre', 'Number of Players', 'Average Playtime', 'Challenge Rating']
    let table = d.createElement('table')
    table.setAttribute('class', 'game_table')
    let headerRow = table.insertRow(0)
    for(let header of headerArr){
        let th = d.createElement('th')
        th.textContent = header
        headerRow.appendChild(th)
    }
    return table
}

function generateGameRow(obj, table, i){

    let row = table.insertRow(i + 1)
    let title = row.insertCell(0)
    let genres = row.insertCell(1)
    let players = row.insertCell(2)
    let playtime = row.insertCell(3)
    let challenge = row.insertCell(4)

    let genreArr = []
    for(let gen of obj[i].genres){
        genreArr.push(gen.title)
    }

    title.textContent = obj[i].title
    genres.textContent = genreArr.join(", ")
    players.textContent = `${obj[i].player_min} - ${obj[i].player_max}`
    playtime.textContent = obj[i].game_length
    challenge.textContent = obj[i].challenge
}

function generateNewButton(category_id){
    let newGame = d.createElement('button')
    newGame.setAttribute('id', 'newGameButton')
    newGame.appendChild(d.createTextNode("New Game"))

    newGame.addEventListener('click', e =>{
        e.preventDefault()
        let div = d.createElement('div')
        div.setAttribute('id', 'sideForm')
        fetch(BASE_URL + `/categories/${category_id}`)
        .then(resp => resp.json())
        .then(category => {
            let div = d.getElementById('allGenres')
            let genres = category.genres
            div.innerHTML = genres.map((genre) => `<input type="checkbox" name="genres" value="${genre.id}">${genre.title}<br>`).join(" ")
        })
        let gameForm = `
        <form class="newGameForm">
            <label for="gameTitle">Game Title: </label>
            <input type="text" name="gameTitle"/><br><br>
            <label for="genres">Genres: </label><br>
            <div id="allGenres"></div>
            <label for="min_players">Players(min): </label>
            <input type="number" name="min_players" min="1"/><br><br>
            <label for="max_players">Players(max): </label>
            <input type="number" name="max_players" min="1"/><br><br>
            <label for="playtime">Average Playtime: </label>
            <input type="number" name="playtime"/><br><br>
            <label for="challenge">Challenge Rating: </label><br>
            <input type="radio" name="challenge" value="Easy">Easy<br>
            <input type="radio" name="challenge" value="intermediate">Intermediate<br>
            <input type="radio" name="challenge" value="hard">Hard<br>
            <input type="radio" name="challenge" value="challenging">Challenging<br>
            <input type="radio" name="challenge" value="masterful">Masterful<br>


            <input type="submit" value="Add Game"/>
        </form>
        `
        div.innerHTML = gameForm
        newGame.parentElement.appendChild(div)
        openForm()
        
        let form = d.getElementsByClassName('newGameForm')[0]
        form.addEventListener("submit", submitNewGame)
    })

    return newGame
}

function submitNewGame(e){
    e.preventDefault()
    function getCheckedBoxes(inputs){
        let checkedBoxes = []
        for(let i = 0; i < inputs.length; i++){
            if(inputs[i].checked){
                checkedBoxes.push(inputs[i].value)
            }
        }
        return checkedBoxes
    }
    let allInputs = [].slice.call(d.getElementsByTagName('input'))
    let gameTitle = allInputs[0].value
    let minPlayers = allInputs[16]
    let maxPlayers = allInputs[17]
    let playtime = allInputs[18]
    let genres = getCheckedBoxes(d.getElementsByName('genres'))
    let difficulties = getCheckedBoxes(d.getElementsByName('challenge'))
    let genreObjs = []
    genres.forEach(genre =>{
        fetch(BASE_URL + `/genres/${genre}`)
        .then(resp => resp.json())
        .then(genre =>{
            genreObjs.push(genre)
        })
    })
    if (d.querySelector('h1').textContent.includes("Video")){
        category_id = 2
    } else {
        category_id = 1
    }

    fetch(BASE_URL + '/games', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(new Game(gameTitle, minPlayers, maxPlayers, playtime, difficulties[0], category_id))
    })
    .then(resp => resp.json())
    .then(newGame => {
        console.log(newGame)
    })
    .catch(error => {
        console.log(error)
    })
}

function openNav(){
    d.getElementById("sideNav").style.width = "250px"
    d.querySelector('main').style.marginLeft = "250px"
    d.getElementById('navToggle').textContent = "<<<"
    d.getElementById('navToggle').onclick = closeNav
}

function closeNav(){
    d.getElementById("sideNav").style.width = "0px"
    d.querySelector('main').style.marginLeft = "0px"
    d.getElementById('navToggle').textContent = ">>>"
    d.getElementById('navToggle').onclick = openNav
}

function openForm(){
    d.getElementById("sideForm").style.width = "500px"
    d.querySelector('main').style.marginRight = "500px"
}

function closeForm(){
    d.getElementById("sideForm").style.width = "0px"
    d.querySelector('main').style.marginRight = "0px"
}

class Game {
    constructor(title, player_min, player_max, game_length, challenge, category_id){
        this.title = title
        this.player_min = player_min
        this.player_max = player_max
        this.game_length = game_length
        this.challenge = challenge
        this.category_id = category_id
    }
}