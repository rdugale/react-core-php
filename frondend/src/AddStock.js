import { useState } from "react";

function AddStock() {

    const [inputs, SetInputs] = useState({});
    const [errors, SetErrors] = useState({});
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        SetInputs((values) => ({ ...values, [name]: value }));
    }
    const AddData = async (event) => {
        event.preventDefault();
        console.log("form data", inputs);
        const postdata = { 'add_stock': 'add_stock', ...inputs };
        const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            body: JSON.stringify(postdata),
        };
        try {
            const fetchResponse = await fetch('http://localhost/stock-react-demo/backend/stock_operation.php', settings);
            const response = await fetchResponse.json();

            if(typeof(response.error) != 'undefined')
            {
                SetErrors(response.error);
                return;
            }
            alert(response.status);
            SetInputs((values) => ({ }));
            SetErrors({});
        } catch (e) {
            console.log(e);
        }

    }
    return (
        <div className="form_div">
            <h1>Add Stock</h1>
            <form id="stock_add">
                <label htmlFor="sname">Stock Name</label>
                <input onChange={handleChange} value={inputs.sname || ""} type="text" name="sname" id="sname" />
                {errors.name != '' && <p style={{backgroundColor: 'red',color: 'white', width:'80%',textAlign:'center',margin:'auto'}} >{errors.name}</p>}
                <label htmlFor="sqty">Stock Quantity</label>
                <input onChange={handleChange} value={inputs.sqty || ""} type="number" name="sqty" id="sqty" />
                {errors.qty != '' && <p style={{backgroundColor: 'red',color: 'white', width:'80%',textAlign:'center',margin:'auto'}} >{errors.qty}</p>}
                <label htmlFor="sprice">Stock Initial Price</label>
                <input onChange={handleChange} value={inputs.sprice || ""} type="number" name="sprice" id="sprice" />
                {errors.price != '' && <p style={{backgroundColor: 'red',color: 'white', width:'80%',textAlign:'center',margin:'auto'}} >{errors.price}</p>}
                <button onClick={AddData} className="add_stock"> Add Stock</button>
            </form>
        </div>
    );
}
export default AddStock