import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const stories = [
  {
    name: "Rohan Patel",
    univ: "University of Toronto",
    review: "The unsecured loan process was incredibly fast. Within 3 days, I got my sanction letter with an interest rate lower than what my local bank offered.",
    amount: "₹45 Lakhs"
  },
  {
    name: "Ayesha Khan",
    univ: "Columbia University",
    review: "JustTap Capital handled everything from my university shortlisting to my visa documentation. The 50% processing fee reduction was a huge help.",
    amount: "₹1.2 Crore"
  },
  {
    name: "Arjun Reddy",
    univ: "University of Melbourne",
    review: "I was worried about collateral, but their NBFC partners provided an unsecured loan that covered my entire tuition and living expenses effortlessly.",
    amount: "₹65 Lakhs"
  }
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Student Success Stories</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Join thousands of students who have realized their study abroad dreams with fast loan processing and full admission support.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {stories.map((story, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white border border-slate-100 shadow-xl shadow-brand/5 p-8 rounded-3xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/10 transition-all"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-slate-700 text-lg leading-relaxed mb-8 font-medium italic">
              "{story.review}"
            </p>
            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-bold text-slate-900 text-lg">{story.name}</h4>
              <p className="text-brand font-semibold text-sm mb-3">{story.univ}</p>
              <div className="inline-block px-4 py-1.5 bg-brand/10 rounded-lg text-xs font-bold text-brand">
                Loan Sanctioned: {story.amount}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
