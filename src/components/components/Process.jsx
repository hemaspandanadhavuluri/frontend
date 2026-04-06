import { motion } from 'framer-motion';

const steps = [
  { step: 1, title: "Student profile submission", desc: "Share your academic details to get started." },
  { step: 2, title: "University shortlisting", desc: "Find the best fit from 500+ institutions." },
  { step: 3, title: "Loan comparison", desc: "Compare offers across 16+ banks & NBFCs." },
  { step: 4, title: "Loan approval", desc: "Sanction letter delivered within a few working days." },
  { step: 5, title: "Visa & travel support", desc: "Complete enrollment and travel safely." },
];

export default function Process() {
  return (
    <section className="section-padding bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Education Loan Process</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          A seamless step-by-step journey from application to approval.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
          
          <div className="grid lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center font-bold text-2xl text-slate-400 mb-6 shadow-sm hover:border-brand hover:text-brand transition-colors">
                  {s.step}
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{s.title}</h4>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
