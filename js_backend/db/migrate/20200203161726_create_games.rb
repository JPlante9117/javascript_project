class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.integer :category_id
      t.string :title
      t.integer :player_min
      t.integer :player_max
      t.integer :suggested_min_age
      t.integer :game_length
      t.string :challenge

      t.timestamps
    end
  end
end
