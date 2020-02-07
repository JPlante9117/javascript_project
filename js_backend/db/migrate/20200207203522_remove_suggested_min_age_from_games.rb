class RemoveSuggestedMinAgeFromGames < ActiveRecord::Migration[6.0]
  def change

    remove_column :games, :suggested_min_age, :integer
  end
end
