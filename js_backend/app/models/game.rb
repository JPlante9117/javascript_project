class Game < ApplicationRecord
    belongs_to :category
    has_many :game_genres
    has_many :genres, through: :game_genres

    def genres_attributes=(genre_attributes)
        genre = Genre.find_or_create_by(genre_attributes)
        # GameGenre.create(game_id: self.id, genre_id: genre.id)
        self.genres << genre
      end

    validates :title, :player_min, :player_max, :challenge, :game_length, :category_id, presence: true
    validates :title, uniqueness: true
    validates :player_min, numericality: {less_than_or_equal_to: :player_max}
    validates :player_max, numericality: {greater_than_or_equal_to: :player_min}

end
