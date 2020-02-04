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
    tabletop.addEventListener('click', event => {
        event.preventDefault()
        fetch(BASE_URL + '/categories/1')
        .then(resp => resp.json())
        .then(category => {
            div.setAttribute('class', '')
            let games = category.games
            div.innerHTML = "<h1>Select a Tabletop Game</h1>"
            let table = generateBaseTable()
            div.appendChild(table)
            for(let i = 0; i < games.length; i++){
                generateGameRow(games, table, i)
            }
            closeNav()
        })
    })

    let video = d.createElement('button')
    setAttributes(video, {'id': 'vg_button'})
    video.appendChild(d.createTextNode("Video Games"))
    video.addEventListener('click', event => {
        event.preventDefault()
        fetch(BASE_URL + '/categories/2')
        .then(resp => resp.json())
        .then(category => {
            div.setAttribute('class', '')
            let games = category.games
            div.innerHTML = "<h1>Select a Video Game</h1>"
            let table = generateBaseTable()
            div.appendChild(table)
            for(let i = 0; i < games.length; i++){
                generateGameRow(games, table, i)
            }
            closeNav()
        })
    })
    div.innerHTML = "<h1>What Kind of Game Will You Be Playing?</h1>"
    div.appendChild(tabletop)
    div.appendChild(video)
}

d.addEventListener("DOMContentLoaded", () =>{
    homePage()
    d.getElementById('sideNavTTG').addEventListener('click', (event) => {
        event.preventDefault()
        fetch(BASE_URL + '/categories/1')
        .then(resp => resp.json())
        .then(category => {
            let div = d.querySelector('main #container')
            div.setAttribute('class', '')
            let games = category.games
            div.innerHTML = "<h1>Select a Tabletop Game</h1>"
            let table = generateBaseTable()
            div.appendChild(table)
            for(let i = 0; i < games.length; i++){
                generateGameRow(games, table, i)
            }
            closeNav()
        })
    })
    d.getElementById('sideNavVG').addEventListener('click', (event) => {
        event.preventDefault()
        fetch(BASE_URL + '/categories/2')
        .then(resp => resp.json())
        .then(category => {
            let div = d.querySelector('main #container')
            if (div.className){
                div.setAttribute('class', '')
            }
            let games = category.games
            div.innerHTML = "<h1>Select a Video Game</h1>"
            let table = generateBaseTable()
            div.appendChild(table)
            for(let i = 0; i < games.length; i++){
                generateGameRow(games, table, i)
            }
            closeNav()
        })
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