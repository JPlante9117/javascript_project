class AddImageUrlToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :imageURL, :text
  end
end
