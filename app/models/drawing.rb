class Drawing < ActiveRecord::Base
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
    self.network_file_path = File.join(absolute_directory, "sketch.pbm")
    
    # http://www.imagemagick.org/Usage/transform/#edge_vector
    Cocaine::CommandLine.new("convert", ":source -colorspace gray -threshold 50% -compress none -depth 1 :dest", { source: sketch.path, dest: network_file_path }).run
  end

  def run_network
    return if network_file_path.nil?
    self.recognition = Cocaine::CommandLine.new("./network_response", ":file", { file: network_file_path }).run
  end

  def absolute_directory
    return nil if sketch.nil?
    File.dirname(sketch.path)
  end
end