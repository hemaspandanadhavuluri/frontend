import { motion } from 'framer-motion';
import { Tag, TrendingDown, Clock, Wallet, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: TrendingDown,
    title: "Up to 2% Interest Rate Discount",
    description: "Exclusive discounts negotiated with partner banks."
  },
  {
    icon: Tag,
    title: "Up to 25% Processing Fee Reduction",
    description: "Save significantly on bank processing and admin fees."
  },
  {
    icon: ShieldCheck,
    title: "Post Sanction Support",
    description: "Ongoing assistance after loan approval."
  },
  {
    icon: Clock,
    title: "3 Days Loan Sanction",
    description: "Lightning fast processing within 3 working days."
  },
  {
    icon: Wallet,
    title: "Up to ₹3000 Cashback",
    description: "Additional rewards upon successful loan disbursement."
  }
];

export default function LoanBenefits() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Financial Advantages</h2>
          <p className="text-slate-600 text-lg">Apply through JustTap Capital to unlock these premium benefits.</p>
        </div>

        <div className="flex flex-col gap-4">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card bg-white p-6 rounded-2xl flex items-center gap-6 group hover:border-brand/30 transition-colors"
            >
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition-all text-brand">
                <b.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">{b.title}</h4>
                <p className="text-slate-600">{b.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
