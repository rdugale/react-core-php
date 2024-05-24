<?php
ini_set('display_errors', 0);
include('stock_module.php');
header("Access-Control-Allow-Origin: *");
$post_json = file_get_contents('php://input');
$_POST = json_decode($post_json, true);
if((isset($_POST['buy_stock']) && !empty($_POST['buy_stock'])) || (isset($_POST['sell_stock']) && !empty($_POST['sell_stock'])))
{
    $id = trim($_POST['select_stock']);
    $userid = trim($_POST['select_user']);
    $qty = trim($_POST['sqty']);
    $tsqty = trim($_POST['tsqty']);
    $price = trim($_POST['sprice']);
    $json_response = [];
     if($qty == '' )
     {
        $json_response['error'] = 'Quantity Should Not Be Emty';
        echo json_encode($json_response);
        exit;
     }

     if(!is_numeric($qty))
     {
        $json_response['error'] = 'Quantity Should Be Number';
        echo json_encode($json_response);
        exit;
     }
    
    if(isset($_POST['buy_stock']) && !empty($_POST['buy_stock']))
    {
        // $id = $_POST['select_stock'];
        // $userid = $_POST['select_user'];
        // $qty = $_POST['sqty'];
        // $tsqty = $_POST['tsqty'];
        // $price = $_POST['sprice'];
        $stock = new stock_module();
        $json_response['status'] = $stock->buy_stock($id ,$userid,$qty,$tsqty,$price);
        echo json_encode($json_response);
    }
    if(isset($_POST['sell_stock']) && !empty($_POST['sell_stock']))
    {
        // $id = $_POST['select_stock'];
        // $userid = $_POST['select_user'];
        // $qty = $_POST['sqty'];
        // $tsqty = $_POST['tsqty'];
        // $price = $_POST['sprice'];
        $stock = new stock_module();
        $json_response['status'] = $stock->sell_stock($id ,$userid,$qty,$tsqty,$price);
        echo json_encode($json_response);
    }

}
if (isset($_POST['add_stock']) && !empty($_POST['add_stock'])) {
    $name = trim($_POST['sname']);
    $price = trim($_POST['sprice']);
    $qty = trim($_POST['sqty']);
    $error = 0;
    $json_response= [];
    if($qty == '' )
    {
       $json_response['error']['qty'] = 'Quantity Should Not Be Emty';
       $error = 1;
    }
    if($price == '' )
    {
       $json_response['error']['price'] = 'Initial Price Should Not Be Emty';
       $error = 1;
    }
    if($name == '' )
    {
       $json_response['error']['name'] = 'Name Should Not Be Emty';
       $error = 1;
    }
    if($error == 1)
    {
        echo json_encode($json_response);
        exit;

    }
    $stock = new stock_module();
    $json_response['status'] = $stock->add_stock($name, $price, $qty);
    echo json_encode($json_response);
}
?>