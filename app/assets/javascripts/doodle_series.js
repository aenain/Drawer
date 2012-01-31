var doodleSeries = {
  selectors: {
    series: '#drawing-series',
    frame: '#main-frame',
    processLink: '#process',
    previousLink: '#main-frame .navigation-link.previous',
    nextLink: '#main-frame .navigation-link.next'
  },
  doodle: {
    width: 100,
    height: 100
  },
  duration: 200,
  maxCount: 30,
  processCallback: null,

  init: function() {
    this.alignSeriesToFrame();
    this.bindEvents();
  },

  alignSeriesToFrame: function() {
    $(this.selectors.series).css({ marginLeft: ($(this.selectors.frame).offset().left - 5) + 'px' });
  },

  bindEvents: function() {
    $(this.selectors.previousLink).bind('click.doodleSeries.prev', this.previous);
    $(this.selectors.nextLink).bind('click.doodleSeries.next', this.next);
    $(this.selectors.processLink).bind('click.doodleSeries.process', this.process);
  },

  // keyword this has been replaced with doodleSeries because this method is used as a callback
  previous: function() {
    var $current = doodleSeries.getCurrent().removeClass('current');
    var $prev = $current.prev().addClass('current');
    $(doodleSeries.selectors.nextLink).removeClass('hidden');

    if ($prev.prev().size() == 0)
      $(doodleSeries.selectors.previousLink).addClass("hidden");

    doodleSeries.copyImage(doodle.context, doodleSeries.getContextFromContainer($current));
    doodle.oldState = doodleSeries.copyImage(doodleSeries.getContextFromContainer($prev), doodle.context);

    doodle.hide();
    doodleSeries.slide({ direction: 'right' }, doodle.show);
  },

  // keyword this has been replaced with doodleSeries because this method is used as a callback
  next: function() {
    var $current = doodleSeries.getCurrent().removeClass('current');
    var $next = $current.next().addClass('current');
    $(doodleSeries.selectors.previousLink).removeClass('hidden');

    if ($next.next().size() == 0)
      if ($(doodleSeries.selectors.series).children().size() < doodleSeries.maxCount)
        doodleSeries.addCanvas();
      else
        $(doodleSeries.selectors.nextLink).addClass("hidden");

    doodleSeries.copyImage(doodle.context, doodleSeries.getContextFromContainer($current));
    doodle.oldState = doodleSeries.copyImage(doodleSeries.getContextFromContainer($next), doodle.context);

    doodle.hide();
    doodleSeries.slide({ direction: 'left' }, doodle.show);
  },

  getCurrent: function() {
    return $(this.selectors.series).find('.current');
  },

  addCanvas: function() {
    var $canvasContainer = $("<div class='canvas-container drawing'></div>");
    var $canvas = $("<canvas width='" + this.doodle.width + "' height='" + this.doodle.height + "'></canvas>");

    $canvas.appendTo($canvasContainer);
    $canvasContainer.appendTo($(this.selectors.series));

    return $canvasContainer;
  },

  getContextFromContainer: function($container) {
    return $container.find('canvas')[0].getContext('2d');
  },

  copyImage: function(source, destination) {
    var image = source.getImageData(0, 0, this.doodle.width, this.doodle.height);
    destination.putImageData(image, 0, 0);
    return image;
  },

  slide: function(options, callback) {
    var marginChange = (options.direction == 'left') ? '-=106px' : '+=106px';
    $(this.selectors.series).animate({ marginLeft: marginChange }, this.duration, callback);
  },

  process: function() {
    var $canvases = $(doodleSeries.selectors.series).find('canvas');
    var images = new Array($canvases.length);

    $canvases.each(function(i) {
      images[i] = this.toDataURL("image/png");
    });

    $.post("/drawing_sets", { images: images }, doodleSeries.processCallback);
  },

  reset: function() {
    doodle.clearCanvas();

    $(doodleSeries.selectors.series).find(".canvas-container").remove();
    $(doodleSeries.selectors.previousLink).addClass('hidden');
    doodleSeries.addCanvas();
    doodleSeries.addCanvas();
    $(doodleSeries.selectors.series).find(".canvas-container:first").addClass('current');

    doodleSeries.alignSeriesToFrame();
  }
};