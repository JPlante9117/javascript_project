class Game < ApplicationRecord
    belongs_to :category
    has_many :game_genres
    has_many :genres, through: :game_genres
end
