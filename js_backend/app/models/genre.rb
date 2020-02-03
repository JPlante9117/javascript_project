class Genre < ApplicationRecord
    belongs_to :category
    has_many :game_genres
    has_many :games, through: :game_genres
end
