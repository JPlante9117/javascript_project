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
    main.appendChild(div)

    let tabletop = d.createElement('button')
    setAttributes(tabletop, {'id': 'tt_button'})
    tabletop.appendChild(d.createTextNode("Tabletop Games!"))
    tabletop.addEventListener('click', event => {
        event.preventDefault()
        fetch(BASE_URL + '/categories/1')
        .then(resp => resp.json())
        .then(category => {
            let games = category.games
            console.log(games)
            div.innerHTML = "<h1>Select a Tabletop Game</h1>"
            let table = generateBaseTable()
            div.appendChild(table)
            for(let i = 0; i < games.length; i++){
                console.log('huuuuuu')
                generateGameRow(games, table, i)
            }
        })
    })

    let video = d.createElement('button')
    setAttributes(video, {'id': 'vg_button'})
    video.appendChild(d.createTextNode("Video Games!"))
    video.addEventListener('click', event => {
        event.preventDefault()
        fetch()
    })
    div.innerHTML = "<h1>What Kind of Game Will You Be Playing?</h1>"
    div.appendChild(tabletop)
    div.appendChild(video)
}

d.addEventListener("DOMContentLoaded", e =>{
    homePage()
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

    title.textContent = obj[i].title
    genres.textContent = obj[i].genres
    players.textContent = `${obj[i].player_min} - ${obj[i].player_max}`
    playtime.textContent = obj[i].game_length
    challenge.textContent = obj[i].challenge
    
    console.log('hiiii')
}