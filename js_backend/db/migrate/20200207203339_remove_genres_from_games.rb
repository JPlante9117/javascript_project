class RemoveGenresFromGames < ActiveRecord::Migration[6.0]
  def change
    remove_column :games, :genres, :text
  end
end
