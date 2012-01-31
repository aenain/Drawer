class AddDrawingSetIdToDrawing < ActiveRecord::Migration
  def up
    add_column :drawings, :drawing_set_id, :integer
    add_index :drawings, :drawing_set_id
  end

  def down
    remove_index :drawings, :drawing_set_id
    remove_column :drawings, :drawing_set_id
  end
end
