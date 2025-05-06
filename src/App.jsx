import { useState } from 'react';
import './App.css';

function App() {
  document.title = 'Loan Calculator';
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('8.5');
  const [months, setMonths] = useState('60');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [loanDetails, setLoanDetails] = useState([]);
  const [currency, setcurrency] = useState('INR');

  const conversionRates = {
    INR: 1,
    EUR: 0.011,
    USD: 0.012,
    GBP: 0.0095
  };

  const currencySymbols = {
    INR: '₹',
    EUR: '€',
    USD: '$',
    GBP: '£'
  };

  const convert = (amount) => {
    if (!amount) return 0;
    return (parseFloat(amount) * conversionRates[currency]).toFixed(2);
  }

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const interestRate = parseFloat(rate) / 100 / 12;
    const numPayments = parseInt(months);

    if (!principal || !interestRate || !numPayments) return;

    const x = Math.pow(1 + interestRate, numPayments);
    const monthly = (principal * x * interestRate) / (x - 1);
    const total = monthly * numPayments;
    const interestPaid = total - principal;

    setMonthlyPayment(monthly.toFixed(2));
    setTotalPayment(total.toFixed(2));
    setTotalInterest(interestPaid.toFixed(2));

    let loanDetailsArr = [];
    let remainingPrincipal = principal;

    for (let i = 1; i <= numPayments; i++) {
      const monthlyInterestAmount = remainingPrincipal * interestRate;
      remainingPrincipal -= (monthly - monthlyInterestAmount);
      loanDetailsArr.push({
        month: i,
        remainingInterest: monthlyInterestAmount.toFixed(2),
        remainingBalance: remainingPrincipal.toFixed(2)
      });
    }

    setLoanDetails(loanDetailsArr);
  };

  const clearFields = () => {
    setAmount('100000');
    setRate('8.5');
    setMonths('60');
    setMonthlyPayment(null);
    setTotalPayment(null);
    setTotalInterest(null);
    setLoanDetails([]);
  };



  return (
    <>
      <div className="head">
        <h2>Loan Calculator</h2>

      </div>

      <div className="container">
        <h2>Loan Calculator Dashboard</h2>

        <label>
          <input
            type="number"
            placeholder="Loan Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <input
          type="number"
          placeholder="Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Loan Term (Months)"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />

        <select value={currency} onChange={(e) => setcurrency(e.target.value)}>
          {Object.keys(conversionRates).map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>

        <button className='btn1' onClick={calculateLoan}>Calculate</button>

        {monthlyPayment && (
          <div className="results">
            <p><strong>Monthly Payment:</strong>{currencySymbols[currency]} {convert(monthlyPayment)}</p>
            <p><strong>Total Payment:</strong>{currencySymbols[currency]} {convert(totalPayment)}</p>
            <p><strong>Total Interest:</strong>{currencySymbols[currency]} {convert(totalInterest)}</p>
          </div>
        )}

        <button className='btn' id='btn' onClick={clearFields}>Reset Table</button>
        {loanDetails.length > 0 && (
          <div className="loan-details">
            <h3>Amortization Schedule</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Remaining Interest ({currencySymbols[currency]})</th>
                  <th>Remaining Balance ({currencySymbols[currency]})</th>
                </tr>
              </thead>
              <tbody>
                {loanDetails.map((detail) => (
                  <tr key={detail.month}>
                    <td>{detail.month}</td>
                    <td>{currencySymbols[currency]}{detail.remainingInterest}</td>
                    <td>{currencySymbols[currency]}{detail.remainingBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

