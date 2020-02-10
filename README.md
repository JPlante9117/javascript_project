# Game Organizer

Game Organizer is a JavaScript web application that allows a user to keep track of the different games they own, and in turn assist them in viewing games applicable for the current setting. Users can select either Tabletop or Video Games, and then filter the results based on how much time they have, how many players are present, or what genre they are looking to play.

## Installation

Make sure your console's CD is in js_backend, then do the following:

Use `bundle install` to install all the necessary dependencies.

```bash
bundle install
```

Once all the dependencies are installed, run the migrations to set up your database.

```bash
rails db:migrate
```

You MUST run rails db:seed:categories to make sure you have the necessary categories for the application to run.

```bash
rails db:seed:categories
```

From here, you have two options. You may either:
1) Fully customize the genres for each type of game. To do so, just start the application and get going on your Game Organizer!

```bash
rails s
```

2) Seed the database with the most common genres for each game type, and then start the application!

```bash
rails db:seed:tabletop_genres
rails db:seed:videogame_genres
rails s
```

## Usage

The application starts with having the user select which type of game they are looking to work with.
Once selected, the user can:

- Look through existing games
- Filter the results using the filter drop-down and the newly generated filter text field
- Click on the name of an existing game to see an easier to read page.
    - On that page, you will find 'Edit Game' and 'Delete Game' buttons, as well as a 'Back' button.
    - The 'Edit Game' button will allow for the information about the game to be changed.
    - The 'Delete Game' button will prompt the user to confirm the deletion, and then delete the game from the database.
    - The 'Back Button' will return the user to the previous page.
- Create a new game using the 'New Game' button.

**NOTE: If any errors are in the forms for new or edited games, an alert will remind you to check back over your fields.**

On all pages, there is a symbol in the upper left-hand corner that allows for users toggle a navigation bar that allows for switching between the two types of games.

## Contributing

Any user is welcome to pull and use the application. If any major bugs are found, please send them my way to allow for updated solutions.

## License
[MIT](https://choosealicense.com/licenses/mit/)