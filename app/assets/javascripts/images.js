var images = {
  sufix: '-pressed',

  onMouseEnter: function() {
    var src = $(this).attr('src');
    $(this).attr({ src: images.addSufix(src, images.sufix) });
  },

  onMouseLeave: function() {
    var src = $(this).attr('src');
    $(this).attr({ src: images.removeSufix(src, images.sufix) });
  },

  addSufix: function(string, sufix) {
    return string.replace(/(\.[a-zA-Z0-9]+)$/, sufix + "$1");
  },

  removeSufix: function(string, sufix) {
    var regexp = new RegExp(sufix + "(\\.[a-zA-Z0-9]+)$");
    return string.replace(regexp, "$1");
  }
};