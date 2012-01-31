class Drawing < ActiveRecord::Base
  belongs_to :drawing_set

  has_attached_file :sketch

  def recognize!
    recognize
    save!
  end

  def recognize
    prepare_file_for_network
    # run_network
  end

  private

  def prepare_file_for_network
    return if sketch.nil?
    self.network_file_path = File.join(absolute_directory, "sketch.pbm")
    
    # http://www.imagemagick.org/Usage/transform/#edge_vector
    Cocaine::CommandLine.new("convert", ":source -colorspace gray -threshold 50% -compress none -depth 1 :dest", { source: sketch.path, dest: network_file_path }).run
  end

  def run_network
    prepare_file_for_network if network_file_path.nil?
    self.recognition = Cocaine::CommandLine.new("./network_response", ":file", { file: network_file_path }).run
  end

  def absolute_directory
    return nil if sketch.nil?
    File.dirname(sketch.path)
  end
end
# == Schema Information
#
# Table name: drawings
#
#  id                  :integer(4)      not null, primary key
#  created_at          :datetime
#  updated_at          :datetime
#  sketch_file_name    :string(255)
#  sketch_content_type :string(255)
#  sketch_file_size    :integer(4)
#  sketch_updated_at   :datetime
#  network_file_path   :string(255)
#  recognition         :string(255)
#  drawing_set_id      :integer(4)
#
