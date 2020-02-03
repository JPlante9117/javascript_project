class GameSerializer < ActiveModel::Serializer

  belongs_to :category
  has_many :genres, through: :game_genres
  attributes :title, :player_min, :player_max, :challenge, :game_length, :genres
end
