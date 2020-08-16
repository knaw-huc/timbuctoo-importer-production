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
                select_dataset($_GET["hsid"], $_GET["repo"], $_GET["actiontype"]);
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

