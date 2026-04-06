import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How do I apply for an education loan?",
    answer: "Applying is simple! Just click the 'Get Started' or 'Check Loan Eligibility' button, fill in your profile details, and our experts will guide you through the bank selection and documentation process."
  },
  {
    question: "What is the processing time for loan approval?",
    answer: "Typically, education loans through JustTap Capital are approved within 3 to 7 working days, depending on the completeness of your documentation and the specific bank's requirements."
  },
  {
    question: "Do you provide assistance with university admissions?",
    answer: "Yes, we provide end-to-end support including university selection, application assistance, SOP/LOR guidance, and scholarship advice for over 500+ global universities."
  },
  {
    question: "What documents are required for the visa application?",
    answer: "Basic requirements include a valid passport, university acceptance letter (I-20, CAS, etc.), proof of financial support (like a loan sanction letter), and academic transcripts. Our visa experts provide a comprehensive checklist tailored to your destination country."
  },
  {
    question: "Are there any service charges for students?",
    answer: "Our core loan facilitation services are free for students. We partner with banks to ensure you get the best rates without hidden costs."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand/10 px-4 py-2 rounded-full text-brand font-bold text-sm mb-4"
          >
            <HelpCircle size={16} />
            HAVE QUESTIONS?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4"
          >
            Frequently Asked <span className="text-brand">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 font-medium"
          >
            Everything you need to know about loans, admissions, and visas.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`border rounded-2xl transition-all duration-300 ${
                activeIndex === index 
                ? 'border-brand bg-brand/[0.02] shadow-lg shadow-brand/5' 
                : 'border-slate-200 bg-white hover:border-brand/30'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className={`text-lg font-bold transition-colors ${
                  activeIndex === index ? 'text-brand' : 'text-slate-900'
                }`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`${activeIndex === index ? 'text-brand' : 'text-slate-400'}`}
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 md:px-8 md:pb-8 text-slate-600 leading-relaxed font-medium pt-0">
                      <div className="w-full h-px bg-brand/10 mb-6"></div>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 p-8 md:p-10 rounded-[2rem] bg-slate-900 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4">Still have more questions?</h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Our support team is always here to help you. Reach out to us anytime!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://wa.me/918340863204" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand hover:bg-brand-dark text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-brand/20 flex items-center gap-2"
              >
                Chat on WhatsApp
              </a>
              <a 
                href="mailto:justtapcapital3204@gmail.com"
                className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-2"
              >
                Email Our Team
              </a>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </motion.div>

      </div>
    </section>
  );
}
