<?php
session_start();

define("NORMAL_PAGE", 0);
define("BLOG_PAGE", 1);
define("BLOG_POST", 2);

require_once __DIR__ . "/../../config.php";
require_once __DIR__ . "/vendor/autoload.php";
$lang = array();
loadLang($lang);
isMobile();
if (DEBUG_MODE) {
    error_reporting(E_ERROR);
    ini_set("display_errors", 1);
}else{
	error_reporting(E_ERROR);
    ini_set("display_errors", 0);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (trim($_POST['page_content']) && !trim($_POST['ajaxaction']) && !trim($_POST['postaction'])) {
        echo save_page($_POST);
    } elseif (trim($_POST['ajaxaction'])) {

        header("Content-Type: application/json");
        switch ($_POST['ajaxaction']) {
            case "getpagedetails":
                if (is_admin()) {
                    $page = getDb()->table('pages')->find($_POST['page_slug'], 'slug');

                    echo json_encode(array(
                        'mtitle' => $page->mtitle,
                        'metadesc' => $page->metadesc,
                        'onmenu' => $page->onmenu,
                        'slug' => $page->slug,
                        'is_preset' => $page->is_preset,
                    ));
                } else {
                    $msg = array(
                        'title' => t("Error"),
                        'message' => t("No access. Please leave me alone!"),
                        'type' => 'error'
                    );
                    echo json_encode($msg);
                }
                break;
            case "setpagedetails":
                if (is_admin()) {

                    $page = getDb()->table('pages')->find($_POST['page_slug'], 'slug');
                    if ($page->slug) {
                        $data = array(
                            'mtitle' => $_POST['mtitle'],
                            'metadesc' => $_POST['metadesc'],
                            'onmenu' => ($_POST['onmenu']) ? 1 : 0,
                            'is_preset' => ($_POST['is_preset']) ? 1 : 0,
                        );
                        getDb()->table('pages')->where('slug', $page->slug)->update($data);
                        $msg = array(
                            'title' => t("Success"),
                            'message' => t("Page saved"),
                            'type' => 'success'
                        );
                        echo json_encode($msg);
                    } else {
                        $msg = array(
                            'title' => t("Error"),
                            'message' => t("Page not found"),
                            'type' => 'error'
                        );
                        echo json_encode($msg);
                    }
                } else {
                    $msg = array(
                        'title' => t("Error"),
                        'message' => t("No access. Please leave me alone!"),
                        'type' => 'error'
                    );
                    echo json_encode($msg);
                }
                break;
            case "delpage":
                if (is_admin()) {
                    getDb()->table('pages')->where('slug', '=', $_POST['page_slug'])->delete();
                    $msg = array(
                        'title' => t("Success"),
                        'message' => t("Page deleted"),
                        'type' => 'success'
                    );
                    echo json_encode($msg);
                } else {
                    $msg = array(
                        'title' => t("Error"),
                        'message' => t("No access. Please leave me alone!"),
                        'type' => 'error'
                    );
                    echo json_encode($msg);
                }
                break;
            case "addpage":
                if (is_admin()) {

                    $data = array(
                        'title' => $_POST['page_title'],
                        'mtitle' => $_POST['page_title'],
                        'metadesc' => $_POST['page_title'],
                        'onmenu' => 1,
                        'slug' => slugify($_POST['page_slug']),
                        'content' => '<div class="row"><div class="col-md-12 col-sm-12 col-xs-12 column"><div class="ge-content ge-content-type-' . ASXETOS_EDITOR . '" data-ge-content-type="' . ASXETOS_EDITOR . '"><p><br></p></div></div></div>',
                    );
                    getDb()->table('pages')->insert($data);
                    $msg = array(
                        'title' => t("Success"),
                        'message' => t("Page saved"),
                        'type' => 'success'
                    );
                    echo json_encode($msg);
                } else {
                    $msg = array(
                        'title' => t("Error"),
                        'message' => t("No access. Please leave me alone!"),
                        'type' => 'error'
                    );
                    echo json_encode($msg);
                }
                break;
            case "addpost":
                if (is_admin()) {


                    $data = array(
                        'title' => $_POST['page_title'],
                        'mtitle' => $_POST['page_title'],
                        'metadesc' => $_POST['page_title'],
                        'onmenu' => 0,
                        'special' => 2,
                        'slug' => ASXETOS_BLOG_SLUG . '/' . slugify($_POST['page_slug']),
                        'content' => '<div class="row"><div class="col-md-12 col-sm-12 col-xs-12 column"><div class="ge-content ge-content-type-' . ASXETOS_EDITOR . '" data-ge-content-type="' . ASXETOS_EDITOR . '"><p><br></p></div></div></div>'
                    );
                    getDb()->table('pages')->insert($data);
                    $msg = array(
                        'title' => t("Success"),
                        'message' => t("Post saved"),
                        'type' => 'success'
                    );
                    echo json_encode($msg);
                } else {
                    $msg = array(
                        'title' => t("Error"),
                        'message' => t("No access. Please leave me alone!"),
                        'type' => 'error'
                    );
                    echo json_encode($msg);
                }
                break;
            case "login":
                if ($_POST['password'] === ASXETOS_ADMIN_PASSWORD) {
                    $_SESSION['user'] = array(
                        'user' => 'admin'
                    );
                    $msg = array(
                        'title' => t("Success"),
                        'message' => t("You logged in"),
                        'type' => 'success'
                    );
                } else {
                    $msg = array(
                        'title' => t("Error"),
                        'message' => t("No access. Please leave me alone!"),
                        'type' => 'error'
                    );
                }
                echo json_encode($msg);
                break;
            case "logout":
                unset($_SESSION['user']);
                $msg = array(
                    'title' => t("Success"),
                    'message' => t("You logged out"),
                    'type' => 'success'
                );
                echo json_encode($msg);
                break;
            case "savetpl":
                if (is_admin()) {
                    $handler = fopen(ASXETOS_PATH . '/theme/templates/' . slugify($_POST['template_name']) . '.html', 'w');
                    fwrite($handler, $_POST['tpl_content']);
                    fclose($handler);
                    $msg = array(
                        'title' => t("Success"),
                        'message' => t("The template has been created"),
                        'type' => 'success'
                    );
                } else {
                    $msg = array(
                        'title' => t("Error"),
                        'message' => t("No access. Please leave me alone!"),
                        'type' => 'error'
                    );
                }
                echo json_encode($msg);
                break;
            case "loadpreset":
                $page = getDb()->table('pages')->find($_POST['page_slug'], 'slug');
                echo json_encode(array('content' => $page->content));
                break;
        }

    } elseif (trim($_POST['postaction'])) {
        switch ($_POST['postaction']) {
            case "contactformsend":
                send_contact_form();
                break;

        }
    }
    exit;
}

