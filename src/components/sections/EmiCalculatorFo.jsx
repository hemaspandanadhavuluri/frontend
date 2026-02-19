import React, { useState, useEffect } from "react";
import "./EmiCalculator.css";
import { EMI_CALCULATOR_DEFAULTS, GRACE_PERIOD_OPTIONS } from "../../constants";

export default function EMICalculator() {
  const [courseMonths, setCourseMonths] = useState(EMI_CALCULATOR_DEFAULTS.courseMonths);
  const [loanAmount, setLoanAmount] = useState(EMI_CALCULATOR_DEFAULTS.loanAmount);
  const [interest, setInterest] = useState(EMI_CALCULATOR_DEFAULTS.interest);
  const [moratorium, setMoratorium] = useState(EMI_CALCULATOR_DEFAULTS.moratorium);
  const [graceMonths, setGraceMonths] = useState(EMI_CALCULATOR_DEFAULTS.graceMonths);
  const [repayYears, setRepayYears] = useState(EMI_CALCULATOR_DEFAULTS.repayYears);
  const [psiAmount, setPsiAmount] = useState(0);
const [maxPsi, setMaxPsi] = useState(0);
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMaxPSI = async () => {
  try {
    const res = await fetch("http://16.112.180.35:5000/api/emi/max-psi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        loanAmount: parseFloat(loanAmount),
        interest: parseFloat(interest)
      })
    });

    const data = await res.json();
    setMaxPsi(data.maxPSI || 0);

  } catch (err) {
    console.log("Max PSI error:", err);
  }
};
useEffect(() => {
  if (loanAmount && interest) {
    fetchMaxPSI();
  }
}, [loanAmount, interest]);

  const calculateEMI = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://16.112.180.35:5000/api/emi/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanAmount: parseFloat(loanAmount),
          interest: parseFloat(interest),
          repayYears: parseInt(repayYears),
          courseMonths: parseInt(courseMonths),
          moratorium,
          graceMonths: parseInt(graceMonths),
          psiAmount: parseFloat(psiAmount) || 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate EMI');
      }

      const data = await response.json();

      setEmi(data.emi);
      setTotalPayment(data.totalPayment);
      setTotalInterest(data.totalInterest);
    } catch (err) {
      setError("Failed to calculate EMI. Please try again.");
      console.error('EMI calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emi-container">
      <div className="left_emi-container">
        <h2>Just Tap Capital EMI Calculator</h2>

        <label className="label_emi-container">How long is your course (in months)</label>
        <select
          value={courseMonths}
          onChange={(e) => setCourseMonths(parseInt(e.target.value))}
          className="select_emi-container"
        >
          {Array.from({ length: 13 }, (_, i) => i * 6).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <label className="label_emi-container">Total Loan Amount (₹)</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          className="input_emi-container"
        />

        <label className="label_emi-container">Rate of interest for the loan (in %)</label>
        <input
          type="number"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="input_emi-container"
        />

        <label className="label_emi-container">Will you be paying anything during the moratorium period (course duration plus the grace period)?</label>
        <select
          value={moratorium}
          onChange={(e) => setMoratorium(e.target.value)}
          className="select_emi-container"
        >
          <option>No</option>
          <option>Yes,Full Simple Intrest</option>
          <option>Yes,Only Partial Intrest</option>
          <option>Yes,Full EMI From month 1</option>
        </select>
          {moratorium === "Yes,Only Partial Intrest" && (
          <>
            <label className="label_emi-container">
              PSI (Monthly partial interest you will pay)
            </label>

            <input
              type="number"
              value={psiAmount}
              onChange={(e) => setPsiAmount(e.target.value)}
              className="input_emi-container"
              placeholder="Enter PSI amount"
            />

            <p style={{ marginTop: "6px", fontSize: "14px", color: "#555" }}>
              Maximum Possible PSI: ₹{maxPsi.toLocaleString()}
            </p>
          </>
        )}


        <label className="label_emi-container">Grace Period: How many months after your course you will start paying EMI?</label>
        <select
          value={graceMonths}
          onChange={(e) => setGraceMonths(parseInt(e.target.value))}
          className="select_emi-container"
        >
          {GRACE_PERIOD_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <label className="label_emi-container">After the grace period, in how many years you will repay the education loan?</label>
        <input
          type="number"
          value={repayYears}
          onChange={(e) => setRepayYears(e.target.value)}
          className="input_emi-container"
        />

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <button onClick={calculateEMI} disabled={loading} className="button_emi-container">
          {loading ? 'Calculating...' : 'Calculate EMI'}
        </button>
      </div>

      <div className="right_emi-container">
        <h2>Results</h2>
        <div className="result-box_emi-container">
          <p>Monthly EMI</p>
          <h1>₹{emi}</h1>
        </div>

        <div className="result-box_emi-container">
          <p>Total Payment</p>
          <h1>₹{totalPayment}</h1>
        </div>

        <div className="result-box_emi-container">
          <p>Total Interest</p>
          <h1>₹{totalInterest}</h1>
        </div>
      </div>
    </div>
  );
}
