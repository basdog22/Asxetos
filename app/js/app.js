var dialog, form, logindialog, loginform,
    onmenu = $("#onmenu"),
    is_preset = $("#is_preset"),
    mtitle = $("#mtitle"),
    metadesc = $("#metadesc");
page_slug = $("#page_slug");

jQuery(document).ready(function ($) {
    $('#asxetos_canvas').gridEditor({
        new_row_layouts: [[12], [1, 11], [2, 10], [3, 9], [4, 8], [5, 7], [6, 6], [7, 5], [8, 4], [9, 3], [10, 2], [11, 1]],
        content_types: [ASXETOS.rte],
        current_page: ASXETOS.current_page,
        remote_url: ASXETOS.asxetos_url + '/',
        source_textarea: '#asxetos_textarea',
    });


    dialog = $("#menu-dialog").dialog({
        autoOpen: false,
        height: 470,
        width: 350,
        modal: true,
        buttons: {
            [t("Save")]: save_page_details,
            [t("Close")]: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
        }
    });
    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        save_page_details();
    });

    onmenu.on('change', function () {
        if ($(this).is(":checked")) {
            mtitle.removeAttr('disabled').removeClass('asxetos-disabled-field');
        } else {
            mtitle.attr('disabled', true).addClass('asxetos-disabled-field');
        }

    });


    $(document).on('click', '.asxetos-page-details', function () {

        $.post(ASXETOS.asxetos_url + '/', {
            page_slug: $(this).data('page'),
            ajaxaction: 'getpagedetails'
        }, function (res) {
            mtitle.val(res.mtitle);
            metadesc.html(res.metadesc);
            page_slug.val(res.slug);

            if (res.slug == '/' || res.slug == 'blog') {
                $("#asxetos-delete-page").attr("disabled", true).attr("title", t('You can not delete the main or the blog page!'));
            } else {
                $("#asxetos-delete-page").removeAttr("disabled").attr("title", t('Delete this page!'));
            }

            if (res.onmenu == 1) {
                onmenu.attr('checked', true);
            } else {
                onmenu.removeAttr('checked').change();
            }
            if(res.is_preset== 1){
                is_preset.attr('checked', true);
            } else {
                is_preset.removeAttr('checked').change();
            }
        });

        dialog.dialog("open");
    });

    $(document).on('click', "#asxetos-delete-page", function () {
        swal({
                title: t("Are you sure?"),
                text: t("Your will not be able to recover this page!"),
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: t("Yes, delete it!"),
                closeOnConfirm: false
            },
            function () {
                $.post(ASXETOS.asxetos_url + '/', {
                    page_slug: page_slug.val(),
                    ajaxaction: 'delpage'
                }, function (res) {
                    swal(
                        res.title,
                        res.message,
                        res.type
                    );
                    dialog.dialog("close");
                });
            });
    });
    $(document).on('click', "#asxetos-page-new", function () {
        swal({
            title: t("Page title"),
            type: "input",
            showCancelButton: true,
            confirmButtonText: t("Save"),
            cancelButtonText: t("Close"),
            closeOnConfirm: false,
            inputPlaceholder: t("Please specify a page title")
        }, function (inputValue) {
            if (inputValue === false) {
                return false;
            }
            if (inputValue === "") {
                swal.showInputError(t("You need to write something!"));
                return false
            }

            $.post(ASXETOS.asxetos_url + "/", {
                page_title: inputValue,
                page_content: "",
                page_slug: inputValue,
                ajaxaction: 'addpage'
            }, function (result) {
                swal(result.title, result.message, result.type);
                dialog.dialog("close");
            }, 'json');
        });
    });


    $(document).on('click', "#asxetos-blog-new", function () {
        swal({
            title: t("Post title"),
            type: "input",
            showCancelButton: true,
            confirmButtonText: t("Save"),
            cancelButtonText: t("Close"),
            closeOnConfirm: false,
            inputPlaceholder: t("Please specify a post title")
        }, function (inputValue) {
            if (inputValue === false) {
                return false;
            }
            if (inputValue === "") {
                swal.showInputError(t("You need to write something!"));
                return false
            }

            $.post(ASXETOS.asxetos_url + "/", {
                page_title: inputValue,
                page_content: "",
                page_slug: inputValue,
                ajaxaction: 'addpost'
            }, function (result) {
                swal(result.title, result.message, result.type);
                dialog.dialog("close");
            }, 'json');
        });
    });

    $(document).on('click',".asxetos_block .close",function () {
        $(this).parent().fadeOut(400).remove();
    });






});

function save_page_details() {
    $.post(ASXETOS.asxetos_url + '/', {
        page_slug: page_slug.val(),
        mtitle: mtitle.val(),
        metadesc: metadesc.val(),
        onmenu: (onmenu.is(":checked")) ? 1 : 0,
        is_preset: (is_preset.is(":checked")) ? 1 : 0,
        ajaxaction: 'setpagedetails'
    }, function (res) {
        document.location = document.location;
    });
}