function loadPresetsJs()
{
    if (is_admin()) {
        $pages = getDb()->table('pages')->select(array('slug', 'mtitle'))->setFetchMode(PDO::FETCH_ASSOC)->findAll('is_preset', '1');
        foreach ($pages as $page) {
            $presets[] = $page;
        }
        echo "<script>var asxetos_presets = " . json_encode($presets) . "</script>";
    }
}

function dd($data)
{
    echo "<pre>";
    var_export($data);
    echo "</pre>";
    exit;
}

function loadLang(&$lang)
{
    $lang = require_once __DIR__ . "/../lang/" . ASXETOS_LANGUAGE . ".php";
}

function the_lang_js($lang)
{
    ?>
    <script>
        var asxetos_lang = <?php echo json_encode($lang)?>;

        function t(str) {

            if (asxetos_lang[str]) {

                return asxetos_lang[str];
            } else {
                console.info("'" + str + "'=>'" + str + "',");
                return str;
            }
        }
    </script>
    <?php
}

function t($str)
{
    global $lang;
    return ($lang[$str]) ? $lang[$str] : $str;
}

function save_page($post)
{

    if (is_admin()) {

        try {


            $page = getDb()->table('pages')->find($post['page_slug'], 'slug');


            if ($page->slug) {
                $data = array(
                    'title' => trim($post['page_title']) ? $post['page_title'] : $page->title,
                    'content' => $post['page_content']
                );
                getDb()->table('pages')->where('slug', $page->slug)->update($data);
            } else {
                $data = array(
                    'title' => $post['page_title'],
                    'mtitle' => $post['page_title'],
                    'metadesc' => $post['page_title'],
                    'onmenu' => 1,
                    'slug' => $post['page_slug'],
                    'content' => $post['page_content']
                );
                getDb()->table('pages')->insert($data);
            }

            $msg = array(
                'title' => t("Success"),
                'message' => t("Page saved"),
                'type' => 'success'
            );
        } catch (Exception $e) {
            $msg = array(
                'title' => t("Error"),
                'message' => $e->getMessage(),
                'type' => 'error'
            );
        }


    } else {
        $msg = array(
            'title' => t("Error"),
            'message' => t("No access. Please leave me alone!"),
            'type' => 'error'
        );
    }

    return json_encode($msg);
}


