import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none w-[600px] h-[600px]" />
        <div className="absolute top-0 left-0 bg-amber-300/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[400px] h-[400px]" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Start Your Study Abroad Journey <span className="text-yellow-300">Today</span>
            </h2>
            <p className="text-slate-100 text-lg mb-10 leading-relaxed max-w-md">
              Compare loans, find the right university, and secure your admission—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-brand px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-lg shadow-white/20">
                Check Loan Eligibility
              </button>
              <button className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors">
                Apply for Admission
              </button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-2xl lg:-mr-8 relative z-20"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Talk to an Advisor</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all bg-slate-50"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all bg-slate-50"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all bg-slate-50"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Desired Country</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all text-slate-600 bg-slate-50">
                    <option>Select Country</option>
                    <option>USA</option>
                    <option>UK</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Preferred Course</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all bg-slate-50"
                    placeholder="e.g. MS in CS"
                  />
                </div>
              </div>
              <button 
                type="button" 
                className="w-full bg-brand text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-colors mt-6 shadow-md shadow-brand/20"
              >
                Request Free Consultation
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
