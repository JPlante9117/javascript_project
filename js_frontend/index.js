const d = document
const BASE_URL = 'http://localhost:3000'
let games
let gamesReversed = false

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
    tabletop.addEventListener('click', event => loadGames(event, 1))

    let video = d.createElement('button')
    setAttributes(video, {'id': 'vg_button'})
    video.appendChild(d.createTextNode("Video Games"))
    video.addEventListener('click', event => loadGames(event, 2))

    let allGames = d.createElement('button')
    setAttributes(allGames, {'id': 'tt_button'})
    allGames.appendChild(d.createTextNode("All Games"))
    allGames.addEventListener('click', event => loadAllGames(event))

    div.innerHTML = "<h1>What Kind of Game Will You Be Playing?</h1>"
    div.appendChild(tabletop)
    div.appendChild(video)
    div.appendChild(allGames)
}

function showPage(gameID){
    closeNav()
    closeForm()
    fetch(BASE_URL + `/games/${gameID}`)
    .then(resp => resp.json())
    .then(gameInfo => {
        let game = new Game(gameInfo)
        let div = d.getElementById('container')
        div.innerHTML = `<h1>${game.title}</h1><div id="buttons"></div>`
        let table = generateShowTable(game)
        div.innerHTML += table
        let editButton = generateEditButton(game)
        let deleteButton = generateDeleteButton(game)
        let buttondiv = d.getElementById('buttons')
        buttondiv.appendChild(editButton)
        buttondiv.appendChild(deleteButton)
        let backButton = generateBackButton(game)
        div.appendChild(backButton)
    })
}

function generateBackButton(game){
    let backButton = d.createElement('button')
    backButton.appendChild(d.createTextNode("Back"))
    backButton.setAttribute('id', 'backButton')
    backButton.addEventListener("click", (e) =>{
        closeForm()
        loadGames(e, game.category.id)
    })
    return backButton
}