//getDb()->query("CREATE TABLE asx_pages (
//	slug text NOT NULL UNIQUE,
//	title text NOT NULL,
//	content text NOT NULL );");

function getDb()
{
    $connection = new \Pecee\Pixie\Connection(
        'sqlite', array(
            'driver' => 'sqlite',
            'database' => __DIR__ . '/../db/app.sqlite',
            'prefix' => ASXETOS_DB_PREFIX,
        )
    );

    return new \Pecee\Pixie\QueryBuilder\QueryBuilderHandler($connection);
}

function is_admin()
{
    if ($_GET['noadmin']) {
        return false;
    }
    return is_array($_SESSION['user']) ? true : false;
}

function the_site_title()
{
    echo the_page_title(1);
}

function the_site_description()
{
    $current_page_slug = get_current_page();
    $page = getDb()->table('pages')->find($current_page_slug, 'slug');
    echo mb_substr(strip_tags($page->metadesc), 0, 140, "UTF-8");
}

function the_body_class()
{
    $classes = array();
    //add slug as class
    $classes[] = 'body_tag';

    if (defined('ASXETOS_ON_TABLET') || defined('ASXETOS_ON_MOBILE')) {
        $on = (defined('ASXETOS_ON_TABLET')) ? 'tablet' : 'mobile';
        $classes[] = 'on_' . $on;
    } else {
        $classes[] = 'on_desktop';
    }
    $slug = trim(get_current_page()) ? get_current_page() : 'index';
    $classes[] = 'slug_' . $slug;

    if ($slug == 'index') {
        $classes[] = "main_page";
    } else {
        $classes[] = 'single_page';
    }
    echo implode(" ", $classes);

}

function parse_theme_css()
{
    $css = file_get_contents(ASXETOS_URL . "/theme/theme.css");
    preg_match_all('/(?ims)([a-z0-9\s\.\:#_\-@,]+)\{([^\}]*)\}/', $css, $arr);
    $result = array();
    foreach ($arr[0] as $i => $x) {
        $selector = trim($arr[1][$i]);
        $rules = explode(';', trim($arr[2][$i]));
        $rules_arr = array();
        foreach ($rules as $strRule) {
            if (!empty($strRule)) {
                $rule = explode(":", $strRule);
                $rules_arr[trim($rule[0])] = trim($rule[1]);
            }
        }

        $selectors = explode(',', trim($selector));
        foreach ($selectors as $strSel) {
            $strSel = str_replace(".", " ", $strSel);
            $strSel = trim($strSel);
            $result[$strSel] = $rules_arr;
        }
    }
    return array_keys($result);
}

