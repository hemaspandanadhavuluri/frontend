import { motion } from 'framer-motion';
import { Target, Globe, Award, Users, ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: "Rahul Sharma",
    designation: "Founder & CEO",
    image: "/NagendraannaPNG.PNG",
    bio: "Visionary leader with 15+ years in international education finance, dedicated to making global study accessible."
  },
  {
    name: "Priya Patel",
    designation: "Co-Founder & COO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    bio: "Ex-investment banker passionate about structuring student-friendly loan products and seamless operations."
  },
  {
    name: "Dr. Ananya Reddy",
    designation: "Head of Global Admissions",
    image: "/Bhaskar anna.JPG.jpeg",
    bio: "PhD holder with a track record of guiding 5000+ students into Ivy League and top-tier universities."
  }
];

const values = [
  {
    icon: <Globe className="w-8 h-8 text-brand" />,
    title: "Global Reach",
    description: "Connecting talented students with world-class education opportunities across the globe."
  },
  {
    icon: <Target className="w-8 h-8 text-brand" />,
    title: "Student-Centric",
    description: "Every decision we make places the student's interest, career, and financial well-being first."
  },
  {
    icon: <Award className="w-8 h-8 text-brand" />,
    title: "Excellence",
    description: "Maintaining the highest standards of transparency and integrity in our financial services."
  }
];

export default function About() {
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
      <section className="relative py-24 overflow-hidden bg-slate-50">
        <div
          className="absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'url("/untitled design.png")', backgroundSize: 'cover' }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
               <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-brand/10 text-brand tracking-wide uppercase">
                 Our Story
               </span>
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-6"
            >
              EMPOWERING DREAMS <br />
              <span className="text-brand">BEYOND BORDERS</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              JustTap Capital was built on a simple premise: financial constraints should never stand in the way of a brilliant student's global ambitions. We are the bridge between your aspirations and top universities worldwide.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Redefining Education Finance & Admissions</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Founded with a vision to democratize international education, JustTap Capital is a premier financial and educational consultancy based in Hyderabad. We understand that studying abroad is a life-changing decision that requires meticulous planning and robust financial backing.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                By integrating specialized education loans with end-to-end admission counseling, we provide a unified ecosystem. From test prep to securing a visa, our holistic approach ensures that students and parents experience a seamless, stress-free journey to global excellence.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <div className="text-3xl font-extrabold text-brand mb-1">10k+</div>
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Students Guided</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-brand mb-1">₹500Cr+</div>
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Loans Disbursed</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand/10 rounded-[2.5rem] transform translate-x-4 translate-y-4"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Team working together" 
                className="relative rounded-[2.5rem] shadow-xl w-full object-cover h-[500px]"
              />
              {/* Floating Badge */}
               <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
                 <div className="bg-brand/10 p-3 rounded-xl text-brand">
                    <Users className="w-8 h-8" />
                 </div>
                 <div>
                   <div className="text-sm text-slate-500 font-medium">Trusted by</div>
                   <div className="text-xl font-bold text-slate-900">Top Universities</div>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">The principles that guide our mission to illuminate the path for global scholars.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand/30 transition-all group"
              >
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand/10 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders & Team */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-light/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
             <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-brand/10 text-brand tracking-wide uppercase mb-4 inline-block">
               Leadership & Experts
             </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet Our Founding Team</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">A dynamic group of finance veterans, education experts, and tech innovators working together for your success.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="relative mb-6 overflow-hidden rounded-3xl aspect-[3/4]">
                  <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                  <div className="text-brand font-semibold text-sm uppercase tracking-wide mb-3">{member.designation}</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-brand-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Want to be part of our story?</h2>
          <p className="text-brand-light text-lg mb-10 max-w-2xl mx-auto">
            We are always looking for passionate individuals to join our mission of empowering global education.
          </p>
          <a href="#" className="inline-flex items-center gap-2 bg-white text-brand-dark px-8 py-4 rounded-full font-bold hover:bg-brand-light hover:text-white transition-all shadow-lg">
            View Career Opportunities
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

    </div>
  );
}
