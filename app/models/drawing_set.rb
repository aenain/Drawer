class DrawingSet < ActiveRecord::Base
  has_many :drawings, :order => "id ASC"

  VALID_RECOGNITION = /^[\d.+\-*\/]+$/

  def evaluate
    if recognition =~ VALID_RECOGNITION
      begin
        self.evaluation = eval(recognition)
      rescue SyntaxError => e
        self.evaluation = "Syntax error!"
      end
    else
      self.evaluation = "Syntax error!"
    end
  end

  def evaluate!
    evaluate
    save!
  end
end# == Schema Information
#
# Table name: drawing_sets
#
#  id          :integer(4)      not null, primary key
#  recognition :string(255)
#  evaluation  :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#