function the_rte_js_url()
{
    $url = "<script src='//cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.min.js'></script>";
    switch (ASXETOS_EDITOR) {
        case "summernote":
            foreach (scandir(__DIR__ . '/../../theme/templates/') as $item) {
                if ($item != '.' && $item != '..') {
                    $templates[str_replace(".html", "", $item)] = mb_convert_case(str_replace(array(".html", "-"), array("", " "), $item), MB_CASE_TITLE);
                }
            }
            echo "<script>var summer_tpls = " . json_encode($templates) . "</script>";
            $css_classes = parse_theme_css();
            echo "<script>var summer_css_classes = " . json_encode($css_classes) . ";</script>";
            $url = "<script src='//cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.min.js'></script>
<script src='" . ASXETOS_URL . "/app/js/summernote/plugins/templates.js'></script>
<script src='" . ASXETOS_URL . "/app/js/summernote/plugins/linklist.js'></script>
<script src='" . ASXETOS_URL . "/app/js/summernote/plugins/addclass.js'></script>
";
            break;
        case "tinymce":
            $url = '<script src="//cdnjs.cloudflare.com/ajax/libs/tinymce/4.3.2/tinymce.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/tinymce/4.3.2/jquery.tinymce.min.js"></script>';
            break;
        case "ckeditor":
            $url = "<script src='//cdnjs.cloudflare.com/ajax/libs/ckeditor/4.5.4/ckeditor.js'></script>";
            break;
        default:
            foreach (scandir(__DIR__ . '/../../theme/templates/') as $item) {
                if ($item != '.' && $item != '..') {
                    $templates[str_replace(".html", "", $item)] = mb_convert_case(str_replace(".html", "", $item), MB_CASE_TITLE);
                }
            }
            echo "<script>var summer_tpls = " . json_encode($templates) . "</script>";
            $url = "<script src='//cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.min.js'></script>
<script src='" . ASXETOS_URL . "/app/js/summernote/plugins/templates.js'></script>
<script src='" . ASXETOS_URL . "/app/js/summernote/plugins/linklist.js'></script>
<script src='" . ASXETOS_URL . "/app/js/summernote/plugins/addclass.js'></script>
";
    }

    echo $url;
}

function the_rte_css_url()
{
    $url = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.min.css">';
    switch (ASXETOS_EDITOR) {
        case "summernote":
            $url = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.min.css">';
            break;
        case "tinymce":
            $url = "";
            break;
        case "ckeditor":
            $url = "";
            break;
        default:
            $url = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.min.css">';
    }

    echo $url;
}

function the_page_type($ret = false)
{
    $current_page_slug = get_current_page();

    //check if it is a sub page
    $page = getDb()->table('pages')->find($current_page_slug, 'slug');

    if ($ret) {
        return $page->special;
    }
    echo $page->special;
}

function get_current_page()
{
    $query = $_SERVER['REQUEST_URI'];
    //remove the dir from the query
    $query = str_replace(array(ASXETOS_DIR, $_SERVER['QUERY_STRING'], "?"), "", $query);
    $query = trim($query, "/");
    $slug = trim($query) ? $query : "/";
    return $slug;
}

function the_page_content($ret = false)
{
    $current_page_slug = get_current_page();

    //check if it is a sub page


    $page = getDb()->table('pages')->find($current_page_slug, 'slug');


    $content = $page->content;

    if (!is_admin()) {
        $content = str_replace(array(

            'contenteditable="true"',
            'ge-content-type-summernote',
            'ge-content-type-tinymce',
            'ge-content-type-ckeditor',
            'ge-content',
            'data-ge-content-type="summernote"',
            'data-ge-content-type="tinymce"',
            'data-ge-content-type="ckeditor"',
            'summernote',
            'tinymce',
            'ckeditor',
//            'note-editor',
            'data-content-div-type=""'
        ), array(
            '',
            '',
            '',
            '',
            'content-div',
            '',
            '',
            '',
            '',
            '',
//            'inner-div',
            '',

        ),
            $content);
    } else {
        $content = str_replace(array(
            'summernote',
            'tinymce',
            'ckeditor',
        ), array(
            ASXETOS_EDITOR,
            ASXETOS_EDITOR,
            ASXETOS_EDITOR,
        ),
            $content);
    }


    if ($ret) {
        return $content;
    }
    echo $content;
}

