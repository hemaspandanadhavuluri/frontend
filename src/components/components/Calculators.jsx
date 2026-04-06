import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Calculators({ onCheckEligibility }) {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(10);

  const calculateEMI = () => {
    const P = loanAmount;
    const R = interestRate / 12 / 100;
    const N = tenure * 12;
    if (R === 0) return P / N;
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  };

  const emi = calculateEMI();

  return (
    <section className="section-padding bg-slate-50 border-t border-slate-200">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Financial Tools</h2>
          <p className="text-slate-600 text-lg mb-8">
            Plan your international education with confidence. Use our tools to estimate costs, check eligibility, and calculate EMI instantly.
          </p>
          <div className="space-y-4">
            <button className="w-full text-left px-6 py-4 bg-white rounded-xl border border-brand text-brand font-bold shadow-sm shadow-brand/10">
              Education Loan EMI Calculator
            </button>
            <button 
              onClick={onCheckEligibility}
              className="w-full text-left px-6 py-4 bg-white rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-brand hover:text-brand transition-colors"
            >
              Loan Eligibility Checker
            </button>
            <button className="w-full text-left px-6 py-4 bg-white rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-brand hover:text-brand transition-colors">
              Course Cost Estimator
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 rounded-3xl bg-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <h3 className="text-2xl font-bold text-slate-900 mb-8">EMI Calculator</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Loan Amount (₹)</label>
                <span className="font-bold text-brand">₹{(loanAmount).toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min="100000" max="30000000" step="100000"
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Interest Rate (%)</label>
                <span className="font-bold text-brand">{interestRate}%</span>
              </div>
              <input 
                type="range" 
                min="5" max="18" step="0.1"
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Tenure (Years)</label>
                <span className="font-bold text-brand">{tenure} Years</span>
              </div>
              <input 
                type="range" 
                min="1" max="15" step="1"
                value={tenure} 
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Monthly EMI</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-dark">
                  ₹{Math.round(emi).toLocaleString('en-IN')}
                </p>
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
