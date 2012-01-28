class AddAttachmentSketchToDrawing < ActiveRecord::Migration
  def self.up
    add_column :drawings, :sketch_file_name, :string
    add_column :drawings, :sketch_content_type, :string
    add_column :drawings, :sketch_file_size, :integer
    add_column :drawings, :sketch_updated_at, :datetime
  end

  def self.down
    remove_column :drawings, :sketch_file_name
    remove_column :drawings, :sketch_content_type
    remove_column :drawings, :sketch_file_size
    remove_column :drawings, :sketch_updated_at
  end
end