function the_page_title($ret = false)
{
    $current_page_slug = get_current_page();
    $page = getDb()->table('pages')->find($current_page_slug, 'slug');
    if ($ret) {
        return $page->title;
    }
    echo $page->title;
}


function the_footer()
{
    echo "";
}

function isMobile()
{
    $tablet_browser = 0;
    $mobile_browser = 0;

    if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
        $tablet_browser++;
    }

    if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile|mobile|vodafone)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
        $mobile_browser++;
    }

    if ((strpos(strtolower($_SERVER['HTTP_ACCEPT']), 'application/vnd.wap.xhtml+xml') > 0) or ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))) {
        $mobile_browser++;
    }

    $mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'], 0, 4));
    $mobile_agents = array(
        'w3c ', 'acs-', 'alav', 'alca', 'amoi', 'audi', 'avan', 'benq', 'bird', 'blac',
        'blaz', 'brew', 'cell', 'cldc', 'cmd-', 'dang', 'doco', 'eric', 'hipt', 'inno',
        'ipaq', 'java', 'jigs', 'kddi', 'keji', 'leno', 'lg-c', 'lg-d', 'lg-g', 'lge-',
        'maui', 'maxo', 'midp', 'mits', 'mmef', 'mobi', 'mot-', 'moto', 'mwbp', 'nec-',
        'newt', 'noki', 'palm', 'pana', 'pant', 'phil', 'play', 'port', 'prox',
        'qwap', 'sage', 'sams', 'sany', 'sch-', 'sec-', 'send', 'seri', 'sgh-', 'shar',
        'sie-', 'siem', 'smal', 'smar', 'sony', 'sph-', 'symb', 't-mo', 'teli', 'tim-',
        'tosh', 'tsm-', 'upg1', 'upsi', 'vk-v', 'voda', 'wap-', 'wapa', 'wapi', 'wapp',
        'wapr', 'webc', 'winw', 'winw', 'xda ', 'xda-');

    if (in_array($mobile_ua, $mobile_agents)) {
        $mobile_browser++;
    }

    if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'opera mini') > 0) {
        $mobile_browser++;
        //Check for tablets on opera mini alternative headers
        $stock_ua = strtolower(isset($_SERVER['HTTP_X_OPERAMINI_PHONE_UA']) ? $_SERVER['HTTP_X_OPERAMINI_PHONE_UA'] : (isset($_SERVER['HTTP_DEVICE_STOCK_UA']) ? $_SERVER['HTTP_DEVICE_STOCK_UA'] : ''));
        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $stock_ua)) {
            $tablet_browser++;
        }
    }

    if ($tablet_browser > 0 && $mobile_browser < 1) {
        define("ASXETOS_ON_TABLET",1);
        return true;
    } else {
        define("ASXETOS_ON_MOBILE",1);
        return true;
    }
    define("ASXETOS_ON_DESKTOP",1);
    return false;
}

function slugify($str)
{
    $str = trim($str);
    //first replace greek-letters with latin ones:
    $str = deGreek($str);
    $str = str_replace("-", " ", $str);
    $str = substr($str, 0, 160);

    //replace all non letters and digits with -
    $text = preg_replace('/\W+/u', '-', $str);

    // trim and lowercase

    $text = strtolower(trim($text));
    //replace double --s with single
    $text = str_replace("--", "-", $text);
    if ($text) {
        return trim($text, "-");
    } else {
        return md5($str);
    }
}

