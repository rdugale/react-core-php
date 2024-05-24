import { useState, useEffect } from "react";
function BuySellStock() {
  const [inputs, setInputs] = useState({});
  const [stock_data, set_stock_data] = useState([]);
  const [user_data, set_user_data] = useState([]);
  const [error, SetError] = useState('');
  const buystock = (event) => {
    event.preventDefault();
    // console.log('buy click', inputs);
    const jsonDatasinglestock = { buy_stock: 'buy_stock', ...inputs };
    const options_single_stock = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(jsonDatasinglestock) // Convert JSON data to a string and set it as the request body
    };
    fetch('http://localhost/stock-react-demo/backend/stock_operation.php', options_single_stock)
      .then(function (response) { return response.json(); })
      .then(function (json) {
        console.log("json", json);
        if (typeof (json.error) != 'undefined') {
          SetError(json.error);
          return;
        }
        apicallstock(inputs.select_stock);
        alert(json.status);
      });

  }
  const sellstock = (event) => {

    event.preventDefault();
    // console.log('sell click', inputs);
    const jsonDatasinglestock = { sell_stock: 'sell_stock', ...inputs };
    const options_single_stock = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(jsonDatasinglestock) // Convert JSON data to a string and set it as the request body
    };
    fetch('http://localhost/stock-react-demo/backend/stock_operation.php', options_single_stock)
      .then(function (response) { return response.json(); })
      .then(function (json) {
        console.log("json", json);
        if (typeof (json.error) != 'undefined') {
          SetError(json.error);
          return;
        }
        apicallstock(inputs.select_stock);
        alert(json.status);
      });
  }
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }))
    //if (name == 'select_stock')
    // apicallstock(value);
  }
  const handleBlur = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }))
  }
  const apicallstock = (value) => {
    const jsonDatasinglestock = { fetch_stock_details: 'fetch_stock_details', id: inputs.select_stock, user_id: inputs.select_user };
    const options_single_stock = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(jsonDatasinglestock) // Convert JSON data to a string and set it as the request body
    };

    fetch('http://localhost/stock-react-demo/backend/ajax_data.php', options_single_stock)
      .then(function (response) { return response.json(); })
      .then(function (json) {
        //console.log("json", json);
        setInputs(values => ({ ...values, ['tsqty']: json.alldetails.stock_qty, ['sprice']: json.alldetails.stock_price, ['sqty']: '', ['asqty']: json.alldetails.available_qty }));
        /*
        if(json.userstockdetails.owned_stock != null){
         var owned_stock = json.userstockdetails.owned_stock;
          console.log("in owned stock condition",owned_stock);
        }else
        {
          var owned_stock = 0;
          console.log("in not owned stock condition",owned_stock);
        }
        */
        setInputs(values => ({ ...values, ['ownsqty']: json.userstockdetails.owned_stock }));
        SetError('');
        /*
        setInputs(values => ({ ...values, ['tsqty']: json[0].stock_qty }));
         setInputs(values => ({ ...values, ['sprice']: json[0].stock_price }));
         setInputs(values => ({ ...values, ['sqty']: '' }));
         */
      });

  }
  useEffect(() => {
    if (inputs.select_user !== undefined) apicallstock(1);
  }, [inputs.select_user]);

  useEffect(() => {
    if (inputs.select_stock !== undefined) apicallstock(1);
  }, [inputs.select_stock]);

  useEffect(() => {
    const jsonDatastock = { fetch_all_stock: 'fetch_all_stock' };
    const optionsstock = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({ fetch_all_stock: 'fetch_all_stock' }) // Convert JSON data to a string and set it as the request body
    };
    fetch('http://localhost/stock-react-demo/backend/ajax_data.php', optionsstock)
      .then(function (response) { console.log("response", response); return response.json(); })
      .then(function (json) {
        console.log("json", json);
        setInputs(values => ({ ...values, ['select_user']: json.user[0].id }));
        setInputs(values => ({ ...values, ['select_stock']: json.stock[0].id }));
        setInputs(values => ({ ...values, ['tsqty']: json.stock[0].stock_qty }));
        setInputs(values => ({ ...values, ['sprice']: json.stock[0].stock_price }));
        set_stock_data(json.stock);
        set_user_data(json.user);
      });


  }, []);

  return (
    <div className="form_div">
      <h1>Stock Buy/Sell </h1>
      <form id="stock_buy_sell">
        <label htmlFor="user">User</label>
        <select className="select_user" name="select_user"
          value={inputs.select_user || ""}
          onChange={handleChange} >
          {
            user_data.map((e, key) => {
              return <option key={e.id} value={e.id}>{e.name}</option>;
            })
          }
        </select>
        <label htmlFor="sname">Stock Name</label>
        <select className="select_stock" name="select_stock"
          value={inputs.select_stock || ""}
          //  ref={user_details}
          onChange={handleChange}   >
          {
            stock_data.map((e, key) => {
              return <option key={e.id} value={e.id}>{e.stock_name}</option>;
            })
          }
        </select>
        <label htmlFor="sqty">Stock Quantity</label>
        <input type="number" name="sqty" id="sqty" required
          value={inputs.sqty || ""}
          onChange={handleBlur}
        />
        {error != '' && <p style={{ backgroundColor: 'red', color: 'white', width: '80%', textAlign: 'center', margin: 'auto' }} >{error}</p>}
        <label htmlFor="sprice">Stock Current Price</label>
        <input type="number" name="sprice" id="sprice" required readOnly
          value={inputs.sprice || ""}
        />

        <label htmlFor="tsqty">Toal Stock Quantity</label>
        <input type="number" name="tsqty" id="tsqty" required readOnly
          value={inputs.tsqty || ""}
        />

        <label htmlFor="asqty">Available Stock Quantity</label>
        <input type="number" name="asqty" id="asqty" required readOnly
          value={inputs.asqty || ""}
        />

        <label htmlFor="ownsqty">Owned Stock Quantity</label>
        <input type="number" name="ownsqty" id="ownsqty" required readOnly
          value={inputs.ownsqty || 0}
        />
        <button style={{ display: 'inline' }} className="buy_stock" onClick={buystock}> Buy Stock</button>
        <button style={{ display: 'inline' }} className="sell_stock" onClick={sellstock}> Sell Stock</button>
      </form>
    </div>
  );
}
export default BuySellStock;