<?php
require_once __DIR__ . "/app/logic/app.php";
error_reporting(0);
ob_start();
?><!DOCTYPE html>
<html lang="el" id="app">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title><?php the_site_title() ?></title>
    <meta name="description" content="<?php the_site_description() ?>"/>
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="<?php echo ASXETOS_URL; ?>/app/css/swal/swal.css"/>
    <?php the_lang_js($lang)?>
    <?php if (is_admin()): ?>
        <?php loadPresetsJs();?>
        <script>isAdmin = true;</script>

        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo ASXETOS_URL; ?>/app/css/grid-editor/grideditor.css"/>

        <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
        <?php the_rte_css_url(); ?>
        <link rel="stylesheet" type="text/css" href="<?php echo ASXETOS_URL; ?>/app/css/app.css"/>
    <?php endif; ?>
    <link rel="stylesheet" type="text/css" href="<?php echo ASXETOS_URL; ?>/theme/theme.css"/>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="<?php echo ASXETOS_URL; ?>/app/js/swal/swal.js"></script>
    <?php if (is_admin()): ?>
        <?php the_rte_js_url(); ?>

        <script src="<?php echo ASXETOS_URL; ?>/app/js/grid-editor/jquery.grideditor.js"></script>
    <?php else:?>
        <script>isAdmin = false;</script>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-16803420-12"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '<?php echo ASXETOS_GOOGLE_ANALYTICS_UA?>');
        </script>
    <?php endif; ?>
    <style>
        /*ASXETOS HELPFUL CSS. DO NOT REMOVE IF YOU WANT YOUR LIFE TO BE SIMPLE*/
        .videoWrapper {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            padding-top: 25px;
            height: 0;
        }
        .videoWrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .asxetos-captcha-field{
            visibility: hidden;
            width: 0;
            height: 0;
            position: absolute;
        }
        /*END OF ASXETOS HELPFUL CSS*/

        /*START OF CUSTOM CSS*/
        <?php echo ASXETOS_CUSTOM_CSS; ?>
        /*END OF CUSTOM CSS*/
    </style>
</head>
<body class="<?php the_body_class() ?>">
<div class="asxetos-wrapper">
    <?php if(is_admin()):?>
    <header>
            <?php the_menu()?>
    </header>
    <?php endif;?>
        <?php if (is_admin()): ?>
            <textarea id="asxetos_textarea"></textarea>
            <div id="asxetos_canvas"><?php the_page_content()?></div>
        <?php else: ?>
            <?php the_page_content()?>
        <?php endif; ?>
</div>

</body>
<?php if (is_admin()): ?>
    <script>
        var ASXETOS = {
            rte: '<?php echo ASXETOS_EDITOR; ?>',
            current_page: '<?php echo get_current_page()?>',
            asxetos_url: '<?php echo ASXETOS_URL?>',
            page_type: <?php echo the_page_type()?>,
            pageslist: pageslist
        };
    </script>

    <script src="<?php echo ASXETOS_URL; ?>/app/js/app.js"></script>
<?php else:?>
    <script>
        var ASXETOS = {
            current_page: '<?php echo get_current_page()?>',
            asxetos_url: '<?php echo ASXETOS_URL?>'
        };
    </script>
    <script src="<?php echo ASXETOS_URL; ?>/theme/theme.js"></script>
    <script>
        <?php echo ASXETOS_CUSTOM_JS; ?>
    </script>
<?php endif; ?>
<script>
    $(document).bind('keydown', function (zEvent) {
        if (zEvent.altKey && zEvent.ctrlKey && zEvent.key=='e') {
            if(isAdmin){
                swal({
                        title: t('Logout?'),
                        text: t("You will be logged out from this page"),
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: t("Close"),
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: t("Yes, log me out!"),
                        closeOnConfirm: true
                    },
                    function(){
                        $.post(ASXETOS.asxetos_url+"/", {
                            ajaxaction: "logout",
                        }, function (result) {
                            swal(result.title, result.message, result.type);
                            document.location = document.location;
                        }, 'json');
                    });
            }else{
                swal({
                    title: t("Welcome back!"),
                    text: t("Please give the password"),
                    type: "input",
                    inputType: "password",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    inputPlaceholder: t("Please fill in your password")
                }, function (inputValue) {
                    if (inputValue === false) {
                        return false;
                    }
                    if (inputValue === "") {
                        swal.showInputError(t("You need to write something!"));
                        return false
                    }

                    $.post(ASXETOS.asxetos_url+"/", {
                        ajaxaction: "login",
                        password: inputValue
                    }, function (result) {
                        swal(result.title, result.message, result.type);
                        document.location = document.location;
                    }, 'json');

                });
            }

        }
    });
</script>

</html><?php
$html = ob_get_clean();
$html = asxetos_prepare($html);
echo $html;
?>