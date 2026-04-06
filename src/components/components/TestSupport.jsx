import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function TestSupport() {
  return (
    <section className="section-padding bg-white">
      <div className="grid lg:grid-cols-2 gap-12 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-50 p-10 rounded-3xl border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Scholarship Programs</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Students may qualify for scholarship opportunities through performance-based tests. We connect high-achieving profiles with global university grants that significantly reduce tuition burdens.
            </p>
          </div>
          <button className="self-start text-brand font-bold flex items-center gap-2 hover:text-brand-dark transition-colors">
            Explore Scholarships
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-brand/5 to-transparent p-10 rounded-3xl border border-brand/20 flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 bg-brand text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand/20">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Entrance Exam Coaching</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Affordable preparation programs that improve admission success. Gain the scores you need for top institutions.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['IELTS', 'GRE', 'GMAT', 'GATE'].map((test) => (
                <span key={test} className="px-4 py-2 bg-white rounded-full text-slate-800 font-medium border border-slate-200 shadow-sm">
                  {test}
                </span>
              ))}
            </div>
          </div>
          <button className="self-start text-brand font-bold flex items-center gap-2 hover:text-brand-dark transition-colors">
            Start Preparation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
