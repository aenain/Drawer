var doodleSeries = {
  selectors: {
    series: '#drawing-series',
    frame: '#main-frame',
    links: {
      process: '#process',
      reset: '#again',
      previous: '#main-frame .navigation-link.previous',
      next: '#main-frame .navigation-link.next'
    }
  },
  doodle: {
    width: 100,
    height: 100
  },
  duration: 200,
  index: 0,
  count: null,
  maxCount: 30,
  processCallback: null,
  resizeTimeout: null,

  init: function() {
    this.cacheElements();
    this.bindEvents();
    this.alignSeriesToFrame();
    this.markAsFilled(this.$current);

    this.count = this.$series.find("canvas").size();
    this.currentIndex = 0; // I assume that it should start with the first canvas!
  },

  cacheElements: function() {
    this.$series = $(this.selectors.series);
    this.$current = this.$series.find(".current");

    if (this.$current.size() < 1)
      this.$current = this.$series.find(".canvas-container:first").addClass("current");

    this.$previous = this.$current.prev();
    this.$next = this.$current.next();

    this.$frame = $(this.selectors.frame);
    this.links = {
      $previous: $(this.selectors.links.previous),
      $next: $(this.selectors.links.next),
      $process: $(this.selectors.links.process),
      $reset: $(this.selectors.links.reset)
    };
  },

  bindEvents: function() {
     this.links.$previous.bind('click.doodleSeries.prev', this.previous);
     this.links.$next.bind('click.doodleSeries.next', this.next);
     this.links.$process.bind('click.doodleSeries.process', this.process);
     this.links.$reset.bind('click.doodleSeries.reset', this.reset);
   },

  alignSeriesToFrame: function() {
    this.$series.css({ marginLeft: (this.$frame.offset().left - 5) + 'px' });
  },

  isFilled: function($container) {
    var $canvas = $container.find("canvas");
    return !! $canvas.attr("data-filled");
  },

  markAsFilled: function($container) {
    var $canvas = $container.find("canvas");
    $canvas.attr("data-filled", true);
  },

  onResize: function() {
    var ds = doodleSeries;

    clearTimeout(ds.resizeTimeout);
    ds.resizeTimeout = setTimeout(ds.afterResize, 100);
  },

  afterResize: function() {
    var ds = doodleSeries;
    ds.currentIndex = 0;

    ds.hideLink("$previous");
    ds.showLink("$next");
    ds.alignSeriesToFrame();

    ds.setCurrent(ds.getFirst(), { canvas: true });
  },

  previous: function() {
    var ds = doodleSeries;
    ds.showLink('$next');
    ds.currentIndex--;

    if (ds.isFirst())
      ds.hideLink('$previous');

    ds.setCurrent(ds.$previous, { canvas: true });
    ds.slide({ direction: 'right' }, doodle.show);
  },

  next: function() {
    var ds = doodleSeries;
    ds.showLink("$previous");
    ds.currentIndex++;

    if (ds.isRightBeforeEnd())
      if (! ds.isFull())
        ds.addCanvas();
      else
        ds.hideLink("$next");

    ds.copyImageToCurrentCanvas();
    ds.copyImageFromContainer(ds.$next, { fill: ! ds.isFilled(ds.$next) });

    ds.setCurrent(ds.$next);
    ds.slide({ direction: 'left' }, doodle.show);
  },

  slide: function(options, callback) {
    doodle.hide();

    var marginChange = (options.direction == 'left') ? '-=106px' : '+=106px';
    this.$series.animate({ marginLeft: marginChange }, this.duration, callback);
  },

  showLink: function(name) {
    this.links[name].removeClass('hidden');
  },

  hideLink: function(name) {
    this.links[name].addClass('hidden');
  },

  setCurrent: function($container, options) {
    if (typeof options === "object" && options.canvas === true) {
      this.copyImageToCurrentCanvas();
      this.copyImageFromContainer($container);
    }

    $current = this.$series.find('.current').removeClass('current');
    this.$current = $container.addClass('current');
    this.$previous = $container.prev();
    this.$next = $container.next();
  },

  isFirst: function() {
    this.currentIndex < 1;
  },

  getFirst: function() {
    this.$series.find("canvas:first").parent();
  },

  isRightBeforeEnd: function() {
    return (this.currentIndex >= this.count - 2);
  },

  isFull: function() {
    return this.count >= this.maxCount;
  },

  copyImageToCurrentCanvas: function() {
    return this.copyImage(doodle.context, this.getContextFromContainer(this.$current));
  },

  copyImageFromContainer: function($container, options) {
    var image = this.copyImage(this.getContextFromContainer($container), doodle.context);

    if (typeof options === "object" && options.fill === true)
      doodle.clearCanvas();

    return (doodle.oldState = image);
  },

  copyImage: function(source, destination) {
    var image = source.getImageData(0, 0, this.doodle.width, this.doodle.height);
    destination.putImageData(image, 0, 0);
    return image;
  },

  getContextFromContainer: function($container) {
    return $container.find('canvas')[0].getContext('2d');
  },

  addCanvas: function(count) {
    var $canvas, $canvasContainer;
    count = (count || 1);

    for (var i = 0; i < count; i++) {
      $canvasContainer = $("<div class='canvas-container drawing'></div>"),
      $canvas = $("<canvas width='" + this.doodle.width + "' height='" + this.doodle.height + "'></canvas>");

      $canvas.appendTo($canvasContainer);
      $canvasContainer.appendTo(this.$series);
    }

    this.count += count;
  },

  process: function() {
    var ds = doodleSeries,
        $canvases = ds.$series.find("canvas[data-filled='true']"),
        images = new Array($canvases.length);

    ds.copyImageToCurrentCanvas();

    $canvases.each(function(i) {
      images[i] = this.toDataURL("image/png");
    });

    $.post("/drawing_sets", { images: images }, ds.processCallback);
  },

  reset: function() {
    var ds = doodleSeries;
    doodle.clearCanvas();

    ds.$series.find(".canvas-container").remove();
    ds.addCanvas(2);

    ds.init();
    ds.hideLink("$previous"); 
  }
};