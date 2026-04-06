import { motion } from 'framer-motion';
import { Search, Percent, ShieldCheck, Zap, Scissors, Calculator } from 'lucide-react';

const benefits = [
  {
    icon: Search,
    title: "Instant Comparison",
    description: "Compare 16+ Banks instantly and secure the best loan offer.",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    hoverBg: "group-hover:bg-blue-600/20"
  },
  {
    icon: Percent,
    title: "Lowest Interest Rates",
    description: "India's lowest education loan interest rates through partner lenders.",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
    hoverBg: "group-hover:bg-emerald-600/20"
  },
  {
    icon: ShieldCheck,
    title: "Up to ₹3 Crore",
    description: "Get secured & unsecured education loans customized for you.",
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    hoverBg: "group-hover:bg-purple-600/20"
  },
  {
    icon: Zap,
    title: "Fast Sanctions",
    description: "Loan sanction possible within just 3 working days.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    hoverBg: "group-hover:bg-amber-500/20"
  },
  {
    icon: Scissors,
    title: "Instant Discount",
    description: "Up to 2% instant interest rate discount on selected loans.",
    color: "text-rose-600",
    bg: "bg-rose-600/10",
    hoverBg: "group-hover:bg-rose-600/20"
  },
  {
    icon: Calculator,
    title: "Fee Reduction",
    description: "Up to 50% reduction in bank processing fees.",
    color: "text-cyan-600",
    bg: "bg-cyan-600/10",
    hoverBg: "group-hover:bg-cyan-600/20"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-slate-50 relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-brand mb-4">
          Why Students Choose JustTap Capital
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          We simplify the complexities of international education finance, offering you the best rates and fastest approvals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group glass-card p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-slate-100 bg-white"
          >
            <div className={`w-14 h-14 rounded-xl ${benefit.bg} ${benefit.hoverBg} flex items-center justify-center mb-6 transition-colors`}>
               <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
            </div>
            <h3 className={`text-xl font-bold mb-3 text-slate-800 ${benefit.color.replace('text-', 'group-hover:text-')} transition-colors`}>
              {benefit.title}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
