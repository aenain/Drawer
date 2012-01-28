require 'image_i_o'

class DrawingsController < ApplicationController
  def index
    @drawings = Drawing.all
  end

  def create
    @drawing = Drawing.new
    raw_image = params.delete(:image)

    @drawing.sketch = ImageIO.from_base64(raw_image)
    @drawing.save!

    @drawing.recognize!

    if request.xhr?
      render :json => { :redirect => drawings_path }
    else
      redirect_to drawings_path
    end
  end

end