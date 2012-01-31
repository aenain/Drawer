var about = {
  isHidden: true,
  selector: '.about',
  duration: 200,

  onResize: function() {
    $(this.selector).css({ top: '100%' });
    this.isHidden = true;
  },

  toggle: function() {
    var callback = (this.isHidden) ? null : function() { $(".about").css({ top: '100%' }); };
    $(this.selector).css({ top: this.computeTopOffset(this.isHidden) + 'px' }).animate({ top: this.computeTopOffset(! this.isHidden) + 'px' }, this.duration, callback);
    this.isHidden = ! this.isHidden;
  },

  getHeight: function() {
    return $(this.selector).height();
  },

  getWindowHeight: function() {
    return $(window).height();
  },

  computeTopOffset: function(isHidden) {
    var topOffset = (isHidden) ? this.getWindowHeight() : this.getWindowHeight() - this.getHeight();
    return topOffset;
  }
};