function deGreek($str, $mode = false)
{
    //load the greek letters file

    $greeks = array(
        'Α' => 'A',
        'Β' => 'B',
        'Γ' => 'G',
        'Δ' => 'D',
        'Ε' => 'E',
        'Ζ' => 'Z',
        'Η' => 'H',
        'Θ' => 'Th',
        'Ι' => 'I',
        'Κ' => 'K',
        'Λ' => 'L',
        'Μ' => 'M',
        'Ν' => 'N',
        'Ξ' => 'Ks',
        'Ο' => 'O',
        'Π' => 'P',
        'Ρ' => 'R',
        'Σ' => 'S',
        'Τ' => 'T',
        'Υ' => 'Y',
        'Φ' => 'F',
        'Χ' => 'X',
        'Ψ' => 'Ps',
        'Ω' => 'W',
        'α' => 'a',
        'β' => 'b',
        'γ' => 'g',
        'δ' => 'd',
        'ε' => 'e',
        'ζ' => 'z',
        'η' => 'i',
        'θ' => 'th',
        'ι' => 'i',
        'κ' => 'k',
        'λ' => 'l',
        'μ' => 'm',
        'ν' => 'n',
        'ξ' => 'ks',
        'ο' => 'o',
        'π' => 'p',
        'ρ' => 'r',
        'σ' => 's',
        'τ' => 't',
        'υ' => 'u',
        'φ' => 'f',
        'χ' => 'x',
        'ψ' => 'ps',
        'ω' => 'w',
        'ς' => 's',
        'ά' => 'a',
        'έ' => 'e',
        'ή' => 'i',
        'ί' => 'i',
        'ϊ' => 'i',
        'ΐ' => 'i',
        'ό' => 'o',
        'ύ' => 'u',
        'ϋ' => 'u',
        'ώ' => 'w',
        'Ά' => 'A',
        'Έ' => 'E',
        'Ή' => 'H',
        'Ί' => 'I',
        'Ό' => 'O',
        'Ύ' => 'Y',
        'Ώ' => 'W'
    );

    if ($mode) {
        $search = @array_keys($greeks);
        $str = str_replace($greeks, $search, $str);
    } else {
        $search = @array_keys($greeks);
        $str = str_replace($search, $greeks, $str);
    }

    $str = strtolower($str);
    return $str;
}

function the_logo($ret = false)
{
    ob_start();
    echo "<a href='" . ASXETOS_URL . "'><img src='" . ASXETOS_URL . "/theme/logo.png' /></a>";
    $logo = ob_get_clean();
    if ($ret) {
        return $logo;
    }
    echo $logo;
}

function the_contact_form($ret = false)
{
    ob_start();
    ?>
    <form class="asxetos_contact_form" action="<?php echo ASXETOS_URL ?>/" method="post">
        <input type="hidden" name="postaction" value="contactformsend"/>
        <label for="name"><?php echo t('Your name') ?></label>
        <input type="text" name="name" id="name" value="" class="asxetos-full-field"/>
        <label for="email"><?php echo t('Your e-mail') ?></label>
        <input type="email" name="email" id="email" value="" class="asxetos-full-field"/>
        <label for="subject"><?php echo t('Subject') ?></label>
        <input type="text" name="subject" id="subject" value="" class="asxetos-full-field"/>
        <label for="message"><?php echo t('Message') ?></label>
        <textarea id="message" name="message" class="asxetos-full-field"></textarea>
        <input type="submit" class="btn btn-success" name="submit" value="<?php echo t('Send') ?>"/>
        <input type="text" value="" name="captcha" class="asxetos-captcha-field"/>
    </form>
    <?php
    $form = ob_get_clean();
    if ($ret) {
        return $form;
    }
    echo $form;
}

function send_contact_form()
{
    $form = $_POST;

    unset($form['postaction']);

    if (trim($form['captcha'])) {
        //do nothing.. probably a bot or a weirdo
    } else {
        if (filter_var($form['email'], FILTER_VALIDATE_EMAIL)) {
            $message = "<div style='width: 500px;margin: 0 auto'><p>{$form['name']} ({$form['email']}) says:</p><strong>{$form['subject']}</strong><br><div>{$form['message']}</div></div>";
            mail(ASXETOS_CONTACT_EMAIL, ASXETOS_SITE_TITLE . ' Contact Form', $message);
        }
    }
    header("Location: " . ASXETOS_URL);

}

