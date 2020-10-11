<?php
$smarty = new Mysmarty();

function home() {
    global $smarty;

    $smarty->assign('logged_in', false);
    $smarty->assign('content', $smarty->view2var('welcome'));
    $smarty->view('page');
}

function form($hsid) {
    global $smarty;

    $smarty->assign('logged_in', true);
    $smarty->assign('hsid', $hsid);
    $smarty->assign('content', $smarty->view2var('upload_form'));
    $smarty->view('page');
}

function choose_type($hsid, $repo) {
    global $smarty;

    $smarty->assign('logged_in', true);
    $smarty->assign('hsid', $hsid);
    $smarty->assign('repo', $repo);
    $smarty->assign('content', $smarty->view2var('choose_dataset_type'));
    $smarty->view('page');
}

function show_datasets($hsid, $repo, $actiontype) {
    global $smarty;

    $smarty->assign('logged_in', true);
    $smarty->assign('hsid', $hsid);
    $smarty->assign('repo', $repo);
    $smarty->assign('actiontype', $actiontype);
    $smarty->assign('content', $smarty->view2var('show_datasets'));
    $smarty->view('page');
}

function show_dataset_details($hsid, $repo, $actiontype, $dataset_id) {
    global $smarty;

    $smarty->assign('logged_in', true);
    $smarty->assign('hsid', $hsid);
    $smarty->assign('repo', $repo);
    $smarty->assign('actiontype', $actiontype);
    $smarty->assign('dataset_id', $dataset_id);
    $smarty->assign('content', $smarty->view2var('show_dataset_details'));
    $smarty->view('page');
}

function select_dataset($hsid, $repo, $actiontype) {
    global $smarty;

    $smarty->assign('logged_in', true);
    $smarty->assign('hsid', $hsid);
    $smarty->assign('repo', $repo);
    $smarty->assign('actiontype', $actiontype);
    if ($actiontype == "new") {
        $smarty->assign('content', $smarty->view2var('choose_dataset_name_new'));
    } else {
        $smarty->assign('content', $smarty->view2var('choose_dataset_name_existing'));
    }
    $smarty->view('page');
}

function edit_metadata($hsid, $repo, $actiontype, $dataset_id) {
    global $smarty;

    $smarty->assign('logged_in', true);
    $smarty->assign('hsid', $hsid);
    $smarty->assign('repo', $repo);
    $smarty->assign('actiontype', $actiontype);
    $smarty->assign('dataset_id', $dataset_id);
    $smarty->assign('content', $smarty->view2var('edit_dataset_details'));
    $smarty->view('page');
}

function upload_form($hsid, $repo, $actiontype, $ds) {
    global $smarty;

    $parts = explode("__", $ds);
    $owner_id = array_shift($parts);
    $smarty->assign('ds_name', implode("__", $parts));
    $smarty->assign('owner_id', $owner_id);
    $smarty->assign('logged_in', true);
    $smarty->assign('hsid', $hsid);
    $smarty->assign('repo', $repo);
    $smarty->assign('actiontype', $actiontype);
    $smarty->assign('ds', $ds);
    $smarty->assign('content', $smarty->view2var('load_file'));
    $smarty->view('page');
}