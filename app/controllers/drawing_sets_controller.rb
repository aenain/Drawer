require 'image_i_o'

class DrawingSetsController < ApplicationController
  def index
    @drawing_sets = DrawingSet.includes(:drawings).all
  end

  def create
    @drawing_set = DrawingSet.create

    params[:images].each do |image|
      drawing = @drawing_set.drawings.create!(sketch: ImageIO.from_base64(image))
      drawing.recognize!
    end

    @drawing_set.recognition = @drawing_set.drawings.collect(&:recognition).join
    @drawing_set.evaluate!

    if request.xhr?
      render json: @drawing_set.reload.to_json
    else
      render nothing: true
    end
  end
end