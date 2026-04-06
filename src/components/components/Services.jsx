import { motion } from 'framer-motion';
import { Search, FileCheck, Landmark, Plane, Banknote } from 'lucide-react';

const services = [
  { icon: Search, title: "University shortlisting & Eligibility", color: "text-violet-600", hoverBg: "group-hover:bg-violet-600", shadow: "shadow-violet-600/10" },
  { icon: FileCheck, title: "Admission application support", color: "text-emerald-500", hoverBg: "group-hover:bg-emerald-500", shadow: "shadow-emerald-500/10" },
  { icon: Landmark, title: "Education loan processing", color: "text-brand", hoverBg: "group-hover:bg-brand", shadow: "shadow-brand/10" },
  { icon: Plane, title: "Visa & flight ticket booking", color: "text-sky-500", hoverBg: "group-hover:bg-sky-500", shadow: "shadow-sky-500/10" },
  { icon: Banknote, title: "Disbursement & Repayment", color: "text-rose-500", hoverBg: "group-hover:bg-rose-500", shadow: "shadow-rose-500/10" }
];

export default function Services() {
  return (
    <section className="section-padding bg-gradient-to-br from-brand/5 to-white relative pb-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">End-to-End Student Services</h2>
        <p className="text-brand font-medium text-lg">One platform for the entire study abroad journey.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col items-center text-center w-40 group"
          >
            <div className={`w-20 h-20 bg-white border border-slate-100 shadow-xl ${service.shadow} rounded-2xl flex items-center justify-center mb-4 ${service.color} ${service.hoverBg} group-hover:text-white group-hover:-translate-y-2 transition-all duration-300 cursor-pointer`}>
              <service.icon className="w-8 h-8" />
            </div>
            <p className={`text-sm font-semibold text-slate-700 px-2 leading-tight ${service.color.replace('text-', 'group-hover:text-')} transition-colors`}>
              {service.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
