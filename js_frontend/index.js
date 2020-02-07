const d = document
const BASE_URL = 'http://localhost:3000'

function setAttributes(element, attrs){
    for(let key in attrs){
        element.setAttribute(key, attrs[key])
    }
}

function homePage(){
    let main = d.querySelector('main')
    let div
    if (d.getElementById('container')){
        div = d.getElementById('container')
        div.setAttribute('class', 'container')
    } else {
        div = d.createElement('div')
        div.setAttribute('class', 'container')
        div.setAttribute('id', 'container')
    }
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

function showPage(gameID){
    closeForm()
    fetch(BASE_URL + `/games/${gameID}`)
    .then(resp => resp.json())
    .then(gameInfo => {
        let game = new Game(gameInfo.id, gameInfo.title, gameInfo.player_min, gameInfo.player_max, gameInfo.game_length, gameInfo.challenge, gameInfo.category, gameInfo.genres)
        console.log(game)
        let div = d.getElementById('container')
        div.innerHTML = `<h1>${game.title}</h1>`
        //
        //Edit and Delete Buttons
        //
        let table = generateShowTable(game)
        div.innerHTML += table
        let editButton = generateEditButton(game)
        let deleteButton = generateDeleteButton(game)
        div.appendChild(editButton)
        div.appendChild(deleteButton)
    })
}

function generateEditButton(game){
    let edit = d.createElement('button')
    edit.setAttribute('id', 'editButton')
    edit.appendChild(d.createTextNode("Edit Game"))

    edit.addEventListener('click', e =>{
        e.preventDefault()
        let div = d.getElementById('sideForm')
        fetch(BASE_URL + `/categories/${game.category_id.id}`)
        .then(resp => resp.json())
        .then(category => {
            let gameGenres = game.displayGenreNames()
            let genreDiv = d.getElementById('allGenres')
            let genres = category.genres
            genreDiv.innerHTML = genres.map((genre) => {
                if (gameGenres.includes(genre.title)){
                    return `<input type="checkbox" name="game[genre_ids][]" value="${genre.id}" checked>${genre.title}<br>`
                } else {
                    return `<input type="checkbox" name="game[genre_ids][]" value="${genre.id}">${genre.title}<br>`
                }
            }).join(" ")
        })
        let gameForm = `
        <span id="formToggle" onclick="closeForm()">&times;</span>
        <br>
        <center><h2>Edit ${game.title}</h2></center>
        <form class="GameForm">
            <label for="gameTitle">Game Title: </label>
            <input type="text" name="gameTitle" value="${game.title}"/><br><br>
            <label for="genres">Genres: </label><br>
            <div id="allGenres"></div><Br>
            <label for="min_players">Players(min): </label>
            <input type="number" name="min_players" min="1" value="${game.player_min}"/><br><br>
            <label for="max_players">Players(max): </label>
            <input type="number" name="max_players" min="1" value="${game.player_max}"/><br><br>
            <label for="playtime">Average Playtime: </label>
            <input type="number" name="playtime" min="1" value="${game.game_length}"/><br><br>
            <label for="challenge">Challenge Rating: </label><br>
            <input type="radio" name="challenge" value="Easy">Easy<br>
            <input type="radio" name="challenge" value="Intermediate">Intermediate<br>
            <input type="radio" name="challenge" value="Hard">Hard<br>
            <input type="radio" name="challenge" value="Challenging">Challenging<br>
            <input type="radio" name="challenge" value="Masterful">Masterful<br>


            <input type="submit" value="Update Game" id="submitButton"/>
        </form>
        `
        
        div.innerHTML = gameForm
        let challenges = d.getElementsByName("challenge")
        challenges.forEach(challenge => {
            if (challenge.value === game.challenge){
                challenge.checked = true
            }
        })
        openForm()
        
        let form = d.getElementsByClassName('GameForm')[0]
        form.addEventListener("submit", (event)=>{
            submitEdit(event, game)
        })
    })

    return edit
}

function getCheckedBoxes(inputs){
    let checkedBoxes = []
    for(let i = 0; i < inputs.length; i++){
        if(inputs[i].checked){
            checkedBoxes.push(inputs[i].value)
        }
    }
    return checkedBoxes
}

function submitEdit(e, game){
    e.preventDefault()
    let allInputs = [].slice.call(d.getElementsByTagName('input'))
    let gameTitle = allInputs[0].value
    let minPlayers = d.getElementsByName('min_players')[0].value
    let maxPlayers = d.getElementsByName('max_players')[0].value
    let playtime = d.getElementsByName('playtime')[0].value
    let genres = getCheckedBoxes(d.getElementsByName('game[genre_ids][]'))
    let difficulties = getCheckedBoxes(d.getElementsByName('challenge'))
    
    if (d.getElementsByTagName('td')[0].innerText === "Video Game"){
        category_id = 2
    } else {
        category_id = 1
    }

    fetch(BASE_URL + `/games/${game.id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(new Game(game.id, gameTitle, parseInt(minPlayers), parseInt(maxPlayers), playtime, difficulties[0], category_id, genres))
    })
    .then(resp => {
        if (!resp.ok){
            throw alert(`There are some errors on your form. Make sure:

            ~ You have a Title, and it doesn't already exist
            ~ At least one genre is selected
            ~ You have a number as the min/max players and playtime
            ~ Your minimum players is smaller or the same as your maximum players
            ~ You have selected a challenge rating
                        `)
        }
        return resp.json()
    })
    .then(updateGame => {
        let game = new Game(updateGame.id, updateGame.title, updateGame.player_min, updateGame.player_max, updateGame.game_length, updateGame.challenge, updateGame.category_id, updateGame.genres)
        showPage(game.id)
        clearForm()
        closeForm()
    })
    .catch(error => {
        console.log(error)
    })
}

function showNoticeDiv(message){
    let notice = d.getElementById('notice')
    notice.innerHTML = message
    notice.setAttribute('class', '')
    setTimeout(()=>{
        notice.setAttribute('class', 'hidden')
    }, 3000)
    
}

function generateDeleteButton(game){
    let deleteButton = d.createElement('button')
    deleteButton.setAttribute('id', 'deleteButton')
    deleteButton.appendChild(d.createTextNode("Delete Game"))

    deleteButton.addEventListener("click", e =>{
        e.preventDefault()
        let confirmation = confirm(`Are you sure you want to delete ${game.title}?`)
        if (confirmation){
            console.log("POOF! It's deleted")
            return fetch(BASE_URL + `/games/${game.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: 'DELETE',
                body: JSON.stringify(new Game(game.id, game.title, game.player_min, game.player_max, game.game_length, game.challenge, game.category_id))
            })
            .then( () =>{
                homePage()
                showNoticeDiv(`${game.title} has been deleted`)
            })
        }
    })

    return deleteButton
}