function the_blog_list_admin()
{
    $pages = getDb()->table('pages')->select(array('slug', 'mtitle'))->orderBy('rowid', 'DESC')->findAll('special', 2);
    ob_start();
    ?>
    <ul class="nav nav-stacked" id="admin_blog_list">
        <?php foreach ($pages as $page): ?>
            <li><a href='<?php echo ASXETOS_URL . "/{$page->slug}"; ?>'><?php echo $page->mtitle ?></a></li>
        <?php endforeach; ?>
    </ul>
    <?php
    $list = ob_get_clean();

    return $list;
}

function the_blog_list_frontend($ret=false){
    $pages = getDb()->table('pages')->orderBy('rowid', 'DESC')->findAll('special', 2);
    ob_start();
    ?>
    <div class="row">
            <?php foreach ($pages as $page): ?>
                <div class="col-sm-12">
                    <h3 class="blog_post_title"><a href="<?php echo ASXETOS_URL . "/{$page->slug}"; ?>"><?php echo $page->mtitle ?></a></h3>
                    <div class="blog_post_excerpt">
                        <?php echo mb_substr(strip_tags($page->content),0,255)?>...
                    </div>
                </div>
            <?php endforeach; ?>
    </div>
    <?php
    $archive = ob_get_clean();
    if ($ret) {
        return $archive;
    }
    echo $archive;
}

function the_blog_recent_frontend($ret=false){
    $pages = getDb()->table('pages')->orderBy('rowid', 'DESC')->limit(5)->findAll('special', 2);
    ob_start();
    ?>
        <h3><?php echo t("Recent Blog Posts")?></h3>
        <ul class="nav nav-stacked">
            <?php foreach ($pages as $page): ?>
                <li><a href='<?php echo ASXETOS_URL . "/{$page->slug}"; ?>'><?php echo $page->mtitle ?></a></li>
            <?php endforeach; ?>
        </ul>
    <?php
    $archive = ob_get_clean();
    if ($ret) {
        return $archive;
    }
    echo $archive;
}

function the_menu($ret = false)
{

    ob_start();
    echo "<script>var pageslist =[];</script>";
    $pages = getDb()->table('pages')->where('special', "<", "2")->get();
    $admin = is_admin();
    echo '<ul class="mainmenu">';
    foreach ($pages as $page) {
        $slug = trim($page->slug, "/");
        echo "<script>pageslist.push({title:'{$page->mtitle}',value: '" . ASXETOS_URL . "/{$slug}'})</script>";
        if ($admin) {
            if (get_current_page() == $page->slug) {
                $active = "active";
            } else {
                $active = '';
            }
            echo "<li class='btn btn-sm btn-default {$active}'><div class='btn-group'><a class='btn btn-xs btn-info {$active}' href='" . ASXETOS_URL . "/{$slug}'>&nbsp;{$page->mtitle}&nbsp;</a><button type='button' class='btn btn-xs btn-info dropdown-toggle' data-toggle='dropdown'><span><i class='fa fa-caret-down'></i></span></button><ul class='dropdown-menu' role='menu'><li><a class='asxetos-page-details' data-page='{$page->slug}'><i class='fa fa-wrench'></i> " . t('Page Settings') . "</a></li></ul></div></li>";
        } else {
            if ($page->onmenu) {
                echo "<li><a href='" . ASXETOS_URL . "/{$slug}'>{$page->mtitle}</a></li>";
            }

        }
    }
    echo '</ul>';

    if ($admin) {
        echo '<div id="menu-dialog" title="' . t('Page Settings') . '">
  <form>
    <fieldset>
      <input type="hidden" name="page_slug" id="page_slug" value=""/>
      <label for="is_preset">' . t('Is preset') . '</label>
      <input type="checkbox" name="is_preset" id="is_preset" value="" class="checkbox ui-widget-content ui-corner-all">
      <label for="onmenu">' . t('Show on menu') . '</label>
      <input type="checkbox" name="onmenu" id="onmenu" value="" class="checkbox ui-widget-content ui-corner-all">
      <label for="mtitle">' . t('Menu title') . '</label>
      <input type="text" name="mtitle" id="mtitle" value="" class="asxetos-full-field text ui-widget-content ui-corner-all">
      
     <label for="metadesc">' . t('Meta Description') . '</label>
      <textarea name="metadesc" id="metadesc" class="asxetos-full-field textarea ui-widget-content ui-corner-all"></textarea>
      
      <button type="button" id="asxetos-delete-page"><i class="fa fa-trash"></i></button>
      <!-- Allow form submission with keyboard without duplicating the dialog button -->
      <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
    </fieldset>
  </form>
</div>';
    }
    $menu = ob_get_clean();
    if ($ret) {
        return $menu;
    }
    echo $menu;
}


