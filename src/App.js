import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [custData, setCustData] = useState([])
  const [transdata, setTransData] = useState([])

  useEffect(() => {
    handleSelect();
  }, [])

  const handleSelect = async (e) => {
    const filter = e?.target?.value || '';
    const { data: transactions } = await axios.get('http://localhost:3000/transactions');
    const { data: customers } = await axios.get('http://localhost:3000/customers');
    transactions.filter(t => t.date.includes(filter)).map(transaction => {
      customers.map(cust => {
        if (cust.custId === transaction.custId) {
          const total = cust["total"] || 0;
          cust["total"] = total + transaction.amount;
        }
        cust["rewards"] = cust["total"] > 100 ? ((cust["total"] - 100) * 2) + 50 :
          cust["total"] > 50 ? (cust["total"] - 50) * 1 : 0;
      })
    });
    setCustData(customers);
    console.log(custData);
  }

  return (
    <div className="App">
      <div>
        <h3 className='danger'>Note: By default we are showing the total rewards of each customer. 
          To see monthly rewards please select month from the dropdown</h3>
        <select name="months" id="months" onChange={handleSelect} className="Months-dd">
          <option value="">Select</option>
          <option value="10-">Oct</option>
          <option value="11-">Nov</option>
          <option value="12-">Dec</option>
        </select>
      </div>
      <table>
        <tr>
          <th>Cust ID</th>
          <th>Cust Name</th>
          <th>Amount</th>
          <th>Rewards</th>
        </tr>
        {custData.length > 0 && custData.map(cust =>

          <tr key={cust.custId}>
            <td>{cust.custId}</td>
            <td> {cust.custName}</td>
            <td> {cust.total} </td>
            <td> {cust.rewards}</td>
          </tr>

        )}
      </table>
    </div>
  );
}

export default App;
