function Worker(options, callback) {
  this.count = options.tasks;
  this.callback = callback;

  this.done = 0;
  var self = this;

  self.finish = function() {
    self.done++;

    if (self.done >= self.count)
      self.callback();
  }
};