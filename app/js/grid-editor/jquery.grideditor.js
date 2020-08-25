/**
 * Frontwise grid editor plugin.
 */
(function ($) {

    $.fn.gridEditor = function (options) {

        var self = this;
        var grideditor = self.data('grideditor');

        /** Methods **/

        if (arguments[0] == 'getHtml') {
            if (grideditor) {
                grideditor.deinit();
                var html = self.html();
                grideditor.init();
                return html.replace('contenteditable', "asxetos-editable");
            } else {
                return self.html();
            }
        }

        /** Initialize plugin */

        self.each(function (baseIndex, baseElem) {
            baseElem = $(baseElem);

            var settings = $.extend({
                'new_row_layouts': [ // Column layouts for add row buttons
                    [12],
                    [6, 6],
                    [4, 4, 4],
                    [3, 3, 3, 3],
                    [2, 2, 2, 2, 2, 2],
                    [2, 8, 2],
                    [4, 8],
                    [8, 4]
                ],
                'row_classes': [{label: 'Row class', cssClass: 'row'}, {label: 'Clear fix', cssClass: 'clearfix'}],
                'col_classes': [{label: 'Clear fix', cssClass: 'clearfix'}],
                'col_tools': [
                    {
                        title: t('Logo'),
                        iconClass: 'fa-file-image-o',
                        on: {
                            click: function () {

                                if ($(this).parent().next().next().hasClass("note-editor")) {
                                    //note-editing-area
                                    var col = $(this).parent().next().next().find(".note-editable");
                                } else {
                                    var col = $(this).parent().next();
                                }
                                col.append("<div class='asxetos_block' contenteditable='false'>[ASXETOS_LOGO]<i class='close fa fa-times'></i></div>");
                            },
                        }
                    },
                    {
                        title: t('RSS'),
                        iconClass: 'fa-rss',
                        on: {
                            click: function () {
                                var eleme = $(this);
                                if ($(this).parent().next().next().hasClass("note-editor")) {
                                    //note-editing-area
                                    var col = $(this).parent().next().next().find(".note-editable");
                                } else {
                                    var col = $(this).parent().next();
                                }
                                swal({
                                    title: t("RSS URL"),
                                    text: "",
                                    type: "input",
                                    showCancelButton: true,
                                    confirmButtonText: t("Save"),
                                    cancelButtonText: t("Close"),
                                    closeOnConfirm: false,
                                    inputPlaceholder: t("Please paste an RSS URL")
                                }, function (inputValue) {
                                    if (inputValue === false) {
                                        return false;
                                    }
                                    if (inputValue === "") {
                                        swal.showInputError(t("You need to write something!"));
                                        return false
                                    }

                                    if (eleme.parent().next().next().hasClass("note-editor")) {
                                        //note-editing-area
                                        var col = eleme.parent().next().next().find(".note-editable");
                                    } else {
                                        var col = eleme.parent().next();
                                    }

                                    col.append("<div class='asxetos_block'>[[ASXETOS_RSS=" + inputValue + "]]<i class='close fa fa-times'></i></div>");
                                    swal(t("RSS Added"), t("Congrats! Now save your page!"), 'success');
                                });


                            },
                        }
                    },
                    {
                        title: t('Slider'),
                        iconClass: 'fa-picture-o',
                        on: {
                            click: function () {
                                var eleme = $(this);
                                if ($(this).parent().next().next().hasClass("note-editor")) {
                                    //note-editing-area
                                    var col = $(this).parent().next().next().find(".note-editable");
                                } else {
                                    var col = $(this).parent().next();
                                }
                                swal({
                                    title: t("Slider"),
                                    text: "",
                                    type: "input",
                                    showCancelButton: true,
                                    confirmButtonText: t("Save"),
                                    cancelButtonText: t("Close"),
                                    closeOnConfirm: false,
                                    inputPlaceholder: t("Please paste images separated by comma")
                                }, function (inputValue) {
                                    if (inputValue === false) {
                                        return false;
                                    }
                                    if (inputValue === "") {
                                        swal.showInputError(t("You need to write something!"));
                                        return false
                                    }

                                    if (eleme.parent().next().next().hasClass("note-editor")) {
                                        //note-editing-area
                                        var col = eleme.parent().next().next().find(".note-editable");
                                    } else {
                                        var col = eleme.parent().next();
                                    }

                                    col.append("<div class='asxetos_block'>[[ASXETOS_SLIDER=" + inputValue + "]]<i class='close fa fa-times'></i></div>");
                                    swal(t("Slider Added"), t("Congrats! Now save your page!"), 'success');
                                });


                            },
                        }
                    },
                    {
                        title: t('Contact Form'),
                        iconClass: 'fa-envelope-o',
                        on: {
                            click: function () {

                                if ($(this).parent().next().next().hasClass("note-editor")) {
                                    //note-editing-area
                                    var col = $(this).parent().next().next().find(".note-editable");
                                } else {
                                    var col = $(this).parent().next();
                                }
                                col.append("<div class='asxetos_block'>[ASXETOS_CONTACT_FORM]<i class='close fa fa-times'></i></div>");
                            },
                        }
                    },
                    {
                        title: t('Youtube Video'),
                        iconClass: 'fa-youtube',
                        on: {
                            click: function () {
                                var eleme = $(this);
                                swal({
                                    title: t("YouTube URL"),
                                    text: "",
                                    type: "input",
                                    showCancelButton: true,
                                    closeOnConfirm: false,
                                    confirmButtonText: t("Save"),
                                    cancelButtonText: t("Close"),
                                    inputPlaceholder: t("Please paste a Youtube video URL")
                                }, function (inputValue) {
                                    if (inputValue === false) {
                                        return false;
                                    }
                                    if (inputValue === "") {
                                        swal.showInputError(t("You need to write something!"));
                                        return false
                                    }

                                    var pieces = inputValue.split("v=");
                                    var videoId = pieces[pieces.length - 1];
                                    if (eleme.parent().next().next().hasClass("note-editor")) {
                                        //note-editing-area
                                        var col = eleme.parent().next().next().find(".note-editable");
                                    } else {
                                        var col = eleme.parent().next();
                                    }

                                    col.append('<div class="videoWrapper"><iframe width="100%" height="480" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" gesture="media" allowfullscreen></iframe></div>');
                                    swal(t("Video added"), t("Congrats! Now save your page!"), 'success');
                                });

                            },
                        }
                    },
                    {
                        title: t('Recent Blog Posts'),
                        iconClass: 'fa-list',
                        on: {
                            click: function () {

                                if ($(this).parent().next().next().hasClass("note-editor")) {
                                    //note-editing-area
                                    var col = $(this).parent().next().next().find(".note-editable");
                                } else {
                                    var col = $(this).parent().next();
                                }
                                col.append("<div class='asxetos_block'>[ASXETOS_RECENT_BLOG]<i class='close fa fa-times'></i></div>");
                            },
                        }
                    },
                    {
                        title: t('Menu'),
                        iconClass: 'fa-bars',
                        on: {
                            click: function () {

                                if ($(this).parent().next().next().hasClass("note-editor")) {
                                    //note-editing-area
                                    var col = $(this).parent().next().next().find(".note-editable");
                                } else {
                                    var col = $(this).parent().next();
                                }
                                col.append("<div class='asxetos_block'>[ASXETOS_MENU]<i class='close fa fa-times'></i></div>");
                            },
                        }
                    },{
                        title: t('Create Template'),
                        iconClass: 'fa-file-o',
                        on: {
                            click: function () {
                                var eleme = $(this);
                                if ($(this).parent().next().next().hasClass("note-editor")) {
                                    //note-editing-area
                                    var col = $(this).parent().next().next().find(".note-editable");
                                } else {
                                    var col = $(this).parent().next();
                                }
                                swal({
                                    title: t("Create Template"),
                                    text: "",
                                    type: "input",
                                    showCancelButton: true,
                                    confirmButtonText: t("Save"),
                                    cancelButtonText: t("Close"),
                                    closeOnConfirm: false,
                                    inputPlaceholder: t("Please specify the template name")
                                }, function (inputValue) {
                                    if (inputValue === false) {
                                        return false;
                                    }
                                    if (inputValue === "") {
                                        swal.showInputError(t("You need to write something!"));
                                        return false
                                    }

                                    if (eleme.parent().next().next().hasClass("note-editor")) {
                                        //note-editing-area
                                        var col = eleme.parent().next().next().find(".note-editable");
                                    } else {
                                        var col = eleme.parent().next();
                                    }

                                    $.post(settings.remote_url, {
                                        template_name: inputValue,
                                        tpl_content: col.html(),
                                        ajaxaction: "savetpl"
                                    }, function (result) {
                                        swal(result.title, result.message, result.type);
                                    }, 'json');

                                });


                            },
                        }
                    },
                ],
                'row_tools': [],
                'custom_filter': '',
                'content_types': ['summernote'],
                'valid_col_sizes': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                'source_textarea': '',
                'remote_url': '',
                'current_page': ''
            }, options);


            // Elems
            var canvas,
                mainControls,
                addRowGroup,
                htmlTextArea
            ;
            var colClasses = ['col-md-', 'col-sm-', 'col-xs-'];
            var curColClassIndex = 0; // Index of the column class we are manipulating currently
            var MAX_COL_SIZE = 12;

            // Copy html to sourceElement if a source textarea is given
            if (settings.source_textarea) {
                var sourceEl = $(settings.source_textarea);

                sourceEl.addClass('ge-html-output');
                htmlTextArea = sourceEl;

                if (sourceEl.val()) {
                    baseElem.html(sourceEl.val());
                }
            }

            // Wrap content if it is non-bootstrap
            if (baseElem.children().length && !baseElem.find('div.row').length) {
                var children = baseElem.children();
                var newRow = $('<div class="row"><div class="col-md-12"/></div>').appendTo(baseElem);
                newRow.find('.col-md-12').append(children);
            }

            setup();
            init();

            function setup() {
                /* Setup canvas */
                canvas = baseElem.addClass('ge-canvas');

                if (typeof htmlTextArea === 'undefined' || !htmlTextArea.length) {
                    htmlTextArea = $('<textarea class="ge-html-output"/>').insertBefore(canvas);
                }

                /* Create main controls*/
                mainControls = $('<div class="ge-mainControls" />').insertBefore(htmlTextArea);
                var wrapper = $('<div class="ge-wrapper ge-top" />').appendTo(mainControls);


                if(ASXETOS.page_type==0){
                    var newPageBtn = $("<a class='pull-left btn btn-primary btn-xs' id='asxetos-page-new'><i class='fa fa-plus'></i> " + t("Add new page") + "</a>").appendTo(wrapper);
                }else{
                    var newBlogBtn = $("<a class='pull-left btn btn-info btn-xs' id='asxetos-blog-new'><i class='fa fa-plus'></i> " + t("Add new post") + "</a>").appendTo(wrapper);
                }

                // Add row

                addRowGroup = $('<div class="ge-addRowGroup btn-group" />').appendTo(wrapper);
                // Buttons on right


                var layoutDropdown = $('<div class="dropdown pull-left ge-layout-mode">' +
                    '<button type="button" class="btn btn-xs btn-info dropdown-toggle" data-toggle="dropdown"><span>' + t('Desktop') + ' <i class="fa fa-caret-down"></i></span></button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                    '<li><a data-width="auto" title="Desktop"><span>' + t('Desktop') + '</span></a></li>' +
                    '<li><a title="Tablet"><span>' + t('Tablet') + '</span></li>' +
                    '<li><a title="Phone"><span>' + t('Phone') + '</span></a></li>' +
                    '</ul>' +
                    '</div>')
                    .on('click', 'a', function () {
                        var a = $(this);
                        switchLayout(a.closest('li').index());
                        var btn = layoutDropdown.find('button');
                        btn.find('span').remove();
                        btn.append(a.find('span').clone());
                    })
                    .appendTo(wrapper)
                ;

                if(ASXETOS.page_type==0) {
                    var newRowDropdn = $('<div class="dropdown pull-left ge-layout-mode">' +
                        '<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown"><span><i class="fa fa-plus"></i> ' + t('New Row') + '</span></button>' +
                        '<ul class="dropdown-menu" role="menu">' +

                        '</ul>' +
                        '</div>')
                        .appendTo(addRowGroup);


                    $.each(settings.new_row_layouts, function (j, layout) {
                        var btn = $('<a class="btn btn-xs btn-primary" />')
                            .attr('title', t('Add row') + ' ' + layout.join('-'))
                            .on('click', function () {
                                var row = createRow().appendTo(canvas);
                                layout.forEach(function (i) {
                                    createColumn(i).appendTo(row);
                                });
                                init();
                            })

                            .appendTo(newRowDropdn.find("ul"))
                        ;


                        btn.wrap('<li></li>');
                        // btn.append('<span class="glyphicon glyphicon-plus-sign"/>');

                        var layoutName = layout.join(' - ');
                        var icon = '<div class="row ge-row-icon">';
                        layout.forEach(function (i) {
                            icon += '<div class="column col-xs-' + i + '"/>';
                        });
                        icon += '</div>&nbsp;&nbsp;&nbsp;' + layout.join(' - ');
                        btn.append(icon);
                    });



                }
                var btnGroupNew = $('<div class="btn-group pull-right"/>').appendTo(wrapper);
                $('<div class="pull-right">&nbsp;|&nbsp;</div>').appendTo(wrapper)

                var btnGroup = $('<div class="btn-group pull-right"/>').appendTo(wrapper);

                if(ASXETOS.page_type!=1){
                    var htmlButton = $('<button title="' + t('Edit Source Code') + '" type="button" class="btn btn-xs btn-warning gm-edit-mode"><i class="glyphicon glyphicon-chevron-left"></i><i class="glyphicon glyphicon-chevron-right"></i> ' + t('Edit Source Code') + '</button>')
                        .on('click', function () {
                            if (htmlButton.hasClass('active')) {
                                canvas.empty().html(htmlTextArea.val()).show();
                                init();
                                htmlTextArea.hide();
                            } else {
                                deinit();
                                htmlTextArea
                                    .height(0.8 * $(window).height())
                                    .val(canvas.html())
                                    .show()
                                ;
                                canvas.hide();
                            }

                            htmlButton.toggleClass('active btn-danger');
                        })
                        .appendTo(btnGroup)
                    ;
                }

                var previewButton = $('<button title="' + t('Preview') + '" type="button" class="btn btn-xs btn-primary gm-preview"><i class="glyphicon glyphicon-eye-open"></i> ' + t('Preview') + '</button>')
                    .on('click', function () {
                        previewButton.toggleClass('active btn-danger').trigger('mouseleave');
                        if (!previewButton.hasClass('active')) {
                            canvas.addClass('ge-editing');
                        } else {
                            canvas.removeClass('ge-editing');
                        }
                    })
                    .appendTo(btnGroup)
                ;

                var newRowDropdna = $('<div class="dropdown pull-left ge-layout-mode">' +
                    '<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown"><span><i class="fa fa-file-picture-o"></i> ' + t('Load Preset') + ' <i class="fa fa-caret-down"></i></span></button>' +
                    '<ul class="dropdown-menu" role="menu">' +

                    '</ul>' +
                    '</div>')
                    .appendTo(btnGroupNew);

                for(i in asxetos_presets){
                    $("<a data-preset='"+asxetos_presets[i].slug+"' ><span>"+asxetos_presets[i].mtitle+"</span></a>").on('click', function () {
                        var biton = $(this);
                        swal({
                                title: t('Load Preset?'),
                                text: t("All your unsaved changes will be lost"),
                                type: "warning",
                                showCancelButton: true,
                                cancelButtonText: t("Close"),
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: t("Yes, load it!"),
                                closeOnConfirm: true
                            },
                            function () {
                                $.post(ASXETOS.asxetos_url+"/",{
                                    ajaxaction: 'loadpreset',
                                    page_slug:  biton.data('preset')
                                },function (res) {
                                    deinit();
                                    $("#asxetos_canvas").html(res.content);
                                    $("#asxetos_textarea").val(res.content);
                                    init();
                                },'JSON');

                            });
                    }).wrap('<li></li>').parent().appendTo(newRowDropdna.find("ul"));
                }

                var saveButton = $('<button title="' + t('Save') + '" type="button" class="btn btn-xs btn-success gm-save"><i class="fa fa-save"></i> ' + t('Save') + '</button>')
                    .on('click', function () {
                        swal({
                            title: t("Page title"),
                            text: t("Current Title:") + " " + $("#app title").html(),
                            type: "input",
                            showCancelButton: true,
                            confirmButtonText: t("Save"),
                            cancelButtonText: t("Close"),
                            closeOnConfirm: false,
                            inputPlaceholder: ($("#app title").html() == '') ? t("Please specify a page title") : t("Leave blank to use the same title")
                        }, function (inputValue) {
                            if (inputValue === false) {
                                return false;
                            }
                            if (inputValue === "" && $("#app title").html() == '') {
                                swal.showInputError(t("You need to write something!"));
                                return false
                            }

                            $.post(settings.remote_url, {
                                page_title: inputValue,
                                page_content: $('#asxetos_canvas').gridEditor('getHtml'),
                                page_slug: settings.current_page
                            }, function (result) {
                                swal(result.title, result.message, result.type);
                            }, 'json');
                        });
                    })
                    .appendTo(btnGroupNew)
                ;


                // Make controls fixed on scroll
                var $window = $(window);
                $window.on('scroll', function (e) {
                    if (
                        $window.scrollTop() > mainControls.offset().top &&
                        $window.scrollTop() < canvas.offset().top + canvas.height()
                    ) {
                        if (wrapper.hasClass('ge-top')) {
                            wrapper
                                .css({
                                    left: wrapper.offset().left,
                                    width: wrapper.outerWidth(),
                                })
                                .removeClass('ge-top')
                                .addClass('ge-fixed')
                            ;
                        }
                    } else {
                        if (wrapper.hasClass('ge-fixed')) {
                            wrapper
                                .css({left: '', width: ''})
                                .removeClass('ge-fixed')
                                .addClass('ge-top')
                            ;
                        }
                    }
                });

                /* Init RTE on click */
                canvas.on('click', '.ge-content', function (e) {
                    var rte = getRTE($(this).data('ge-content-type'));
                    if (rte) {
                        rte.init(settings, $(this));
                    }
                });
            }

            function reset() {
                deinit();
                init();
            }

            function init() {
                runFilter(true);
                canvas.addClass('ge-editing');

                canvas.find("#admin_blog_list_placeholder").wrap("<div id='admin_blog_list'></div>").parent().html($("#hidden_blog_list").html());
                $("#hidden_blog_list").remove();
                addAllColClasses();
                wrapContent();
                createRowControls();
                createColControls();
                makeSortable();
                switchLayout(curColClassIndex);
                repaintTools();
            }

            function repaintTools() {
                var endit = setTimeout(function () {
                    $(".ge-tools-drawer").each(function () {
                        if ($(this).parent().outerWidth(true) > 384) {
                            $(this).find(".separator").show();
                            $(this).find("> a").removeClass('asxetos-small-tool');
                        } else {
                            $(this).find(".separator").hide();
                            $(this).find("> a").addClass('asxetos-small-tool');
                        }
                    });
                }, 200);
            }

            function deinit() {
                canvas.removeClass('ge-editing');
                var contents = canvas.find('.ge-content').each(function () {
                    var content = $(this);
                    getRTE(content.data('ge-content-type')).deinit(settings, content);
                });
                canvas.find('.ge-tools-drawer').remove();
                canvas.find('.note-dropzone,.note-handle,.modal').remove();
                $("<div hidden class='hidden' id='hidden_blog_list'></div>").html(canvas.find("#admin_blog_list").html()).appendTo('body');
                canvas.find("#admin_blog_list").wrap("<div id='admin_blog_list_placeholder'></div>").parent().html('[BLOG_LIST]');
                removeSortable();
                runFilter();
            }

            function createRowControls() {
                canvas.find('.row').each(function () {
                    var row = $(this);
                    if (row.find('> .ge-tools-drawer').length) {
                        return;
                    }


                    var drawer = $('<div class="ge-tools-drawer" />').prependTo(row);
                    createTool(drawer, t('Move'), 'ge-move', 'fa-arrows');
                    $("<span class='separator'>|</span>").appendTo(drawer);
                    createTool(drawer, t('Settings'), '', 'fa-cog', function () {
                        details.toggle();
                    });
                    if(ASXETOS.page_type!=1) {


                        createTool(drawer, t('Remove row'), '', 'fa-trash', function () {
                            swal({
                                    title: t('Delete row?'),
                                    text: t("The row will not be removed until you save the page"),
                                    type: "warning",
                                    showCancelButton: true,
                                    cancelButtonText: t("Close"),
                                    confirmButtonClass: "btn-danger",
                                    confirmButtonText: t("Yes, delete it!"),
                                    closeOnConfirm: true
                                },
                                function () {
                                    row.slideUp(function () {
                                        row.remove();
                                    });
                                });


                        });

                    }
                    $("<span class='separator'>|</span>").appendTo(drawer)
                    createTool(drawer, t('Add column'), 'ge-add-column', 'fa-plus', function () {
                        row.append(createColumn(3));
                        init();
                    });
                    settings.row_tools.forEach(function (t) {
                        createTool(drawer, t.title || '', t.className + " pull-right" || '', t.iconClass || 'fa-wrench', t.on);
                    });

                    var details = createDetails(row, settings.row_classes).appendTo(drawer);
                });
            }

            function createColControls() {
                canvas.find('.column').each(function () {
                    var col = $(this);
                    if (col.find('> .ge-tools-drawer').length) {
                        return;
                    }

                    var drawer = $('<div class="ge-tools-drawer" />').prependTo(col);

                    createTool(drawer, t('Move'), 'ge-move', 'fa-arrows');
                    $("<span class='separator'>|</span>").appendTo(drawer);
                    createTool(drawer, t('Make column narrower'), 'ge-decrease-col-width', 'fa-compress', function (e) {
                        var colSizes = settings.valid_col_sizes;
                        var curColClass = colClasses[curColClassIndex];
                        var curColSizeIndex = colSizes.indexOf(getColSize(col, curColClass));
                        var newSize = colSizes[clamp(curColSizeIndex - 1, 0, colSizes.length - 1)];
                        if (e.shiftKey) {
                            newSize = colSizes[0];
                        }
                        setColSize(col, curColClass, Math.max(newSize, 1));
                    });

                    createTool(drawer, t('Make column wider'), 'ge-increase-col-width', 'fa-expand', function (e) {
                        var colSizes = settings.valid_col_sizes;
                        var curColClass = colClasses[curColClassIndex];
                        var curColSizeIndex = colSizes.indexOf(getColSize(col, curColClass));
                        var newColSizeIndex = clamp(curColSizeIndex + 1, 0, colSizes.length - 1);
                        var newSize = colSizes[newColSizeIndex];
                        if (e.shiftKey) {
                            newSize = colSizes[colSizes.length - 1];
                        }
                        setColSize(col, curColClass, Math.min(newSize, MAX_COL_SIZE));
                    });
                    $("<span class='separator'>|</span>").appendTo(drawer);



                    if(ASXETOS.page_type!=1){
                        createTool(drawer, t('Settings'), '', 'fa-cog', function () {
                        details.toggle();
                    });
                        createTool(drawer, t('Remove col'), '', 'fa-trash', function () {

                            swal({
                                    title: t('Delete column?'),
                                    text: t("The column will not be removed until you save the page"),
                                    type: "warning",
                                    showCancelButton: true,
                                    cancelButtonText: t("Close"),
                                    confirmButtonClass: "btn-danger",
                                    confirmButtonText: t("Yes, delete it!"),
                                    closeOnConfirm: true
                                },
                                function () {
                                    col.animate({
                                        opacity: 'hide',
                                        width: 'hide',
                                        height: 'hide'
                                    }, 400, function () {
                                        col.remove();
                                    });
                                });
                        });
                        $("<span class='separator'>|</span>").appendTo(drawer);
                        createTool(drawer, t('Add row'), 'ge-add-row', 'fa-plus', function () {
                            var row = createRow();
                            col.append(row);
                            row.append(createColumn(12));

                            init();
                        });
                    }





                    settings.col_tools.forEach(function (t) {
                        createTool(drawer, t.title || '', t.className + " pull-right" || '', t.iconClass || 'fa-wrench', t.on);
                    });

                    var details = createDetails(col, settings.col_classes).appendTo(drawer);
                });
            }

            function createTool(drawer, title, className, iconClass, eventHandlers) {
                var tool = $('<a title="' + title + '" class="' + className + '"><span class="fa ' + iconClass + '"></span></a>')
                    .appendTo(drawer)
                ;
                if (typeof eventHandlers == 'function') {
                    tool.on('click', eventHandlers);
                }
                if (typeof eventHandlers == 'object') {
                    $.each(eventHandlers, function (name, func) {
                        tool.on(name, func);
                    });
                }
            }

            function createDetails(container, cssClasses) {
                var detailsDiv = $('<div class="ge-details" />');

                $('<input class="ge-id" />')
                    .attr('placeholder', 'id')
                    .val(container.attr('id'))
                    .attr('title', t('Set a unique identifier'))
                    .appendTo(detailsDiv)
                    .change(function () {
                        container.attr('id', this.value);
                    })
                ;

                var classGroup = $('<div class="btn-group" />').appendTo(detailsDiv);
                cssClasses.forEach(function (rowClass) {
                    var btn = $('<a class="btn btn-xs btn-default" />')
                        .html(rowClass.label)
                        .attr('title', rowClass.title ? rowClass.title : 'Toggle "' + rowClass.label + '" styling')
                        .toggleClass('active btn-primary', container.hasClass(rowClass.cssClass))
                        .on('click', function () {
                            btn.toggleClass('active btn-primary');
                            container.toggleClass(rowClass.cssClass, btn.hasClass('active'));
                        })
                        .appendTo(classGroup)
                    ;
                });

                return detailsDiv;
            }

            function addAllColClasses() {
                canvas.find('.column, div[class*="col-"]').each(function () {
                    var col = $(this);

                    var size = 2;
                    var sizes = getColSizes(col);
                    if (sizes.length) {
                        size = sizes[0].size;
                    }

                    var elemClass = col.attr('class');
                    colClasses.forEach(function (colClass) {
                        if (elemClass.indexOf(colClass) == -1) {
                            col.addClass(colClass + size);
                        }
                    });

                    col.addClass('column');
                });
            }

            /**
             * Return the column size for colClass, or a size from a different
             * class if it was not found.
             * Returns null if no size whatsoever was found.
             */
            function getColSize(col, colClass) {
                var sizes = getColSizes(col);
                for (var i = 0; i < sizes.length; i++) {
                    if (sizes[i].colClass == colClass) {
                        return sizes[i].size;
                    }
                }
                if (sizes.length) {
                    return sizes[0].size;
                }
                return null;
            }

            function getColSizes(col) {
                var result = [];
                colClasses.forEach(function (colClass) {
                    var re = new RegExp(colClass + '(\\d+)', 'i');
                    if (re.test(col.attr('class'))) {
                        result.push({
                            colClass: colClass,
                            size: parseInt(re.exec(col.attr('class'))[1])
                        });
                    }
                });
                return result;
            }

            function setColSize(col, colClass, size) {
                var re = new RegExp('(' + colClass + '(\\d+))', 'i');
                var reResult = re.exec(col.attr('class'));
                if (reResult && parseInt(reResult[2]) !== size) {
                    col.switchClass(reResult[1], colClass + size, 50);
                } else {
                    col.addClass(colClass + size);
                }
                repaintTools();
            }

            function makeSortable() {
                canvas.find('.row').sortable({
                    items: '> .column',
                    connectWith: '.ge-canvas .row',
                    handle: '> .ge-tools-drawer .ge-move',
                    start: sortStart,
                    helper: 'clone',
                });
                canvas.add(canvas.find('.column')).sortable({
                    items: '> .row, > .ge-content',
                    connectsWith: '.ge-canvas, .ge-canvas .column',
                    handle: '> .ge-tools-drawer .ge-move',
                    start: sortStart,
                    helper: 'clone',
                });

                function sortStart(e, ui) {
                    ui.placeholder.css({height: ui.item.outerHeight()});
                }
            }

            function removeSortable() {
                canvas.add(canvas.find('.column')).add(canvas.find('.row')).sortable('destroy');
            }

            function createRow() {
                return $('<div class="row" />');
            }

            function createColumn(size) {
                return $('<div/>')
                    .addClass(colClasses.map(function (c) {
                        return c + size;
                    }).join(' '))
                    .append(createDefaultContentWrapper().html(
                        getRTE(settings.content_types[0]).initialContent)
                    )
                    ;

            }

            /**
             * Run custom content filter on init and deinit
             */
            function runFilter(isInit) {
                if (settings.custom_filter.length) {
                    $.each(settings.custom_filter, function (key, func) {
                        if (typeof func == 'string') {
                            func = window[func];
                        }

                        func(canvas, isInit);
                    });
                }
            }

            /**
             * Wrap column content in <div class="ge-content"> where neccesary
             */
            function wrapContent() {
                canvas.find('.column').each(function () {
                    var col = $(this);
                    var contents = $();
                    col.children().each(function () {
                        var child = $(this);
                        if (child.is('.row, .ge-tools-drawer, .ge-content')) {
                            doWrap(contents);
                        } else {
                            contents = contents.add(child);
                        }
                    });
                    doWrap(contents);
                });
            }

            function doWrap(contents) {
                if (contents.length) {
                    var container = createDefaultContentWrapper().insertAfter(contents.last());
                    contents.appendTo(container);
                    contents = $();
                }
            }

            function createDefaultContentWrapper() {
                return $('<div/>')
                    .addClass('ge-content ge-content-type-' + settings.content_types[0])
                    .attr('data-ge-content-type', settings.content_types[0])
                    ;
            }

            function switchLayout(colClassIndex) {
                curColClassIndex = colClassIndex;

                var layoutClasses = ['ge-layout-desktop', 'ge-layout-tablet', 'ge-layout-phone'];
                layoutClasses.forEach(function (cssClass, i) {
                    canvas.toggleClass(cssClass, i == colClassIndex);
                });
            }

            function getRTE(type) {
                return $.fn.gridEditor.RTEs[type];
            }

            function clamp(input, min, max) {
                return Math.min(max, Math.max(min, input));
            }

            baseElem.data('grideditor', {
                init: init,
                deinit: deinit,
            });

        });

        return self;

    };

    $.fn.gridEditor.RTEs = {};

})(jQuery);
(function () {
    $.fn.gridEditor.RTEs.ckeditor = {

        init: function (settings, contentAreas) {

            if (!window.CKEDITOR) {
                console.error(
                    'CKEditor not available! Make sure you loaded the ckeditor and jquery adapter js files.'
                );
            }

            var self = this;
            contentAreas.each(function () {
                var contentArea = $(this);
                if (!contentArea.hasClass('active')) {
                    if (contentArea.html() == self.initialContent) {
                        // CKEditor kills this '&nbsp' creating a non usable box :/ 
                        contentArea.html('&nbsp;');
                    }

                    // Add the .attr('contenteditable',''true') or CKEditor loads readonly
                    contentArea.addClass('active').attr('contenteditable', 'true');
                    CKEDITOR.plugins.addExternal( 'stylesheetparser', ASXETOS.asxetos_url+'/app/js/ckeditor/plugins/', 'cssparser.js' );
                    CKEDITOR.plugins.addExternal( 'internpage', ASXETOS.asxetos_url+'/app/js/ckeditor/plugins/', 'linklist.js' );
                    var configuration = $.extend(
                        {},
                        (settings.ckeditor && settings.ckeditor.config ? settings.ckeditor.config : {}),
                        {

                            toolbar: [
                                {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline']},
                                {name: 'paragraph', items: ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','NumberedList','BulletedList','Outdent','Indent']},
                                {name: 'colors', items: ['TextColor','BGColor']},
                                {name: 'tables', items: ['Table']},
                                {name: 'document', items: ['Source','Templates']},
                                {name: 'links', items: ['Link']},
                                {name: 'media', items: ['Image','Flash']},
                                {name: 'controls', items: ['Undo','Redo']},
                                {name: 'style', items: ['Styles']},
                                {name: 'specials', items: ['SpecialChar']},

                            ],
                            extraPlugins: 'stylesheetparser,internpage',
                            contentsCss: [ ASXETOS.asxetos_url + "/theme/theme.css" ],
                            templates_files : [CKEDITOR.getUrl(ASXETOS.asxetos_url + "/app/logic/rte.php?mode=get_cktemplates")],
                            stylesSet: [],
                            on:
                                {
                                    instanceReady: function (evt) {
                                        // Call original instanceReady function, if one was passed in the config
                                        var callback;
                                        try {
                                            callback = settings.ckeditor.config.on.instanceReady;
                                        } catch (err) {
                                            // No callback passed
                                        }
                                        if (callback) {
                                            callback.call(this, evt);
                                        }

                                        instance.focus();
                                    }
                                }
                        }
                        )
                    ;

                    var instance = CKEDITOR.inline(contentArea.get(0), configuration);
                }
            });
        },

        deinit: function (settings, contentAreas) {
            contentAreas.filter('.active').each(function () {
                var contentArea = $(this);

                // Destroy all CKEditor instances
                $.each(CKEDITOR.instances, function (_, instance) {
                    instance.destroy();
                });

                // Cleanup
                contentArea
                    .removeClass('active cke_focus')
                    .removeAttr('id')
                    .removeAttr('style')
                    .removeAttr('spellcheck')
                    .removeAttr('contenteditable')
                ;
            });
        },

        initialContent: '<p>' + t('Click here and start editing') + '</p>',
    };
})();
(function () {

    $.fn.gridEditor.RTEs.summernote = {

        init: function (settings, contentAreas) {

            if (!jQuery().summernote) {
                console.error('Summernote not available! Make sure you loaded the Summernote js file.');
            }

            var self = this;
            contentAreas.each(function () {
                var contentArea = $(this);
                if (!contentArea.hasClass('active')) {
                    if (contentArea.html() == self.initialContent) {
                        contentArea.html('');
                    }
                    contentArea.addClass('active');

                    var configuration = $.extend(
                        true, // deep copy
                        {},
                        (settings.summernote && settings.summernote.config ? settings.summernote.config : {shortcuts: false}),
                        {
                            tabsize: 2,
                            airMode: true,

                            template: {
                                path: ASXETOS.asxetos_url+'/theme/templates/', // path to your template folder
                                list: summer_tpls
                            },
                            addclass: {
                                debug: false,
                                classTags: summer_css_classes
                            },


                            popover: {
                                image: [
                                    ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                                    ['remove', ['removeMedia']]
                                ],
                                link: [
                                    ['link', ['linkDialogShow', 'unlink']]
                                ],
                                air: [
                                    ['style', ['bold', 'italic', 'underline']],
                                    ['paragraph', ['ul', 'ol', 'paragraph']],
                                    ['colors', ['color']],
                                    ['tables', ['table']],
                                    ['tpls', ['template']],
                                    ['links', ['link']],
                                    ['linklist', ['linklist']],
                                    ['media', ['picture','video']],
                                    ['control', ['undo','redo']],
                                    ['styles', ['style']],
                                    ['classes', ['addclass']],
                                ]
                            },



                            // Focus editor on creation
                            callbacks: {
                                onInit: function () {

                                    // Call original oninit function, if one was passed in the config
                                    var callback;
                                    try {
                                        callback = settings.summernote.config.callbacks.onInit;
                                    } catch (err) {
                                        // No callback passed
                                    }
                                    if (callback) {
                                        callback.call(this);
                                    }

                                    contentArea.summernote('focus');
                                }
                            }
                        }
                    );
                    contentArea.summernote(configuration);
                }
            });
        },

        deinit: function (settings, contentAreas) {
            contentAreas.filter('.active').each(function () {
                var contentArea = $(this);
                contentArea.summernote('disable');
                contentArea.summernote('destroy');
                contentArea
                    .removeClass('active')
                    .removeAttr('id')
                    .removeAttr('style')
                    .removeAttr('spellcheck')
                ;
            });

        },

        initialContent: '<p>' + t('Click here and start editing') + '</p>',
    };
})();

(function () {
    $.fn.gridEditor.RTEs.tinymce = {
        init: function (settings, contentAreas) {
            if (!window.tinymce) {
                console.error('tinyMCE not available! Make sure you loaded the tinyMCE js file.');
            }
            if (!contentAreas.tinymce) {
                console.error('tinyMCE jquery integration not available! Make sure you loaded the jquery integration plugin.');
            }
            var self = this;
            contentAreas.each(function () {
                var contentArea = $(this);
                if (!contentArea.hasClass('active')) {
                    if (contentArea.html() == self.initialContent) {
                        contentArea.html('');
                    }
                    contentArea.addClass('active');
                    var configuration = $.extend(
                        {},
                        (settings.tinymce && settings.tinymce.config ? settings.tinymce.config : {}),
                        {
                            inline: true,
                            toolbar: 'bold italic alignleft aligncenter alignright bullist numlist outdent indent forecolor backcolor table template link image media undo redo styleselect code charmap ',
                            plugins: 'code image imagetools autolink charmap importcss link media table template textcolor wordcount',
                            imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
                            menubar: false,
                            media_live_embeds: true,
                            link_context_toolbar: true,
                            link_list: ASXETOS.pageslist,
                            rel_list: [
                                {title: 'Normal', value: ''},
                                {title: 'No follow', value: 'nofollow'},
                                {title: 'Publisher', value: 'publisher'}
                            ],
                            templates: ASXETOS.asxetos_url + "/app/logic/rte.php?mode=get_templates",
                            content_css: ASXETOS.asxetos_url + "/theme/theme.css",
                            oninit: function (editor) {
                                // Bring focus to text field
                                $('#' + editor.settings.id).focus();

                                // Call original oninit function, if one was passed in the config
                                var callback;
                                try {
                                    callback = settings.tinymce.config.oninit;
                                } catch (err) {
                                    // No callback passed
                                }

                                if (callback) {
                                    callback.call(this);
                                }
                            }
                        }
                    );
                    var tiny = contentArea.tinymce(configuration);
                }
            });
        },

        deinit: function (settings, contentAreas) {
            contentAreas.filter('.active').each(function () {
                var contentArea = $(this);
                var tiny = contentArea.tinymce();
                if (tiny) {
                    tiny.remove();
                }
                contentArea
                    .removeClass('active')
                    .removeAttr('id')
                    .removeAttr('style')
                    .removeAttr('spellcheck')
                ;
            });
        },

        initialContent: '<p>' + t('Click here and start editing') + '</p>',
    };
})();
