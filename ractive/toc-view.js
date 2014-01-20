var ractive = new Ractive({
  el: 'toc-view',
  template: '#ractive-toc',
  data: {
    chapters: tocResponse.data,
    ordinalize: function(ordinal) {
      return ordinal ? ordinal + "." : "▸";
    }
  }
});

ractive.on('toggleSections', function(event) {
  event.context.open = !event.context.open;
  this.update();
});
