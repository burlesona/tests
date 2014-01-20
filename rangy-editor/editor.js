(function (w, d) {
    var Editor = function (element, options) {
        var self = this;
        self.element = element;
        self.options = options || {};
        self.element.contentEditable = true;

        self.wrapNode = function (opts) {
            var node, selection, range;

            opts = opts || {};
            node = d.createElement(opts.tagName || 'span');
            if (opts.klass) {
                node.classList.add(opts.klass);
            }

            selection = rangy.getSelection();
            range = selection.getRangeAt(0);
            node.innerHTML = range.toHtml();
            range.deleteContents();
            range.insertNode(node);
        };

        self.setBold = function () {
            self.wrapNode({klass: 'bold'});
        };

        self.setTitle1 = function () {
            self.wrapNode({tagName: 'h1'});
        };
    };

    w.Editor = Editor;
})(window, document);
