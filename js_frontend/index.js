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
        games.map(game => {
            let newGame = new Game(game.title, game.player_min, game.player_max, game.game_length, game.challenge, game.category_id, game.genres)
            table.innerHTML += newGame.renderGame(game.id)
        })
        // for(let i = 0; i < games.length; i++){
        //     generateGameRow(games, table, i)
        // }
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
        games.map(game => {
            let newGame = new Game(game.title, game.player_min, game.player_max, game.game_length, game.challenge, game.category_id, game.genres)
            table.innerHTML += newGame.renderGame(game.id)
        })
        // for(let i = 0; i < games.length; i++){
        //     generateGameRow(games, table, i)
        // }
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

// function generateGameRow(gamesArray, table, i){

//     let row = table.insertRow(i + 1)
//     let title = row.insertCell(0)
//     let genres = row.insertCell(1)
//     let players = row.insertCell(2)
//     let playtime = row.insertCell(3)
//     let challenge = row.insertCell(4)

//     let genreArr = []
//     for(let gen of gamesArray[i].genres){
//         genreArr.push(gen.title)
//     }

//     title.textContent = gamesArray[i].title
//     genres.textContent = genreArr.join(", ")
//     if (gamesArray[i].player_min === gamesArray[i].player_max){
//         players.textContent = `${gamesArray[i].player_max} players`
//     } else{
//         players.textContent = `${gamesArray[i].player_min} - ${gamesArray[i].player_max} players`
//     }
//     playtime.textContent = `${gamesArray[i].game_length} minutes`
//     challenge.textContent = gamesArray[i].challenge
// }

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
            div.innerHTML = genres.map((genre) => `<input type="checkbox" name="game[genre_ids][]" value="${genre.id}">${genre.title}<br>`).join(" ")
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
            <input type="number" name="playtime" min="1"/><br><br>
            <label for="challenge">Challenge Rating: </label><br>
            <input type="radio" name="challenge" value="Easy">Easy<br>
            <input type="radio" name="challenge" value="Intermediate">Intermediate<br>
            <input type="radio" name="challenge" value="Hard">Hard<br>
            <input type="radio" name="challenge" value="Challenging">Challenging<br>
            <input type="radio" name="challenge" value="Masterful">Masterful<br>


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
    //CREATE FILTER FOR getCheckedBoxes
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
    let minPlayers = d.getElementsByName('min_players')[0].value
    let maxPlayers = d.getElementsByName('max_players')[0].value
    let playtime = d.getElementsByName('playtime')[0].value
    let genres = getCheckedBoxes(d.getElementsByName('game[genre_ids][]'))
    let difficulties = getCheckedBoxes(d.getElementsByName('challenge'))
    
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
        body: JSON.stringify(new Game(gameTitle, parseInt(minPlayers), parseInt(maxPlayers), playtime, difficulties[0], category_id, genres))
    })
    .then(resp => resp.json())
    .then(newGame => {
        let game = new Game(newGame.title, newGame.player_min, newGame.player_max, newGame.game_length, newGame.challenge, newGame.category_id, newGame.genres)
        let table = d.getElementsByClassName('game_table')[0]
        table.innerHTML += game.renderGame(newGame.id)
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

function grabGenres(gameID){
    fetch(BASE_URL + `/games/${gameID}`)
    .then(resp => resp.json())
    .then(game => {
        let td = d.getElementById(`genrefor${gameID}`)
        let genres = game.genres.map(genre => genre.title).join(", ")
        td.textContent = genres
    })
}

class Game {
    constructor(title, player_min, player_max, game_length, challenge, category_id, genre_ids){
        this.title = title
        this.player_min = player_min
        this.player_max = player_max
        this.game_length = game_length
        this.challenge = challenge
        this.category_id = category_id
        this.genre_ids = genre_ids
    }

    renderGame(gameID){
        let players
        if (this.player_min === this.player_max){
            players = `${this.player_max} players`
        } else{
            players = `${this.player_min} - ${this.player_max} players`
        }
        return `
        <tr>
            <td>
                ${this.title}
            </td>
            <td id="genrefor${gameID}">
                ${grabGenres(gameID)}
            </td>
            <td>
                ${players}
            </td>
            <td>
                ${this.game_length} minutes
            </td>
            <td>
                ${this.challenge}
            </td>
        </tr>
        `
    }
}

class GameGenre{
    constructor(game_id, genre_id){
        this.game_id = game_id
        this.genre_id = genre_id
    }
}