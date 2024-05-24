import { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Home extends Component {

  constructor() {
    super();
    this.optionssingle = [];
    this.optionallstock = [];
    this.stocklist = [];
    this.stockmaxvaluation = [];
    this.stockmaxvaluationnumber = 0;
    this.stocktransactiondata = [];
    this.maxvaluecompany = '';

    this.state = {
      singlestockdata: [],
      allstockdata: []
    };
  }

  componentDidMount() {
    this.fetchallstockdata();
    this.fetchstocklist();
    this.maxvaluation();
    this.stocktransaction();
    console.log("on component mount");


  }


  async stocktransaction() {


    const postdata = { select_stock_transaction: 'select_stock_transaction'};
    const settings = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(postdata)
    };
    try {
      const fetchResponse = await fetch(`http://localhost/stock-react-demo/backend/ajax_data.php`, settings);
      //console.log("result", fetchResponse);
      const response = await fetchResponse.json();
      this.stocktransactiondata = response;
      //  this.setState(this.stocklist = response.stock);


    } catch (e) {
      console.log(e);
    }
  }

  async maxvaluation() {


    const postdata = { stock_max_valuation: 'stock_max_valuation'};
    const settings = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(postdata)
    };
    try {
      const fetchResponse = await fetch(`http://localhost/stock-react-demo/backend/ajax_data.php`, settings);
      //console.log("result", fetchResponse);
      const response = await fetchResponse.json();
      this.stockmaxvaluationnumber = response[0].valuation;

      this.maxvaluecompany =  `Company with Max Valuation : ${response[0].stock_name} | Valuation : ${response[0].valuation}`;
     this.stockmaxvaluation = response;
    //  this.setState(this.stocklist = response.stock);


    } catch (e) {
      console.log(e);
    }
  }


  async fetchstocklist() {


    const postdata = { fetch_all_stock: 'fetch_all_stock'};
    const settings = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(postdata)
    };
    try {
      const fetchResponse = await fetch(`http://localhost/stock-react-demo/backend/ajax_data.php`, settings);
      //console.log("result", fetchResponse);
      const response = await fetchResponse.json();
      
     this.stocklist = response.stock;
    //  this.setState(this.stocklist = response.stock);


    } catch (e) {
      console.log(e);
    }
  }

  async fetchallstockdata() {


    const postdata = { fetch_individual_stock_details_all: 'fetch_individual_stock_details_all' };
    const settings = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify(postdata)
    };
    try {
      const fetchResponse = await fetch(`http://localhost/stock-react-demo/backend/ajax_data.php`, settings);
      console.log("result", fetchResponse);
      const response = await fetchResponse.json();
      let stockdata = [];

      let unique = [...new Set(response.map(item => item.stock_name))];
      console.log("uniques:", unique);

        // let uniquestock = [...new Set(response.map(item => item.stock_id))];
        // console.log("uniques stock:",uniquestock);

      unique.forEach(function (items, index) {
        let result_array = response.filter(function (el) {
          return (el.stock_name == items);
        });
        console.log("result_array", result_array);
        let stock_data = [];
        result_array.forEach(function (items, index) {
          stock_data.push({
            x: new Date(items.datetime),
            y: Number(items.price_after)
          })

        });

        stockdata.push({
          type: "line",
          axisYType: "secondary",
          name: items,
          showInLegend: true,
          markerSize: 0,
          dataPoints: stock_data

        },)


      });

      console.log(stockdata);

      this.optionallstock = {
        title: {
          text: "Stock Details"
        },
        axisX: {
          valueFormatString: "MMM YYYY"
        },
        axisY2: {
          title: "Price",
          prefix: "Rs",
          suffix: ""
        },
        toolTip: {
          shared: true
        },
        legend: {
          cursor: "pointer",
          verticalAlign: "top",
          horizontalAlign: "center",
          dockInsidePlotArea: true,

        },
        data: stockdata
      };

      this.setState(this.allstockdata = this.optionallstock);



    } catch (e) {
      console.log(e);
    }
  }


  async fertchindividualstock(event) {

    if(event.target.value != 'select-stock')
    {

      const postdata = { fetch_individual_stock_details: 'fetch_individual_stock_details', id: event.target.value };
      const settings = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Origin': 'http://localhost:3000',
        },
        body: JSON.stringify(postdata)
      };
      try {
        const fetchResponse = await fetch(`http://localhost/stock-react-demo/backend/ajax_data.php`, settings);
        console.log("result", fetchResponse);
        const response = await fetchResponse.json();
        //alert(fetchResponse);

        let stocksdata = [];
        response.forEach(function (items, index) {

          let date_time = items.datetime.replaceAll(":", "-").replaceAll(" ", "-").split("-");

          stocksdata.push({
            x: new Date(items.datetime),
            y: Number(items.price_after)
          })
        });
        console.log("stock data", stocksdata);
       

       
        this.optionssingle = {

          title: {
            text: "Stock Price "
          },
          data: [{
            type: "line",

            dataPoints: stocksdata

          }]
        };
        this.setState(this.singlestockdata = this.optionssingle );
        console.log(this.singlestockdata);
      } catch (e) {
        console.log(e);
      }

    }
  }


  render() {

    return (
      <div>
        <div className="flex_class">
          <div className="stock" style={{ width: '50%' }}>
            <h2 style={{ display: 'inline' }}> Stock List</h2>
            <table>
              <tr>
                <th>
                  Stock Name
                </th>
                <th>
                  Stock Price
                </th>
                <th>
                  Stock Qty
                </th>
                <th>
                  Stock Value
                </th>
              </tr>
              <tbody className="stock_list">
              {
              this.stocklist.map((items, key) => {
              return <tr key={items.id}><td>{items.stock_name}</td><td>{items.stock_price}</td><td>{items.stock_qty}</td><td>&#8360;{(items.stock_price * items.stock_qty).toFixed(2)}</td></tr>;
              })
            } 
              </tbody>
            </table>
          </div>
          <div className="max_valuation" style={{ width: '50%' }}>
            <h2> Max Valuation</h2>
            <p style={{ fontWeight: '900' }} className="company_name">{this.maxvaluecompany} </p>
            <table>
              <tr>
                <th>
                  Stock Name
                </th>
                <th>
                  Stock Value
                </th>
                <th>
                  Stock Multiple
                </th>
              </tr>
              {
              this.stockmaxvaluation.map((items, index) => {
                let multiplier = this.stockmaxvaluationnumber / items.valuation;
                return index != 0 && (<tr key={items.id}><td>{items.stock_name}</td><td>{items.valuation}</td><td>{multiplier.toFixed(2)}</td></tr>);
              })
            } 
            </table>
          </div>
        </div>
        <div className="flex_class">
          <div className="company_transaction" style={{ width: '30%' }}>
            <h2> Company Latest Transaction</h2>
            <table>
              <tr>
                <th>
                  Stock Name
                </th>
                <th>
                  Stock Qty
                </th>
                <th>
                  Buy/Sell
                </th>
                <th>
                  Date
                </th>
              </tr>
                {
              this.stocktransactiondata.map(function(items, index) {
                    let color = '';
                    let action = '';
                    if(items.qty > 0){
                        color = 'green';
                        action = 'Buy';
                    }
                    else
                    {
                        color = 'red';
                        action = 'Sell';
                    }
                    let date = new Date(items.datetime);
                    return <tr key={items.id} style={{backgroundColor:`${color}`}}><td>{items.stock_name}</td><td>{items.qty}</td> <td>{action}</td><td>{date.toLocaleString()}</td></tr>;
                  })
              }
            </table>

          </div>

          <div className="chart_information" style={{ width: '70%' }}>
            <h2> Line Chart</h2>
            {/* <div id="chartContainer" style={{height:'auto' ,width: '100%' }}>
            </div> */}
            <CanvasJSChart options={this.allstockdata} />
          </div>
        </div>

        <div className="flex_class" style={{ marginTop: '350px !important' }}>

          <div className="chart_information" style={{ width: '100%' }}>
            <h2> Line Chart</h2>
            <label htmlFor="sname">Select Stock Name To See Chart</label>
            <select className="select_stock_fetch" name="select_stock_fetch" onChange={this.fertchindividualstock.bind(this)}>
            <option key={0} value="select-stock" >Select Stock</option>
            {
              this.stocklist.map((e, key) => {
              return <option key={e.id} value={e.id}>{e.stock_name}</option>;
              })
            } 
             
            </select>
            <CanvasJSChart options={this.optionssingle}
          /* onRef = {ref => this.chart = ref} */ />
            {/* < div id="chartContainerseparate" style={{height: '300px', width: '100%'}} >
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;       