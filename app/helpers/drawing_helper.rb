module DrawingHelper
  # :previous or :next
  def canvas_navigation_tag(direction, options = {})
    raise ArgumentError "only :previous or :next are valid." unless [:previous, :next].include?(direction)

    elements = { previous: { src: 'left-arrow.svg', class: 'previous' }, next: { src: 'right-arrow.svg', class: 'next' } }
    css_class = "#{elements[direction][:class]} navigation-link " + (options.delete(:class) || "")
    image_tag "/assets/#{elements[direction][:src]}", options.merge({ class: css_class })
  end
end