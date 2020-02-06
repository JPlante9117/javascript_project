class Game < ApplicationRecord
    belongs_to :category
    has_many :game_genres
    has_many :genres, through: :game_genres

    validates :title, :player_min, :player_max, :game_length, :challenge, :category_id, presence: true
    validates :player_max, :player_min, :game_length, numericality: true
    validates :title, uniqueness: true
end