function generateEditButton(game){
    let edit = d.createElement('button')
    edit.setAttribute('id', 'editButton')
    edit.appendChild(d.createTextNode("Edit Game"))
    edit.addEventListener('click', e =>{
        e.preventDefault()
        let div = d.getElementById('sideForm')
        fetch(BASE_URL + `/categories/${game.category.id}`)
        .then(resp => resp.json())
        .then(category => {
            let gameGenres = game.displayGenreNames()
            let genreDiv = d.getElementById('allGenres')
            let genres = category.genres.sort((a, b) => {
                if (a.title > b.title){
                    return 1
                }
                if (b.title > a.title){
                    return -1
                }
                return 0
            })
            genreDiv.innerHTML = genres.map((genre) => {
                if (gameGenres.includes(toTitleCase(genre.title))){
                    return `<input type="checkbox" name="game[genre_ids][]" value="${genre.id}" checked>${toTitleCase(genre.title)}<br>`
                } else {
                    return `<input type="checkbox" name="game[genre_ids][]" value="${genre.id}">${toTitleCase(genre.title)}<br>`
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
            <div id="allGenres"></div>
            <label for="new_genre">New Genre: </label>
            <input type="text" name="game[genres_attributes][0][title]"><br><br>
            <label for="min_players">Players(min): </label>
            <input type="number" name="min_players" min="1" value="${game.player_min}"/><br><br>
            <label for="max_players">Players(max): </label>
            <input type="number" name="max_players" min="1" value="${game.player_max}"/><br><br>
            <label for="playtime">Average Playtime(in minutes): </label>
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
    let gameTitle = allInputs[0].value.toLowerCase()
    let minPlayers = d.getElementsByName('min_players')[0].value
    let maxPlayers = d.getElementsByName('max_players')[0].value
    let playtime = d.getElementsByName('playtime')[0].value
    let genres = getCheckedBoxes(d.getElementsByName('game[genre_ids][]'))
    let difficulties = getCheckedBoxes(d.getElementsByName('challenge'))
    let genTitle = d.getElementsByName('game[genres_attributes][0][title]')[0].value.toLowerCase()
    
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
        body: JSON.stringify({
            game:{
                id: "",
                title: gameTitle.toLowerCase(),
                player_min: minPlayers,
                player_max: maxPlayers,
                game_length: playtime,
                challenge: difficulties[0],
                category_id: category_id,
                genre_ids: genres,
                genres_attributes:{
                    category_id: category_id,
                    title: genTitle.toLowerCase()
                }
            }
        })
    })
    .then(resp => resp.json())
    .then(updateGame => {
        let game = new Game(updateGame)
        showPage(game.id)
        showNoticeDiv(`${game.title} has been edited`)
        clearForm()
        closeForm()
    })
    .catch(error => {
        errorAlert()
    })
}

function showNoticeDiv(message){
    let notice = d.getElementById('notice')
    let body = d.getElementsByTagName('body')[0]
    notice.innerHTML = message
    if (message.includes('delete')){
        notice.style.backgroundColor = "red"
    } else {
        notice.style.backgroundColor = "green"
    }
    notice.setAttribute('class', '')
    body.setAttribute('class', 'pushedDown')
    setTimeout(()=>{
        notice.setAttribute('class', 'hidden')
        body.setAttribute('class', '')
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
            return fetch(BASE_URL + `/games/${game.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: 'DELETE'
            })
            .then( () =>{
                homePage()
                closeForm()
                closeNav()
                showNoticeDiv(`${game.title} has been deleted`)
            })
        }
    })

    return deleteButton
}

function generateShowTable(game){
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
            <th class="showHeader" style="border-top-left-radius: 10px;">
                Game Type:
            </th>
            <td class="showDisplay">
                ${toTitleCase(game.category.title)}
            </td>
        </tr>
        <tr>
            <th class="showHeader">
                Game Genre(s):
            </th>
            <td class="showDisplay">
                ${game.displayGenreNames()}
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
                This game is considered ${toTitleCase(game.challenge)}.
            </td>
        </tr>
        <tr class="last_row">
        <th class="showHeader" style="border-bottom-left-radius: 10px">
            Average Game Length:
        </th>
        <td class="showDisplay">
            An average round of this game is ${displayGameLength(game)}.        
        </td>
    </tr>
    </table>
    `

}

function filterByName() {
    let input, filter, a, i, txtValue;
    input = d.getElementById("filterField");
    filter = input.value.toUpperCase();
    tr = d.getElementsByTagName('tr');
    for (i = 1; i < tr.length; i++) {
        a = tr[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}
function filterByGenre() {
    let input, filter, tr, genres, i, txtValue;
    input = d.getElementById("filterField");
    filter = input.value.toUpperCase();
    tr = d.getElementsByTagName('tr');
    for (i = 1; i < tr.length; i++) {
        genres = tr[i].getElementsByTagName("td")[1];
        txtValue = genres.textContent || genres.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function filterByPlayers() {
    function determineInsideRange(range, input){
        let min, max
        if (range.length === 2){
            min, max = parseInt(range[0])
        } else {
            min = parseInt(range[0])
            max = parseInt(range[2])
        }
        if ((parseInt(input) >= min && parseInt(input) <= max) || input === "" ){
            return true
        }
        return false
    }
    let input, tr, players, i
    input = d.getElementById("filterField").value;
    tr = d.getElementsByTagName('tr');
    for (i = 1; i < tr.length; i++) {
        players = tr[i].getElementsByTagName("td")[2].innerText;
        let range = players.split(" ")
        if (determineInsideRange(range, input)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function filterByTime() {
    function determineTime(timeArr, input){
        let time, type
        [time, type] = timeArr
        if (type === "hours"){
            time = time * 60
        }
        if (parseInt(input) >= time || input === "" ){
            return true
        }
        return false
    }
    let input, tr, timeTd, i
    input = d.getElementById("filterField").value;
    tr = d.getElementsByTagName('tr');
    for (i = 1; i < tr.length; i++) {
        timeTd = tr[i].getElementsByTagName("td")[3].innerText;
        let timeArr = timeTd.split(" ")
        if (determineTime(timeArr, input)) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function filterByChallenge() {
    let input, filter, tr, challenge, i, txtValue;
    input = d.getElementById("filterField");
    filter = input.value.toUpperCase();
    tr = d.getElementsByTagName('tr');
    for (i = 1; i < tr.length; i++) {
        challenge = tr[i].getElementsByTagName("td")[4];
        txtValue = challenge.textContent || challenge.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function renderFilterSelect(){
    return `
    <select id="filter">
        <option class="options" value="">Filter . . .</option>
        <option class="options" value="Name">Name</option>
        <option class="options" value="Genre">Genre</option>
        <option class="options" value="Players">Players</option>
        <option class="options" value="Playtime">Playtime</option>
        <option class="options" value="Challenge">Challenge</option>
    </select>
    <span id="filterSpan"></span>
    `
}

function renderFilterField(){
    let filter = d.getElementById('filter').value
    let span = d.getElementById('filterSpan')
    switch (filter){
        case "":
            span.innerHTML = ``
            break
        case "Name":
            span.innerHTML = `<input type="text" id="filterField" onkeyup="filterByName()" placeholder="Search by Name..." title="Type in a name">`
            break
        case "Genre":
            span.innerHTML = `<input type="text" id="filterField" onkeyup="filterByGenre()" placeholder="Search by Genre..." title="Type in a genre">`
            break
        case "Players":
            span.innerHTML = `<input type="text" id="filterField" onkeyup="filterByPlayers()" placeholder="Search by Player Count..." title="Type in a number">`
            break
        case "Playtime":
            span.innerHTML = `<input type="number" id="filterField" onkeyup="filterByTime()" placeholder="Search by Playtime(min)..." title="Type in a number">`
            break
        case "Challenge":
            span.innerHTML = `<input type="text" id="filterField" onkeyup="filterByChallenge()" placeholder="Search by Challenge Rating..." title="Type in a challenge rating">`
            break

    }
}

function loadGames(event, catId){
    event.preventDefault()
    fetch(BASE_URL + `/categories/${catId}`)
    .then(resp => resp.json())
    .then(category => {
        let div = d.querySelector('main #container')
        div.setAttribute('class', '')
        games = category.games.sort((a, b) => {
            if (a.title > b.title){
                return 1
            }
            if (b.title > a.title){
                return -1
            }
            return 0
        })
        
        div.innerHTML = `<h1>Select a ${category.title}</h1><div id="buttons"></div>`
        let buttonRow = d.getElementById('buttons')

        let filterSelect = renderFilterSelect()
        let table = generateBaseTable()
        div.appendChild(table)
        table.rows[0].getElementsByTagName('th')[0].setAttribute('class','topLeftHeader')
        table.rows[0].getElementsByTagName('th')[4].setAttribute('class','topRightHeader')
        let newButton = generateNewButton(category.id)
        let reverseButton = reverseGamesButton(category)
        buttonRow.appendChild(newButton)
        buttonRow.appendChild(reverseButton)
        buttonRow.insertAdjacentHTML('beforeend', filterSelect)
        let select = d.getElementById('filter')
        select.addEventListener("change", renderFilterField)
        games.map(game => {
            let newGame = new Game(game)
            table.innerHTML += newGame.renderGame()
        })
        table.rows[table.rows.length - 1].setAttribute('class', 'last_row')
        closeNav()
    })
}

function reverseGamesButton(category = null){
    let reverseButton = d.createElement('button')
    reverseButton.appendChild(d.createTextNode('Reverse'))
    reverseButton.setAttribute('class', 'selectionButton')
    reverseButton.addEventListener('click', e => {
        e.preventDefault()
        games.reverse()
        gamesReversed = !gamesReversed


        let div = d.querySelector('main #container')
        div.setAttribute('class', '')
        
        if (category){
            div.innerHTML = `<h1>Select a ${category.title}</h1><div id="buttons"></div>`
            let buttonRow = d.getElementById('buttons')
            let filterSelect = renderFilterSelect()
            let table = generateBaseTable()
            div.appendChild(table)
            table.rows[0].getElementsByTagName('th')[0].setAttribute('class','topLeftHeader')
            table.rows[0].getElementsByTagName('th')[4].setAttribute('class','topRightHeader')
            let newButton = generateNewButton(category.id)
            let reverseButton = reverseGamesButton(category)
            buttonRow.appendChild(newButton)
            buttonRow.appendChild(reverseButton)
            buttonRow.insertAdjacentHTML('beforeend', filterSelect)
            let select = d.getElementById('filter')
            select.addEventListener("change", renderFilterField)
            games.map(game => {
                let newGame = new Game(game)
                table.innerHTML += newGame.renderGame()
            })
            table.rows[table.rows.length - 1].setAttribute('class', 'last_row')
        } else {
            div.innerHTML = `<h1>Select a Game</h1><div id="buttons"></div>`
            let buttonRow = d.getElementById('buttons')
            let filterSelect = renderFilterSelect()
            let table = generateAllGamesTable()
            div.appendChild(table)
            table.rows[0].getElementsByTagName('th')[0].setAttribute('class','topLeftHeader')
            table.rows[0].getElementsByTagName('th')[5].setAttribute('class','topRightHeader')
            let newButton = generateNewButtonForAll()
            let reverseButton = reverseGamesButton()
            buttonRow.appendChild(newButton)
            buttonRow.appendChild(reverseButton)
            buttonRow.insertAdjacentHTML('beforeend', filterSelect)
            let select = d.getElementById('filter')
            select.addEventListener("change", renderFilterField)
            games.map(game => {
                let newGame = new Game(game)
                table.innerHTML += newGame.renderWithCat()
            })
            table.rows[table.rows.length - 1].setAttribute('class', 'last_row')
        }
        closeNav()
    })
    return reverseButton
}

function loadAllGames(event){
    event.preventDefault()
    fetch(BASE_URL + `/games`)
    .then(resp => resp.json())
    .then(allGames => {
        let div = d.querySelector('main #container')
        div.setAttribute('class', '')

        games = allGames.sort((a, b) => {
            if (a.title > b.title){
                return 1
            }
            if (b.title > a.title){
                return -1
            }
            return 0
        })

        div.innerHTML = `<h1>Select a Game</h1><div id="buttons"></div>`
        let buttonRow = d.getElementById('buttons')

        let filterSelect = renderFilterSelect()

        let table = generateAllGamesTable()
        div.appendChild(table)
        table.rows[0].getElementsByTagName('th')[0].setAttribute('class','topLeftHeader')
        table.rows[0].getElementsByTagName('th')[5].setAttribute('class','topRightHeader')
        let newGame = generateNewButtonForAll()
        let reverseButton = reverseGamesButton()
        buttonRow.appendChild(newGame)
        buttonRow.appendChild(reverseButton)
        buttonRow.insertAdjacentHTML('beforeend', filterSelect)
        let select = d.getElementById('filter')
        select.addEventListener("change", renderFilterField)
        games.map(game => {
            let newGame = new Game(game)
            table.innerHTML += newGame.renderWithCat()
        })
        table.rows[table.rows.length - 1].setAttribute('class', 'last_row')
        closeNav()
    })
}

function generateAllGamesTable(){
    let headerArr = ['Game Title', 'Game Genre', 'Number of Players', 'Average Playtime', 'Challenge Rating', 'Game Category']
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

d.addEventListener("DOMContentLoaded", () =>{
    homePage()
    d.getElementById('sideNavTTG').addEventListener('click', (event) => {
        closeForm()
        gamesReversed = false
        loadGames(event, 1)
    })
    d.getElementById('sideNavVG').addEventListener('click', (event) => {
        closeForm()
        gamesReversed = false
        loadGames(event, 2)
    })
    d.getElementById('sideNavALL').addEventListener('click', (event) => {
        closeForm()
        gamesReversed = false
        loadAllGames(event)
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

function generateNewButtonForAll(){
    let newGame = d.createElement('button')
    newGame.setAttribute('id', 'newGameButton')
    newGame.appendChild(d.createTextNode("New Game"))

    newGame.addEventListener('click', () => {
        let div = d.getElementById('sideForm')

        let tabletop = d.createElement('button')
        tabletop.setAttribute('class', 'selectionButton')
        tabletop.appendChild(d.createTextNode("Tabletop"))
        tabletop.addEventListener('click', event => loadForm(event, 1))

        let video = d.createElement('button')
        video.setAttribute('class', 'selectionButton')
        video.appendChild(d.createTextNode("Video"))
        video.addEventListener('click', event => loadForm(event, 2))
        
        div.innerHTML = `<div id="formToggle" onclick="closeForm()">&times;</div><br><br><center><h2>What Kind of Game Are You Creating?</h2></center>`
        let center = d.getElementsByTagName("center")[0]
        center.appendChild(tabletop)
        center.appendChild(video)

        openForm()
    })

    return newGame
}

function loadForm(event, category_id){
    event.preventDefault()
    let div = d.getElementById('sideForm')
    fetch(BASE_URL + `/categories/${category_id}`)
    .then(resp => resp.json())
    .then(category => {
        let genreDiv = d.getElementById('allGenres')
        let genres = category.genres.sort((a, b) => {
            if (a.title > b.title){
                return 1
            }
            if (b.title > a.title){
                return -1
            }
            return 0
        })
        genreDiv.innerHTML = genres.map((genre) => `<input type="checkbox" name="game[genre_ids][]" value="${genre.id}">${toTitleCase(genre.title)}<br>`).join(" ")
        openForm()
    })
    let gameForm = `
    <div id="formToggle" onclick="closeForm()">&times;</div>
    <center><h2>Add a New Game</h2></center>
    <form class="GameForm">
        <label for="gameTitle">Game Title: </label>
        <input type="text" name="gameTitle"/><br><br>
        <label for="genres">Genres: </label><br>
        <div id="allGenres"></div>
        <label for="new_genre">New Genre: </label>
        <input type="text" name="game[genres_attributes][0][title]"><br><br>
        <label for="min_players">Players(min): </label>
        <input type="number" name="min_players" min="1"/><br><br>
        <label for="max_players">Players(max): </label>
        <input type="number" name="max_players" min="1"/><br><br>
        <label for="playtime">Average Playtime(in minutes): </label>
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
    
    let form = d.getElementsByClassName('GameForm')[0]
    form.addEventListener("submit", event => {
        submitNewGame(event, category_id)
    })
}

function generateNewButton(category_id){
    let newGame = d.createElement('button')
    newGame.setAttribute('id', 'newGameButton')
    newGame.appendChild(d.createTextNode("New Game"))

    newGame.addEventListener('click', e => loadForm(e, category_id))

    return newGame
}

function submitNewGame(e, category_id){
    e.preventDefault()
    let allInputs = [].slice.call(d.getElementsByTagName('input'))
    let gameTitle = allInputs[0].value.toLowerCase()
    let minPlayers = d.getElementsByName('min_players')[0].value
    let maxPlayers = d.getElementsByName('max_players')[0].value
    let playtime = d.getElementsByName('playtime')[0].value
    let genres = getCheckedBoxes(d.getElementsByName('game[genre_ids][]'))
    let difficulties = getCheckedBoxes(d.getElementsByName('challenge'))
    let genTitle = d.getElementsByName('game[genres_attributes][0][title]')[0].value.toLowerCase()

    fetch(BASE_URL + '/games', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            game:{
                id: "",
                title: gameTitle.toLowerCase(),
                player_min: minPlayers,
                player_max: maxPlayers,
                game_length: playtime,
                challenge: difficulties[0],
                category_id: category_id,
                genre_ids: genres,
                genres_attributes:{
                    category_id: category_id,
                    title: genTitle.toLowerCase()
                }
            }
        })
    })
    .then(resp => resp.json())
    .then(newGame => {
        let game = new Game(newGame)
        let table = d.getElementsByClassName('game_table')[0]
        if (d.getElementById('filterField')){
            let input = d.getElementById('filterField')
            if (input.value !== ""){
                tablerows = [...table.getElementsByTagName('tr')]
                tablerows.forEach(row => {
                    row.style.display = ""
                })
                input.value = ""
            } else {
                table = d.getElementsByClassName('game_table')[0]
            }
        }
        if (d.getElementsByTagName('h1')[0].textContent === "Select a Game"){
            table.innerHTML += game.renderWithCat()
        } else {
            table.innerHTML += game.renderGame()
        }
        table.rows[table.rows.length - 2].setAttribute('class', '')
        table.rows[table.rows.length - 1].setAttribute('class', 'last_row')
        showNoticeDiv(`${game.title} has been created`)
        clearForm()
        closeForm()
    })
    .catch(error => {
        errorAlert()
    })
}

function errorAlert(){
    return alert(`Make Sure Your Submission Follows These Rules:
    ~ The Title is Present and Unique
    ~ For Duplicates, place a Year next to the Title (e.g. 20XX)
    ~ Min/Max Players and Playtime are all Numbers Larger than 0
    ~ Min Players is smaller or the same value as Max Players
    ~ A Challenge Rating is Selected`)
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

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}