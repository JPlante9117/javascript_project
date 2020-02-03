# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Category

Category.create(title: "Tabletop Game")
Category.create(title: "Video Game")

# Video Game Genres

Genre.create(title: "Action", category_id: 2)
Genre.create(title: "Adventure", category_id: 2)
Genre.create(title: "Beat 'Em Up", category_id: 2)
Genre.create(title: "Survival", category_id: 2)
Genre.create(title: "Horror", category_id: 2)
Genre.create(title: "Platformer", category_id: 2)
Genre.create(title: "Shooter", category_id: 2)
Genre.create(title: "Rhythm", category_id: 2)
Genre.create(title: "RPG", category_id: 2)
Genre.create(title: "Roguelike", category_id: 2)
Genre.create(title: "Sandbox", category_id: 2)
Genre.create(title: "MMO", category_id: 2)
Genre.create(title: "Simulation", category_id: 2)
Genre.create(title: "Strategy", category_id: 2)
Genre.create(title: "Racing", category_id: 2)
Genre.create(title: "Sport", category_id: 2)
Genre.create(title: "Trivia", category_id: 2)
Genre.create(title: "Puzzle", category_id: 2)
Genre.create(title: "Party", category_id: 2)

# Tabletop Game Genres

Genre.create(title: "Family", category_id: 1)
Genre.create(title: "Dexterity", category_id: 1)
Genre.create(title: "Party", category_id: 1)
Genre.create(title: "Hobby", category_id: 1)
Genre.create(title: "Abstracts", category_id: 1)
Genre.create(title: "Thematic", category_id: 1)
Genre.create(title: "Eurogames", category_id: 1)
Genre.create(title: "Wargames", category_id: 1)
Genre.create(title: "Deck-Building", category_id: 1)
Genre.create(title: "Cooperative", category_id: 1)
Genre.create(title: "Children's", category_id: 1)
Genre.create(title: "Dice", category_id: 1)
Genre.create(title: "Card", category_id: 1)
Genre.create(title: "Deceit", category_id: 1)
Genre.create(title: "Of The Mind", category_id: 1)