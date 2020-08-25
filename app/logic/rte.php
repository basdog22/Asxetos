<?php

require_once __DIR__ . "/../../config.php";

switch ($_GET['mode']){
    case "get_templates":
        foreach (scandir(__DIR__.'/../../theme/templates/') as $item){
            if($item!='.' && $item!='..'){
                $templates[] = array(
                    "title"=> $item,
                    "description"=>$item,
                    "url"   =>  "theme/templates/{$item}",
                );
            }
        }

        echo json_encode($templates);

        break;
    case "get_cktemplates":
        foreach (scandir(__DIR__.'/../../theme/templates/') as $item){
            if($item!='.' && $item!='..'){
                $templates[] = array(
                    "title"=> $item,
                    "description"=>$item,
                    'image' =>  "{$item}.png",
                    'html'  =>  file_get_contents(__DIR__."/../../theme/templates/{$item}")
                );
            }
        }

        echo "CKEDITOR.addTemplates( 'default', { imagesPath: CKEDITOR.getUrl( '".ASXETOS_URL."/theme/images/' ), templates: ".json_encode($templates)." } );";

        break;

}

exit;