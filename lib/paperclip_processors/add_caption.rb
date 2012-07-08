module Paperclip
  class AddCaption < Processor
    attr_accessor :whiny

    def initialize(file, options = {}, attachment = nil)
      super

      @file                 = file
      @whiny                = options[:whiny].nil? ? true : options[:whiny]
      @current_format       = File.extname(@file.path)
      @basename             = File.basename(@file.path, @current_format)

      @caption_background   = options[:background] || "#ccccccff"
      @font_color           = options[:color] || "#ffffffff"
      @font_family          = options[:font] || "Helvetica Bold"

      # in points
      @padding              = options[:padding] || 10
      @font_size            = options[:font_size] || 16
      @density              = options[:density] || 72

      @caption              = (attachment && attachment.instance && attachment.instance.caption) || "It's pretty cool default caption"
    end

    def make
      src = @file
      dst = Tempfile.new([@basename, "-caption#{@current_format}"])
      dst.binmode

      begin
        # convert -background none :source -append \( -background '#ccc' -font Helvetica -border 10 -bordercolor '#ccc' -pointsize 16 -weight 900 -density 72 -size 215x -fill '#eeea' caption:"It's a pretty cool caption, right?" \) -append :dest
        parameters = []
        parameters << ":source"
        parameters << transformation_command
        parameters << ":dest"

        parameters = parameters.flatten.compact.join(" ").strip.squeeze(" ")

        success = Paperclip.run("convert", parameters, source: "#{File.expand_path(src.path)}", dest: File.expand_path(dst.path))
      rescue Cocaine::ExitStatusError => e
        raise PaperclipError, "There was an error processing a caption for #{@basename}" if @whiny
      rescue Cocaine::CommandNotFoundError => e
        raise Paperclip::CommandNotFoundError.new("Could not run the `convert` command. Please install ImageMagick.")
      end

      dst
    end

    def transformation_command
      trans = []
      trans << "-append"
      trans << '\('
        trans << "-background '#{@caption_background}'"
        trans << "-font '#{@font_family}'"
        trans << "-border #{@padding}"
        trans << "-bordercolor '#{@caption_background}'"
        trans << "-pointsize #{@font_size}"
        trans << "-density #{@density}"
        trans << "-size #{Paperclip::Geometry.from_file(@file).to_s.sub(/x\d+/, 'x').to_i - 2 * @padding}"
        trans << "-fill '#{@font_color}'"
        trans << %(caption:"#{@caption}")
      trans << '\)'
      trans << "-append"
      trans
    end
  end
end