$(function () {
    var $content = $('#content');

    $content.on('click', '.editable', function (e) {
        e.preventDefault();
        var $el = $(this), ed, $controls;

        if (!$el.hasClass('editing')) {
            $el.addClass('editing');
            ed = new Editor(this);
            $controls = $([
              '<div class="controls">',
                '<a href="#" id="title">Title</a>',
                '<a href="#" id="bold">Bold</a>',
              '<div>'
            ].join(''));

            $el.before($controls);

            $controls.on('click', '#bold', function (e) {
                e.preventDefault();
                ed.setBold();
            });

            $controls.on('click', '#title', function (e) {
                e.preventDefault();
                ed.setTitle1();
            });

        }
    });
});
