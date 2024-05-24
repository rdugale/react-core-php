<?php
include('db.php');
class stock_module
{
    public $new_stock_price;
    public function add_stock($name, $price, $qty)
    {
        global $db_connect;
        $stmt = $db_connect->prepare("insert into stock_list (stock_name,stock_qty,stock_price,valuation,available_qty) values(?,?,?,?,?)");
        $valuation = $qty * $price;
        $stmt->bind_param("siddi", $name, $qty, $price, $valuation, $qty);
        $result =  $stmt->execute();
        $id = $stmt->insert_id;
        if ($result) {
            return "Stock Added With Id : $id";
        } else {
            return "Error While Adding Stock";
        }
    }
    public function buy_stock($id, $userid, $qty, $tsqty, $price)
    {
        global $db_connect;
        $this->new_stock_price = $price + ($qty / $tsqty) * $price;
        $stmt = $db_connect->prepare("SELECT sl.stock_name,sl.stock_qty as total, sl.stock_qty - SUM(sh.qty) as remaining,COUNT(*) as count FROM stock_list sl INNER JOIN stock_history sh on sl.id = sh.stock_id where sh.stock_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $r = $result->fetch_assoc();
        $count = $r['count'];
        $total = $r['total'];
        $remaining = $r['remaining'];
        if ($count > 0 && $remaining >= $qty) {
            $stmt = $db_connect->prepare("update stock_list set stock_price = ?,valuation = ?,available_qty = ? where id = ?");
            $valuation = $tsqty * $this->new_stock_price;
            $available_qty = $remaining - $qty;
            $stmt->bind_param("ddii", $this->new_stock_price, $valuation, $available_qty, $id);
            $result_stock_update = $stmt->execute();
            if ($result_stock_update) {
                $stmt = $db_connect->prepare("insert into stock_history (stock_id,user_id,qty,price_before,price_after) values (?,?,?,?,?)");
                $stmt->bind_param("iiidd", $id, $userid, $qty, $price, $this->new_stock_price);
                $result_stock_insert = $stmt->execute();
                return "Stock Price Updated to :" . number_format($this->new_stock_price, 2);
            } else {
                return "Error While Updating Stock Price";
            }
        } else if ($count == 0) {
            $stmt = $db_connect->prepare("SELECT id,stock_name,stock_qty FROM stock_list where id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $r = $result->fetch_assoc();
            $stock_qty = $r['stock_qty'];
            if ($stock_qty >= $qty) {
                $stmt = $db_connect->prepare("update stock_list set stock_price = ?,valuation = ?,available_qty = ? where id = ?");
                $valuation = $tsqty * $this->new_stock_price;
                $available_qty = $stock_qty - $qty;
                $stmt->bind_param("ddii", $this->new_stock_price, $valuation, $available_qty, $id);
                $result_stock_update = $stmt->execute();
                if ($result_stock_update) {
                    $stmt = $db_connect->prepare("insert into stock_history (stock_id,user_id,qty,price_before,price_after) values (?,?,?,?,?)");
                    $stmt->bind_param("iiidd", $id, $userid, $qty, $price, $this->new_stock_price);
                    $result_stock_insert = $stmt->execute();
                    return "Stock Price Updated to :" . number_format($this->new_stock_price, 2);
                } else {
                    return "Error While Updating Stock Price";
                }
            } else {
                return "Not Enought Quantity To Available For Buy";
            }
        } else if ($count > 0 && $qty > $remaining) {
            return "Not Enought Quantity To Available For Buy";
        }
    }
    public function sell_stock($id, $userid, $qty, $tsqty, $price)
    {
        global $db_connect;
        $this->new_stock_price = $price - ($qty / $tsqty) * $price;
        $stmt = $db_connect->prepare("SELECT sl.stock_name,sl.stock_qty as total, sl.stock_qty - SUM(sh.qty) as remaining,COUNT(*) as count FROM stock_list sl INNER JOIN stock_history sh on sl.id = sh.stock_id where sh.stock_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $r = $result->fetch_assoc();
        $remainingall = $r['remaining'];
        $stmt = $db_connect->prepare("SELECT sl.stock_name,sl.stock_qty as total, SUM(sh.qty) as remaining,COUNT(*) as count FROM stock_list sl INNER JOIN stock_history sh on sl.id = sh.stock_id where sh.stock_id = ? and sh.user_id = ?");
        $stmt->bind_param("ii", $id, $userid);
        $stmt->execute();
        $result = $stmt->get_result();
        $r = $result->fetch_assoc();
        $count = $r['count'];
        $total = $r['total'];
        $remaining = $r['remaining'];
        if ($count > 0 && $remaining >= $qty) {
            $result_stock_update = $db_connect->query("update stock_list set stock_price = $this->new_stock_price where id = $id");
            $stmt = $db_connect->prepare("update stock_list set stock_price = ?,valuation = ?,available_qty = ? where id = ?");
            $valuation = $tsqty * $this->new_stock_price;
            $available_qty = $remainingall + $qty;
            $stmt->bind_param("ddii", $this->new_stock_price, $valuation, $available_qty, $id);
            $result_stock_update = $stmt->execute();
            if ($result_stock_update) {
                $stmt = $db_connect->prepare("insert into stock_history (stock_id,user_id,qty,price_before,price_after) values (?,?,?,?,?)");
                $inserting_qty = -$qty;
                $stmt->bind_param("iiidd", $id, $userid, $inserting_qty, $price, $this->new_stock_price);
                $result_stock_insert = $stmt->execute();
                return "Stock Price Updated to :" . number_format($this->new_stock_price, 2);
            } else {
                return "Error While Updating Stock Price";
            }
        } else if ($count == 0) {
            return "You Don't Own The Stock For Selling";
        } else if ($count > 0 && $qty > $remaining) {
            return "You Are Selling More Than You Own";
        }
    }
    public function __destruct()
    {
        global $db_connect;
        $db_connect->close();
    }
}
