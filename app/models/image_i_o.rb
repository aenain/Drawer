class ImageIO < StringIO
  BASE64_REGEXP = /data:image\/(?<extension>[[:alpha:]]+);base64,/ # http://en.wikipedia.org/wiki/Data_URI_scheme

  def initialize(content, extension)
    super(content)
    @extension = extension
  end

  def original_filename
    "image-#{Time.now.to_i}.#{@extension}"
  end

  def content_type
    "image/#{@extension}"
  end

  def self.from_base64(raw_base64)
    match = raw_base64.match(BASE64_REGEXP)
    return nil if match.nil?

    raw_content = raw_base64.split(BASE64_REGEXP).last 
    new(Base64.decode64(raw_content), match['extension'])
  end
end