# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_02_14_184914) do

  create_table "categories", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "game_genres", force: :cascade do |t|
    t.integer "genre_id"
    t.integer "game_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "category_id"
    t.string "title"
    t.integer "player_min"
    t.integer "player_max"
    t.integer "game_length"
    t.string "challenge"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "imageURL"
  end

  create_table "genres", force: :cascade do |t|
    t.string "title"
    t.integer "category_id"
  end

end
