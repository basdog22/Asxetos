/**
 *
 * copyright 2016 creativeprogramming.it di Stefano Gargiulo
 * email: info@creativeprogramming.it
 * accepting tips at https://www.paypal.me/creativedotit
 * license: MIT
 *
 */
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

    // Extends plugins for adding hello.
    //  - plugin is external module for customizing.
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'addclass': function (context) {
            var self = this;
            if (typeof context.options.addclass === 'undefined') {
                context.options.addclass = {};
            }
            if (typeof context.options.addclass.classTags === 'undefined') {
                context.options.addclass.classTags = ["hidden-print"];
                //  console.log("Please define your summernote.options.addclass.classTags array");
            }
            // ui has renders to build ui elements.
            //  - you can create a button with `ui.button`
            var ui = $.summernote.ui;

            var options = {
                label: '<i class="fa fa-css3"></i>',
                tooltip: t('Insert CSS Class'),
            };

            addStyleString(".scrollable-menu {height: auto; max-height: 200px; max-width:300px; overflow-x: hidden;}");

            context.memo('button.addclass', function () {
                // initialize list

                var htmlDropdownListas = '';
                for (var i in context.options.addclass.classTags) {

                    htmlDropdownListas += '<li><a href="#" class="' + context.options.addclass.classTags[i] + '" data-value="' + context.options.addclass.classTags[i] + '">' + context.options.addclass.classTags[i] + '</a></li>';

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
                        items: htmlDropdownListas,
                        click: function (event) {
                            event.preventDefault();

                            var $button = $(event.target);
                            var cla = $button.data('value');


                            var range = context.invoke('createRange');
                            var clat = range.toString();
                            var node = document.createElement('span');
                            node.innerHTML = clat;
                            node.className += cla;



                            context.invoke('editor.insertNode', node);
                        }
                    })
                ]);

                // create jQuery object from button instance.
                return button.render();
            });

            function addStyleString(str) {
                var node = document.createElement('style');
                node.innerHTML = str;
                document.body.appendChild(node);
            }

            // This events will be attached when editor is initialized.
            this.events = {
                // This will be called after modules are initialized.
                'summernote.init': function (we, e) {
                    //console.log('summernote initialized', we, e);
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup': function (we, e) {
                    //  console.log('summernote keyup', we, e);
                }
            };

            // This method will be called when editor is initialized by $('..').summernote();
            // You can create elements for plugin
            this.initialize = function () {

            };

            // This methods will be called when editor is destroyed by $('..').summernote('destroy');
            // You should remove elements on `initialize`.
            this.destroy = function () {
                /*  this.$panel.remove();
                 this.$panel = null; */
            };
        }
    });
}));
