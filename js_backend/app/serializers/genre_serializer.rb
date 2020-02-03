class GenreSerializer < ActiveModel::Serializer

  attributes :id, :title
  belongs_to :category
  has_many :games, through: :game_genres

  def category
    {id: self.object.category.id,
     title: self.object.category.title}
  end
end
