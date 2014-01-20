/*  ========================================================================
 *  Frosty.js v1.04
 *  https://owensbla.github.com/frosty/
 *
 *  Plugin boilerplate provied by: http://jqueryboilerplate.com/
 *  ========================================================================
 *  Copyright 2013 Blake Owens (http://blakeowens.com/)
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 *  and associated documentation files (the "Software"), to deal in the Software without restriction,
 *  including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *  and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 *  subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all copies or 
 *  substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 *  LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 *  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  ======================================================================== */

;(function ($, window, document, undefined) {

    var pluginName = "frosty";
    var defaults = {
        attribute: 'title',
        classes: 'tip',
        content: '',
        delay: 0,
        hasArrow: true,
        html: false,
        offset: 10,
        position: 'top',
        removeTitle: true,
        selector: false,
        smartReposition: true,
        trigger: 'hover',
        onHidden: function() {},
        onShown: function() {}
    };

    function Frosty(anchor, options) {
        this.anchor = anchor;
        this.$anchor = $(anchor);
        this.options = $.extend({}, defaults, options, this.$anchor.data());
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Frosty.prototype = {
        init: function () {
            this.rid = Math.random().toString(36).substr(2, 16); // used to uniquely unbind the window resize events
            this._createTip();
            this._bindEvents();
        },

        _createTip: function() {
            if (this.options.html) {
                this.tipContent = this.options.content;
            } else if (this.options.selector) {
                this.tipContent = $(this.options.selector).html();
            } else {
                this.tipContent = this.$anchor.attr(this.options.attribute);
                if (this.options.attribute === 'title' && this.options.removeTitle) {
                    this.$anchor.attr('data-original-title', this.tipContent);
                    this.$anchor.removeAttr('title');
                }
            }

            this.$el = $('<div />', {
                'class': this.options.classes,
                html: this.tipContent
            }).css({
                'z-index': '9999',
                'left': '-9999px',
                'position': 'absolute'
            });

            this.$el.appendTo('body');
            var coords = this._getPosition();
            coords = this._checkOverflow(coords);
            this.$el.detach().css(coords);

            if (this.options.hasArrow) { this._addArrowClass(); }
        },

        _bindEvents: function() {
            switch (this.options.trigger) {
                case 'click':
                    this.$anchor.on('click.' + pluginName, $.proxy(this.toggle, this));
                    break;
                case 'manual':
                    break;
                case 'focus':
                    this.$anchor.on('focus.' + pluginName, $.proxy(this.show, this));
                    this.$anchor.on('blur.' + pluginName, $.proxy(this.hide, this));
                    break;
                default:
                    this.$anchor.on('mouseenter.' + pluginName, $.proxy(this.show, this));
                    this.$anchor.on('mouseleave.' + pluginName, $.proxy(this.hide, this));
            }

            $(window).on('resize.' + this.rid, $.proxy(this._setPosition, this));
        },

        _setState: function(state) {
            this.state = state;
            switch (state) {
                case 'visible':
                    this.$el.appendTo('body');
                    this._checkContent();
                    this._setPosition();
                    this.options.onShown.call(this);
                    this.$anchor.trigger('shown');
                    break;
                case 'hidden':
                    this.$el.detach();
                    this.options.onHidden.call(this);
                    this.$anchor.trigger('hidden');
                    break;
            }
        },

        _checkContent: function() {
            if (this.options.selector) {
                this.tipContent = $(this.options.selector).html();
                this.$el.html(this.tipContent);
            }
        },

        _addArrowClass: function() {
            switch (this.options.position) {
                case 'left':
                    this.$el.addClass('arrow-right');
                    break;
                case 'right':
                    this.$el.addClass('arrow-left');
                    break;
                case 'bottom':
                    this.$el.addClass('arrow-top');
                    break;
                default:
                    this.$el.addClass('arrow-bottom');
            }
        },

        _getPosition: function () {
            var coords = this.$anchor.offset();
            switch (this.options.position) {
                case 'left':
                    coords.left = coords.left - this.$el.outerWidth() - this.options.offset;
                    coords.top = coords.top + (this.$anchor.outerHeight() / 2) - (this.$el.outerHeight() / 2);
                    break;
                case 'right':
                    coords.left = coords.left + this.$anchor.outerWidth() + this.options.offset;
                    coords.top = coords.top + (this.$anchor.outerHeight() / 2) - (this.$el.outerHeight() / 2);
                    break;
                case 'bottom':
                    coords.top = coords.top + this.$anchor.outerHeight() + this.options.offset;
                    coords.left = coords.left + (this.$anchor.outerWidth() / 2) - (this.$el.outerWidth() / 2);
                    break;
                default:
                    coords.top = coords.top - this.$el.outerHeight() - this.options.offset;
                    coords.left = coords.left + (this.$anchor.outerWidth() / 2) - (this.$el.outerWidth() / 2);
            }
            return coords;
        },

        _checkOverflow: function(coords) {
            if (!this.options.smartReposition) { return coords; }
            var originalPosition = this.options.position;
            
            if (coords.top < 0) { this.options.position = 'bottom'; }
            if (coords.top + this.$el.height() > $(window).height()) { this.options.position = 'top'; }
            if (coords.left < 0) { this.options.position = 'right'; }
            if (coords.left + this.$el.width() > $(window).width()) { this.options.position = 'left'; }

            if (this.options.position !== originalPosition) {
                coords = this._getPosition();
                this.$el.attr('class', this.options.classes);
                this._addArrowClass();
            }

            return coords;
        },

        _setPosition: function() {
            var coords = this._getPosition();
            coords = this._checkOverflow(coords);
            this.$el.css(coords);
        },

        show: function() {
            var _this = this,
                delay = typeof this.options.delay === 'object' ? parseInt(this.options.delay.show, 10) : parseInt(this.options.delay, 10);
            
            clearTimeout(this.timeout);
            this.timeout = delay === 0 ?
                this._setState('visible') :
                setTimeout(function() { _this._setState('visible'); }, delay);
        },

        hide: function() {
            var _this = this,
                delay = typeof this.options.delay === 'object' ? parseInt(this.options.delay.hide, 10) : parseInt(this.options.delay, 10);

            clearTimeout(this.timeout);
            this.timeout = delay === 0 ?
                this._setState('hidden') :
                setTimeout(function() { _this._setState('hidden'); }, delay);
        },

        toggle: function() {
            this.state === 'visible' ? this.hide() : this.show();
        },

        addClass: function(klass) {
            if (typeof klass === 'string') { this.$el.addClass(klass); }
        },

        removeClass: function(klass) {
            if (typeof klass === 'string') { this.$el.removeClass(klass); }
        },

        destroy: function() {
            $(window).off('resize.' + this.rid);
            this.$el.hide();
            this.$anchor.removeData('plugin_' + pluginName);
            this.$anchor.off('.' + pluginName);
            this.$el.remove();
        }

    };

    $.fn[pluginName] = function (options, args) {
        if (typeof options === 'string') {
            this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) { return; }
                switch (options) {
                    case 'show':
                        $.data(this, "plugin_" + pluginName)['show']();
                        break;
                    case 'hide':
                        $.data(this, "plugin_" + pluginName)['hide']();
                        break;
                    case 'toggle': 
                        $.data(this, "plugin_" + pluginName)['toggle']();
                        break;
                    case 'addClass':
                        $.data(this, "plugin_" + pluginName)['addClass'](args);
                        break;
                    case 'removeClass':
                        $.data(this, "plugin_" + pluginName)['removeClass'](args);
                        break;
                    case 'destroy':
                        $.data(this, "plugin_" + pluginName)['destroy']();
                        break;
                }
            });
        } else {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Frosty(this, options));
                }
            });
        }
    };
})(jQuery, window, document);