class Drawing < ActiveRecord::Base
  belongs_to :drawing_set

  has_attached_file :sketch, styles: { neural: { threshold: '25%', size: '50x50', format: 'pbm' }}, processors: [:neural]
  validates_attachment_presence :sketch

  def recognize!
    recognize
    save!
  end

  def recognize
    # self.recognition = Cocaine::CommandLine.new("./network_response", ":file", { file: sketch.path(:neural) }).run
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
