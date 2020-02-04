class GameGenreSerializer < ActiveModel::Serializer

    belongs_to :game
    belongs_to :genre
    
    attributes :id, :game_id, :genre_id
  end
  