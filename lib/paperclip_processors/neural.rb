module Paperclip
  class Neural < Processor
    TARGET_FORMAT = 'pbm' # P1 (text)

    attr_accessor :whiny

    def initialize(file, options = {}, attachment = nil)
      super

      raise ArgumentError, "format .pbm has to be specified." if options[:format] != TARGET_FORMAT

      @file                 = file
      @whiny                = options[:whiny].nil? ? true : options[:whiny]
      @current_format       = File.extname(@file.path)
      @basename             = File.basename(@file.path, @current_format)

      @colorspace           = 'gray'
      @threshold            = options[:threshold] || '50%'
      @size                 = options[:size]
    end

    def make
      src = @file
      dst = Tempfile.new([@basename, ".#{TARGET_FORMAT}"])
      dst.binmode

      begin
        parameters = []
        parameters << ":source"
        parameters << transformation_command
        parameters << ":dest"

        parameters = parameters.flatten.compact.join(" ").strip.squeeze(" ")

        success = Paperclip.run("convert", parameters, source: "#{File.expand_path(src.path)}", dest: File.expand_path(dst.path))
      rescue Cocaine::ExitStatusError => e
        raise PaperclipError, "There was an error processing the neural for #{@basename}" if @whiny
      rescue Cocaine::CommandNotFoundError => e
        raise Paperclip::CommandNotFoundError.new("Could not run the `convert` command. Please install ImageMagick.")
      end

      dst
    end

    def transformation_command
      trans = []
      trans << "-background white -flatten"
      trans << "-colorspace" << @colorspace
      trans << "-threshold" << @threshold
      trans << "-resize" << @size if @size.present?
      trans << "-compress none -depth 1"
      trans
    end
  end
end