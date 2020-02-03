class GameSerializer < ActiveModel::Serializer

  belongs_to :category
  has_many :genres, through: :game_genres
  attributes :title
end
