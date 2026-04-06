import { motion } from 'framer-motion';
import { BadgeCheck, Building2, Earth, Clock, ArrowRight } from 'lucide-react';

export default function Hero({ onCheckEligibility }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/untitled-design.png')" }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Text container with background ONLY behind text */}
        <div className="max-w-2xl bg-white/70 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-lg">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-brand-dark"
            >
              WHERE DREAMS MEET<br />
              <span className="text-brand">THE RIGHT PLACE</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-700 mb-10 max-w-xl font-medium leading-relaxed"
            >
              Study Abroad Made Possible — Admission, Education Loan, Visa & Travel Support in One Platform.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-14">
              <button 
                onClick={onCheckEligibility}
                className="flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/50 hover:-translate-y-1"
              >
                Check Loan Eligibility
                <ArrowRight size={20} />
              </button>

              <button className="flex items-center gap-2 bg-white border border-slate-200 text-brand px-8 py-4 rounded-full font-semibold hover:bg-slate-50 transition-all shadow-sm">
                Explore Universities
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-300">

              <div className="flex items-center gap-3">
                <div className="bg-brand/10 p-2 rounded-lg">
                  <BadgeCheck className="text-brand w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">Up to ₹3 Cr</p>
                  <p className="text-xs text-slate-600 font-medium">Loan Amount</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-brand/10 p-2 rounded-lg">
                  <Building2 className="text-brand w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">16+ Partners</p>
                  <p className="text-xs text-slate-600 font-medium">Banks & NBFCs</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-brand/10 p-2 rounded-lg">
                  <Earth className="text-brand w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">500+ Univs</p>
                  <p className="text-xs text-slate-600 font-medium">Global Access</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-brand/10 p-2 rounded-lg">
                  <Clock className="text-brand w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">3 Days</p>
                  <p className="text-xs text-slate-600 font-medium">Fast Approvals</p>
                </div>
              </div>

            </motion.div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}