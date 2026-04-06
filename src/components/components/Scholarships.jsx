import { motion } from 'framer-motion';
import { GraduationCap, Award, Users, Map, Globe, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

const scholarshipDetails = [
  {
    icon: <Award className="w-8 h-8 text-brand" />,
    label: "Scholarship Value",
    value: "₹2,00,000",
    suffix: "per student"
  },
  {
    icon: <Users className="w-8 h-8 text-brand" />,
    label: "Total Beneficiaries",
    value: "5",
    suffix: "students per year"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-brand" />,
    label: "Total Corpus",
    value: "₹10,00,000",
    suffix: "total fund"
  }
];

const eligibility = [
  "Indian nationality for all applicants.",
  "Accepted into a recognized university abroad.",
  "Demonstrated financial need (Need-Based).",
  "Strong academic record in previous studies.",
  "Intent to return or contribute back to the community."
];

export default function Scholarships() {
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
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: 'url("/gateway-to-excellence.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
      </section>

      {/* Main Scholarship Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-brand font-bold tracking-wider text-sm mb-4 uppercase">Direct Support</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Need-Based Education Support for Indian Students studying abroad
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                We believe that financial constraints should never stand in the way of exceptional talent. Our flagship scholarship program is designed to bridge the gap for Indian students who have secured admissions but need that extra push to cross the finish line.
              </p>
              
              <div className="space-y-4">
                {eligibility.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid gap-6"
            >
              {scholarshipDetails.map((detail, idx) => (
                <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {detail.icon}
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">{detail.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-brand-dark">{detail.value}</span>
                        <span className="text-slate-400 text-sm">{detail.suffix}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-brand-dark p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-brand/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <p className="font-bold text-lg mb-2">Total Scholarship Corpus</p>
                  <div className="text-4xl font-extrabold text-brand-light mb-4">₹10,00,000</div>
                  <p className="text-brand-light/80 text-sm">Dedicated annually to supporting Indian talent on the global stage.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Commitment</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Offered by Justtap Capital, this program is more than just financial aid—it's an investment in the future leaders of India.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <Map className="w-12 h-12 text-brand mx-auto mb-6" />
              <h4 className="text-xl font-bold mb-3">Empowering India</h4>
              <p className="text-slate-600">Supporting domestic talent to gain global exposure and bring world-class expertise back home.</p>
            </div>
            <div className="p-8">
              <Globe className="w-12 h-12 text-brand mx-auto mb-6" />
              <h4 className="text-xl font-bold mb-3">Global Perspective</h4>
              <p className="text-slate-600">Ensuring Indian students thrive in diverse international environments without financial stress.</p>
            </div>
            <div className="p-8">
              <GraduationCap className="w-12 h-12 text-brand mx-auto mb-6" />
              <h4 className="text-xl font-bold mb-3">Leveling the Field</h4>
              <p className="text-slate-600">Providing equal opportunities for meritorious students from all economic backgrounds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <HelpCircle className="w-16 h-16 text-brand-light mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">How to Apply?</h2>
              <p className="text-lg text-gray-300 mb-10">
                Applications for the upcoming academic year are now open. Our selection committee reviews applications based on merit, need, and future potential.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="mailto:justtapcapital3204@gmail.com" className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-brand/20">
                  Submit Application
                </a>
                <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-4 rounded-full font-bold transition-all backdrop-blur-sm">
                  Download Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
