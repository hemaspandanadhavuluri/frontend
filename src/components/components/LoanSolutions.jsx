import { motion } from 'framer-motion';
import { ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function LoanSolutions() {
  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none w-[800px] h-[800px]" />
      
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Education Loan Solutions</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Partnerships with multiple NBFC lenders increase loan approval chances. We offer both secured and unsecured options.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
        {/* Secured Loan */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-xl hover:shadow-brand/5 transition-all shadow-md group"
        >
          <div className="w-14 h-14 bg-brand/10 group-hover:bg-brand transition-colors rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-7 h-7 text-brand group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900">Secured Education Loans</h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-700">
              <span className="w-1.5 h-1.5 bg-brand rounded-full" />
              Loan amount up to ₹3 Crore
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <span className="w-1.5 h-1.5 bg-brand rounded-full" />
              Lower interest rates
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <span className="w-1.5 h-1.5 bg-brand rounded-full" />
              Property or financial collateral required
            </li>
            <li className="flex items-center gap-3 text-brand font-bold">
              <span className="w-1.5 h-1.5 bg-brand rounded-full" />
              Ideal for high-cost international programs
            </li>
          </ul>
          <button className="flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors">
            Apply for Secured Loan 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Unsecured Loan */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-brand to-brand-dark p-8 rounded-3xl shadow-xl shadow-brand/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">Unsecured Education Loans</h3>
          <ul className="space-y-4 mb-8 relative z-10">
            <li className="flex items-center gap-3 text-white/90">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              No collateral required
            </li>
            <li className="flex items-center gap-3 text-white/90">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              Faster approvals
            </li>
            <li className="flex items-center gap-3 text-white font-bold">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              Ideal for top ranked universities
            </li>
          </ul>
          <button className="relative z-10 flex items-center gap-2 bg-white text-brand px-6 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-lg shadow-white/10 group">
            Check Eligibility
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
