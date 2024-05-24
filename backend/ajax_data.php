<?php
ini_set('display_errors', 0);
include_once('db.php');
header("Access-Control-Allow-Origin: *");
$post_json = file_get_contents('php://input');
$_REQUEST = json_decode($post_json, true);
if (isset($_REQUEST['fetch_all_stock']) && !empty($_REQUEST['fetch_all_stock'])) {
    $sql = "select * from stock_list";
    $result = $db_connect->query($sql);
    $json_data_stock = [];
    $json_data = [];
    while ($r = $result->fetch_assoc()) {
        $json_data_stock[] = $r;
    }
    $json_data['stock'] = $json_data_stock;
    $sqluser = "select id,name from user";
    $json_data_user = [];
    $result = $db_connect->query($sqluser);
    while ($r = $result->fetch_assoc()) {
        $json_data_user[] = $r;
    }
    $json_data['user'] = $json_data_user;
    echo json_encode($json_data);
}
if (isset($_REQUEST['fetch_all_user']) && !empty($_REQUEST['fetch_all_user'])) {
    $sqluser = "select id,name from user";
    $result = $db_connect->query($sqluser);
    $json_data = [];
    while ($r = $result->fetch_assoc()) {
        $json_data[] = $r;
    }
    echo json_encode($json_data);
}
if (isset($_REQUEST['fetch_stock_details']) && !empty($_REQUEST['fetch_stock_details'])) {

    $id = $_REQUEST['id'];
    $user_id = $_REQUEST['user_id'];
    $stmt = $db_connect->prepare("select * from stock_list where id = ?");
    $stmt->bind_param("i",$id);
    $stmt->execute();
    $result = $stmt->get_result();
    $json_data = [];
    while ($r = $result->fetch_assoc()) {

        $json_data['alldetails'] = $r;
    }

    $stmt = $db_connect->prepare("SELECT IFNULL(SUM(sh.qty), 0) as owned_stock, COUNT(*) as count FROM stock_list sl INNER JOIN stock_history sh on sl.id = sh.stock_id where sh.stock_id = ? and sh.user_id = ?");
    $stmt->bind_param("ii",$id,$user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($r = $result->fetch_assoc()) {
        $json_data['userstockdetails'] = $r;
    }
    echo json_encode($json_data);
}

if (isset($_REQUEST['select_stock_transaction']) && !empty($_REQUEST['select_stock_transaction'])) {

    $sql = "SELECT sl.stock_name,sh.* FROM stock_history sh INNER JOIN stock_list sl on sl.id = sh.stock_id WHERE sh.datetime IN (SELECT MAX(datetime) FROM stock_history GROUP BY stock_id HAVING sh.id = sh.id) ORDER BY sh.datetime DESC";
    $result = $db_connect->query($sql);
    $json_data = [];
    while ($r = $result->fetch_assoc()) {
        $json_data[] = $r;
    }
    echo json_encode($json_data);
}
if (isset($_REQUEST['fetch_individual_stock_details_all']) && !empty($_REQUEST['fetch_individual_stock_details_all'])) {
    $sql = "SELECT sl.stock_name, sh.* FROM stock_list sl INNER JOIN stock_history sh on sl.id = sh.stock_id ORDER BY datetime ASC";

    $result = $db_connect->query($sql);
    $json_data = [];
    $pre = '';
    while ($r = $result->fetch_assoc()) {
        $json_data[] = $r;
    }
    echo json_encode($json_data);
}
if (isset($_REQUEST['fetch_individual_stock_details']) && !empty($_REQUEST['fetch_individual_stock_details'])) {
   
    $id = $_REQUEST['id'];
    $stmt = $db_connect->prepare("SELECT sl.stock_name, sh.* FROM stock_list sl INNER JOIN stock_history sh on sl.id = sh.stock_id where sh.stock_id = ? ORDER BY sh.datetime DESC");
    $stmt->bind_param("i",$id);
    $stmt->execute();
    $result = $stmt->get_result();
    $json_data = [];
    while ($r = $result->fetch_assoc()) {
        $json_data[] = $r;
    }
    echo json_encode($json_data);
}
if (isset($_REQUEST['stock_max_valuation']) && !empty($_REQUEST['stock_max_valuation'])) {
    $sql = "SELECT * FROM `stock_list` ORDER BY valuation DESC;";
    $result = $db_connect->query($sql);
    $json_data = [];
    while ($r = $result->fetch_assoc()) {
        $json_data[] = $r;
    }
    echo json_encode($json_data);
}
