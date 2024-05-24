<?php
$db_connect = new  mysqli('localhost','root','','reactdemo');
if($db_connect->connect_error){
    die("Connection faild "- $db_connect->connect_error);
}
define('TIMEZONE', 'Asia/Calcutta');
date_default_timezone_set(TIMEZONE);

?>