function generateShowTable(game){
    function displayGenreNames(game){
        return game.genre_ids.map(genre => genre.title).join(", ")
    }
    function displayGameLength(game){
        if(game.game_length <= 59){
            return `${game.game_length} minutes`
        } else if (game.game_length <= 120 && game.game_length > 59){
            return `${(game.game_length / 60.0).toFixed(1)} hours`
        } else {
            return `${(game.game_length / 60.0).toFixed(1)} hours. It may be recommended to break this game into multiple sessions`
        }
    }
    
    return `
    <table class="game_table">
        <tr>
            <th class="showHeader">
                Game Type:
            </th>
            <td class="showDisplay">
                ${game.category_id.title}
            </td>
        </tr>
        <tr>
            <th class="showHeader">
                Game Genre(s):
            </th>
            <td class="showDisplay">
                ${displayGenreNames(game)}
            </td>
        </tr>
        <tr>
            <th class="showHeader">
                Players:
            </th>
            <td class="showDisplay">
                This game is intended for ${game.getPlayerCount()}.
            </td>
        </tr>
        <tr>
            <th class="showHeader">
                Challenge Rating:
            </th>
            <td class="showDisplay">
                This game is considered ${game.challenge}.
            </td>
        </tr>
        <tr>
        <th class="showHeader">
            Average Game Length:
        </th>
        <td class="showDisplay">
            An average round of this game is ${displayGameLength(game)}.        
        </td>
    </tr>
    </table>
    `

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
            let newGame = new Game(game.id, game.title, game.player_min, game.player_max, game.game_length, game.challenge, game.category_id, game.genres)
            table.innerHTML += newGame.renderGame()
        })
        table.rows[table.rows.length - 1].setAttribute('class', 'last_row')
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
            let newGame = new Game(game.id, game.title, game.player_min, game.player_max, game.game_length, game.challenge, game.category_id, game.genres)
            table.innerHTML += newGame.renderGame()
        })
        table.rows[table.rows.length - 1].setAttribute('class', 'last_row')
        closeNav()
    })
}

