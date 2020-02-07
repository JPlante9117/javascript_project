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

Genre.create(title: "action", category_id: 2)
Genre.create(title: "adventure", category_id: 2)
Genre.create(title: "fighting", category_id: 2)
Genre.create(title: "survival", category_id: 2)
Genre.create(title: "horror", category_id: 2)
Genre.create(title: "platformer", category_id: 2)
Genre.create(title: "shooter", category_id: 2)
Genre.create(title: "rhythm", category_id: 2)
Genre.create(title: "rpg", category_id: 2)
Genre.create(title: "roguelike", category_id: 2)
Genre.create(title: "sandbox", category_id: 2)
Genre.create(title: "mmo", category_id: 2)
Genre.create(title: "simulation", category_id: 2)
Genre.create(title: "strategy", category_id: 2)
Genre.create(title: "racing", category_id: 2)
Genre.create(title: "sport", category_id: 2)
Genre.create(title: "trivia", category_id: 2)
Genre.create(title: "puzzle", category_id: 2)
Genre.create(title: "party", category_id: 2)

# Tabletop Game Genres

Genre.create(title: "family", category_id: 1)
Genre.create(title: "dexterity", category_id: 1)
Genre.create(title: "party", category_id: 1)
Genre.create(title: "hobby", category_id: 1)
Genre.create(title: "abstracts", category_id: 1)
Genre.create(title: "thematic", category_id: 1)
Genre.create(title: "eurogames", category_id: 1)
Genre.create(title: "wargames", category_id: 1)
Genre.create(title: "deck-building", category_id: 1)
Genre.create(title: "cooperative", category_id: 1)
Genre.create(title: "children's", category_id: 1)
Genre.create(title: "dice", category_id: 1)
Genre.create(title: "card", category_id: 1)
Genre.create(title: "deceit", category_id: 1)
Genre.create(title: "of the mind", category_id: 1)