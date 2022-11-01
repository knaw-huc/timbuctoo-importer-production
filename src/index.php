<?php
require(dirname(__FILE__) . '/config/config.php');
require(dirname(__FILE__) . '/classes/MySmarty.class.php');
require(dirname(__FILE__) . '/includes/functions.php');

//error_reporting(0);
$URI = $_SERVER["REQUEST_URI"];
if (isset($_GET["hsid"]))
{


    if (isset($_GET["repo"]))
    {
        if (isset($_GET["actiontype"])) {
            if (isset($_GET["ds"])) {
                upload_form($_GET["hsid"], $_GET["repo"], $_GET["actiontype"], $_GET["ds"]);
            } else {
                switch($_GET["actiontype"]) {
                    case "alles":
                        show_datasets($_GET["hsid"], $_GET["repo"], $_GET["actiontype"]);
                        break;
                    case "show_dataset":
                        if (isset($_GET["dataset_id"])) {
                            show_dataset_details($_GET["hsid"], $_GET["repo"], $_GET["actiontype"], $_GET["dataset_id"]);
                        } else {
                            home();
                        }
                        break;
                    case "show_status":
                        if (isset($_GET["dataset_id"])) {
                            show_dataset_status($_GET["hsid"], $_GET["repo"], $_GET["actiontype"], $_GET["dataset_id"]);
                        } else {
                            home();
                        }
                        break;
                    case "edit_metadata":
                        edit_metadata($_GET["hsid"], $_GET["repo"], $_GET["actiontype"], $_GET["dataset_id"]);
                        break;
                    default:
                        select_dataset($_GET["hsid"], $_GET["repo"], $_GET["actiontype"]);
                        break;

                }
            }
        } else {
            choose_type($_GET["hsid"], $_GET["repo"]);
        }
    } else {
        form($_GET["hsid"]);
    }
} else {
   home();
}