d.addEventListener("DOMContentLoaded", () =>{
    homePage()
    d.getElementById('sideNavTTG').addEventListener('click', (event) => {
        closeForm()
        loadTTG(event)
    })
    d.getElementById('sideNavVG').addEventListener('click', (event) => {
        closeForm()
        loadVG(event)
    })
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

function generateNewButton(category_id){
    let newGame = d.createElement('button')
    newGame.setAttribute('id', 'newGameButton')
    newGame.appendChild(d.createTextNode("New Game"))

    newGame.addEventListener('click', e =>{
        e.preventDefault()
        let div = d.getElementById('sideForm')
        fetch(BASE_URL + `/categories/${category_id}`)
        .then(resp => resp.json())
        .then(category => {
            let genreDiv = d.getElementById('allGenres')
            let genres = category.genres
            genreDiv.innerHTML = genres.map((genre) => `<input type="checkbox" name="game[genre_ids][]" value="${genre.id}">${genre.title}<br>`).join(" ")
        })
        let gameForm = `
        <div id="formToggle" onclick="closeForm()">&times;</div>
        <center><h2>Add a New Game</h2></center>
        <form class="GameForm">
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


            <input type="submit" value="Add Game" id="submitButton"/>
        </form>
        `
        
        div.innerHTML = gameForm
        openForm()
        
        let form = d.getElementsByClassName('GameForm')[0]
        form.addEventListener("submit", submitNewGame)
    })

    return newGame
}

function submitNewGame(e){
    e.preventDefault()
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
        body: JSON.stringify(new Game("", gameTitle, parseInt(minPlayers), parseInt(maxPlayers), playtime, difficulties[0], category_id, genres))
    })
    .then(resp => {
        if (!resp.ok){
            throw alert(`There are some errors on your form. Make sure:

~ You have a Title, and it doesn't already exist
~ At least one genre is selected
~ You have a number as the min/max players and playtime
~ Your minimum players is smaller or the same as your maximum
    players
~ You have selected a challenge rating
                        `)
        }
        return resp.json()
    })
    .then(newGame => {
        let game = new Game(newGame.id, newGame.title, newGame.player_min, newGame.player_max, newGame.game_length, newGame.challenge, newGame.category_id, newGame.genres)
        let table = d.getElementsByClassName('game_table')[0]
        table.innerHTML += game.renderGame()
        clearForm()
        closeForm()
    })
    .catch(error => {
        console.log(error)
    })
}

function openNav(){
    d.getElementById("sideNav").style.width = "250px"
    d.querySelector('main').style.marginLeft = "250px"
    d.getElementById('navToggle').innerHTML = "&times;"
    d.getElementById('navToggle').onclick = closeNav
}

function closeNav(){
    d.getElementById("sideNav").style.width = "0px"
    d.querySelector('main').style.marginLeft = "0px"
    d.getElementById('navToggle').innerHTML = `+`
    d.getElementById('navToggle').onclick = openNav
}

function openForm(){
    d.getElementById("sideForm").style.width = "300px"
    d.querySelector('main').style.marginRight = "300px"
    d.getElementById('formToggle').onclick = closeForm
}

function clearForm(){
    if (d.getElementsByClassName('GameForm')[0]){
        d.getElementsByClassName('GameForm')[0].reset()
    }
}

function closeForm(){
    clearForm()
    d.getElementById("sideForm").style.width = "0px"
    d.querySelector('main').style.marginRight = "0px"
}

class Game {
    constructor(id, title, player_min, player_max, game_length, challenge, category_id, genre_ids){
        this.id = id
        this.title = title
        this.player_min = player_min
        this.player_max = player_max
        this.game_length = game_length
        this.challenge = challenge
        this.category_id = category_id
        this.genre_ids = genre_ids
    }

    grabGenres(){
        fetch(BASE_URL + `/games/${this.id}`)
        .then(resp => resp.json())
        .then(game => {
            let td = d.getElementById(`genrefor${this.id}`)
            let genres = this.displayGenreNames()
            td.textContent = genres
        })
    }

    displayGenreNames(){
        return this.genre_ids.map(genre => genre.title).join(", ")
    }

    getPlayerCount(){
        let players = null
        if (this.player_min === this.player_max){
            players = `${this.player_max} players`
        } else{
            players = `${this.player_min} - ${this.player_max} players`
        }
        return players
    }

    minutesToHours(){
        if(this.game_length > 59){
            return `${(this.game_length/60).toFixed(1)} hours`
        } else {
            return `${this.game_length} minutes`
        }
    }

    renderGame(){

        return `
        <tr id="gameRow${this.id}">
            <td>
                <a href="#" onclick="showPage(${this.id}); return false">${this.title}</a>
            </td>
            <td id="genrefor${this.id}">
                ${this.grabGenres()}
            </td>
            <td>
                ${this.getPlayerCount()}
            </td>
            <td>
                ${this.minutesToHours()}
            </td>
            <td>
                ${this.challenge}
            </td>
        </tr>
        `
    }
}