function asxetos_prepare($html)
{
    if (is_admin()) {
        if (the_page_type(1) == 1) {
            $html = str_replace(array(
                '[BLOG_LIST]'
            ), array(
                the_blog_list_admin()
            ), $html);
        }
    } else {
        $html = str_replace(array(
            '[ASXETOS_MENU]',
            '[ASXETOS_LOGO]',
            '[ASXETOS_CONTACT_FORM]',
            '[BLOG_LIST]',
            '[ASXETOS_RECENT_BLOG]',
        ), array(
            the_menu(1),
            the_logo(1),
            the_contact_form(1),
            the_blog_list_frontend(1),
            the_blog_recent_frontend(1),
        ), $html);

        try {
            $html = preg_replace_callback("#\[\[(.*)\]\]#iU", 'do_shortcode', $html);
        } catch (Exception $e) {
            dd($e->getMessage());
        }
        $html = minifyHTML($html);
    }

    return $html;
}


function minifyHTML($buffer)
{
    $search = array(
        '/\>[^\S ]+/s',  // strip whitespaces after tags, except space
        '/[^\S ]+\</s',  // strip whitespaces before tags, except space
        '/(\s)+/s'       // shorten multiple whitespace sequences
    );
    $replace = array(
        '>',
        '<',
        '\\1'
    );
    $buffer = preg_replace($search, $replace, $buffer);
    return $buffer;
}

function do_shortcode($shortcode)
{
    ob_start();
    $shortcode = explode("=", $shortcode[1]);
    $func = strtolower($shortcode[0]);
    if (function_exists($func)) {
        echo $func($shortcode[1]);
    }

    $result = ob_get_clean();
    return $result;
}


function asxetos_slider($images)
{
    $images = explode(",", $images);

    ob_start();
    ?>
    <script src="https://raw-dot-custom-elements.appspot.com/FabricElements/skeleton-carousel/v2.0.2/webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import"
          href="https://raw-dot-custom-elements.appspot.com/FabricElements/skeleton-carousel/v2.0.2/iron-image/iron-image.html">
    <link rel="import"
          href="https://raw-dot-custom-elements.appspot.com/FabricElements/skeleton-carousel/v2.0.2/skeleton-carousel/skeleton-carousel.html">
    <style is="custom-style">
        skeleton-carousel {
            min-height: 350px;
        }

        iron-image {
            display: none !important;
            overflow: hidden;
            position: relative;
        }

        .selected > iron-image {
            display: block !important;
            background-color: black;
            min-height: 350px;
        }

    </style>
    <skeleton-carousel dots nav loop>
        <?php foreach ($images as $image): $image = trim($image) ?>
            <div>
                <iron-image placeholder='<?php echo ASXETOS_URL . "/theme/images/loading.svg" ?>'
                            data-src="<?php echo $image ?>"
                            sizing="cover"
                            preload
                            fade
                ></iron-image>
            </div>
        <?php endforeach; ?>
    </skeleton-carousel>
    <?php
    $slider = ob_get_clean();
    return $slider;
}

function asxetos_rss($rss)
{

    $rss = simplexml_load_file($rss);
    $count = 0;
    $html = '<ul>';
    foreach ($rss->channel->item as $item) {
        $count++;
        if ($count > 7) {
            break;
        }
        $html .= '<li><a rel="nofollow" href="' . htmlspecialchars($item->link) . '">' . htmlspecialchars($item->title) . '</a></li>';
    }
    $html .= '</ul>';
    return $html;

}