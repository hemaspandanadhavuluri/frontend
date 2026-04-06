import { motion } from 'framer-motion';
import { Library, CheckCircle, FileText, Compass } from 'lucide-react';

const steps = [
  {
    icon: Compass,
    title: "University Shortlisting",
    description: "Find the perfect fit from 500+ global partner institutions."
  },
  {
    icon: CheckCircle,
    title: "Eligibility Assessment",
    description: "Instant evaluation of academic and financial readiness."
  },
  {
    icon: FileText,
    title: "Application Processing",
    description: "End-to-end support for a perfect application."
  },
  {
    icon: Library,
    title: "Offer Letter Guidance",
    description: "Assistance to choose and secure your top admission offer."
  }
];

export default function Ecosystem() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-semibold mb-6">
            Global Admission Network
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            Complete Study Abroad <span className="text-brand">Ecosystem</span>
          </h2>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Through our secure global admission network powered by <strong>ApplyBoard</strong>, students gain unparalleled access to 500+ leading universities across the globe. We hold your hand from the first search to the final offer.
          </p>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-brand/5 flex items-center justify-center shrink-0 mt-1">
                  <step.icon className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{step.title}</h4>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative lg:h-[600px] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 w-full max-w-sm glass-card p-8 rounded-2xl">
            <div className="w-20 h-20 bg-brand text-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-brand/20">
              <Library className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-dark mb-4">
              500+ Universities
            </h3>
            <p className="text-slate-600 mb-8 font-medium">
              Powered by <span className="text-slate-900 font-bold">ApplyBoard</span>
            </p>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-brand transition-colors">
              Find Your University
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
