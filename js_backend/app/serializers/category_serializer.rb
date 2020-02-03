class CategorySerializer < ActiveModel::Serializer
  attributes :id, :title
  has_many :genres
  has_many :games

end
