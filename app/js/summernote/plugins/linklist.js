(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    // Extend plugins for adding templates
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'linklist': function (context) {
            var ui = $.summernote.ui;

            var options = {
                label: '<i class="fa fa-globe"></i>',
                tooltip: t('Insert Link'),
            };

            // Assign default values if not supplied


            // add template button
            context.memo('button.linklist', function () {
                // initialize list
                var htmlDropdownLista = '';
                for (var htmlTemplate in pageslist) {
                    htmlDropdownLista += '<li><a href="#" data-text="'+pageslist[htmlTemplate].title+'" data-value="' + pageslist[htmlTemplate].value + '">' + pageslist[htmlTemplate].title + '</a></li>';

                }

                // create button
                var button = ui.buttonGroup([
                    ui.button({
                        className: 'dropdown-toggle',
                        contents: '<span class="template"/> ' + options.label + ' <span class="caret"></span>',
                        tooltip: options.tooltip,
                        data: {
                            toggle: 'dropdown'
                        }
                    }),
                    ui.dropdown({
                        className: 'dropdown-template',
                        items: htmlDropdownLista,
                        click: function (event) {
                            event.preventDefault();

                            var $button = $(event.target);
                            var link = $button.data('value');
                            var node = document.createElement('span');
                            var range = context.invoke('createRange');
                            var clat = range.toString();

                            clat = (clat.trim())?clat:$button.data('text');
                            node.innerHTML = "<a href='"+link+"'>"+clat+"</a>"
                            context.invoke('editor.insertNode', node);
                        }
                    })
                ]);

                // create jQuery object from button instance.
                return button.render();
            });
        }
    });
}));