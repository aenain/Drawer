class DrawingSet < ActiveRecord::Migration
  def up
    create_table :drawing_sets do |t|
      t.string :recognition
      t.string :evaluation
      t.timestamps
    end
  end

  def down
    drop_table :drawing_sets
  end
end
