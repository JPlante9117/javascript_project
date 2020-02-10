class Game {

    constructor(game){
        this.id = game.id
        this.title = toTitleCase(game.title)
        this.player_min = game.player_min
        this.player_max = game.player_max
        this.game_length = game.game_length
        this.challenge = game.challenge
        this.genres = game.genres
        this.category = game.category
    }

    displayGenreNames(){
        let string =  this.genres.map(genre => genre.title).join(", ")
        return toTitleCase(string)
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
                ${this.displayGenreNames()}
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