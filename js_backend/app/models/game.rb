class Game < ApplicationRecord
    belongs_to :category
    has_many :game_genres
    has_many :genres, through: :game_genres

    validates :title, :player_min, :player_max, :game_length, :challenge, :category_id, presence: true
    validates :title, uniqueness: true
    validates :player_min, numericality: {less_than_or_equal_to: :player_max}
    validates :player_max, numericality: {less_than_or_equal_to: :player_min}

end
