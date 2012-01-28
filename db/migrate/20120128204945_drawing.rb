class Drawing < ActiveRecord::Migration
  def up
    change_table :drawings do |t|
      t.string :network_file_path
      t.string :recognition
    end
  end

  def down
    change_table :drawings do |t|
      t.remove :network_file_path
      t.remove :recognition
    end
  end
end
