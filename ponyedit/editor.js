$(function () {
    var getControls = function (pony) {
        var $controls = $(
            '<div class="controls">' +
              '<a href="#" id="italic">Italic</a>' +
              '<a href="#" id="image">Image</a>' +
            '</div>'
        );

        $controls.on('click', '#italic', function (e) {
            e.preventDefault();
            pony.setItalic();
        });

        $controls.on('click', '#image', function (e) {
            e.preventDefault();
            var value = prompt('URL:');
            if (value) {
                pony.insertImage([value]);
            }
        });

        return $controls;
    };

    var closeOthers = function () {
        $content.find('.editing').each(function (idx, el) {
            $(this).removeClass('editing')
                   .prop('contenteditable', false)
                   .prev('.controls')
                     .remove();
        });
    };

    var $content = $('#content');

    $content.on('click', '.editable', function (e) {
        e.preventDefault();
        var $el = $(this), $controls, pony;

        if (!$el.hasClass('editing')) {
            closeOthers();
            $el.prop('contenteditable', true);
            $el.addClass('editing')

            pony = ponyedit.init(this);
            $controls = getControls(pony);
            $el.before($controls);
        }
    });
});
