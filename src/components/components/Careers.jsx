import { motion } from 'framer-motion';
import { Briefcase, Users, Star, ArrowRight, MapPin, Clock, Zap } from 'lucide-react';

const positions = [
  {
    title: "Education Loan Expert",
    type: "Full-time",
    location: "Hyderabad / Remote",
    description: "Help students navigate the complexities of education loans and secure their future abroad."
  },
  {
    title: "Student Counselor",
    type: "Full-time",
    location: "Hyderabad",
    description: "Guide students through the university selection and admission process for global destinations."
  },
  {
    title: "Operations Manager",
    type: "Full-time",
    location: "Hyderabad",
    description: "Streamline our processes and ensure smooth delivery of services to our students and partners."
  },
  {
    title: "Digital Marketing Specialist",
    type: "Contract",
    location: "Remote",
    description: "Drive our brand awareness and reach more students who dream of studying abroad."
  }
];

const benefits = [
  {
    icon: <Users className="w-6 h-6 text-brand" />,
    title: "Collaborative Culture",
    description: "Work with a team that values your input and encourages growth."
  },
  {
    icon: <Star className="w-6 h-6 text-brand" />,
    title: "Growth Opportunities",
    description: "We invest in your development with training and mentorship."
  },
  {
    icon: <Zap className="w-6 h-6 text-brand" />,
    title: "Impactful Work",
    description: "Directly change lives by helping students achieve their global dreams."
  }
];

export default function Careers() {
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
            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'url("/untitled design.png")', backgroundSize: 'cover' }}
          ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-6"
            >
              BUILD THE FUTURE OF <br />
              <span className="text-brand">GLOBAL EDUCATION</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
            >
              Join JustTap Capital and help thousands of students reach their dream universities worldwide.
            </motion.p>
            <motion.div variants={itemVariants}>
              <a href="#positions" className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/50">
                View Openings
                <ArrowRight size={20} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Join JustTap Capital?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We are more than just a finance company; we are partners in a student's journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand/20 transition-all hover:shadow-xl group">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Open Positions</h2>
              <p className="text-slate-600">Find your next role with us.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-slate-600 shadow-sm border border-slate-100">All Departments</span>
            </div>
          </div>

          <div className="grid gap-6">
            {positions.map((job, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand/10 text-brand">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4 font-medium">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} />
                      Closing Soon
                    </span>
                  </div>
                  <p className="text-slate-600 max-w-2xl">{job.description}</p>
                </div>
                <button className="bg-white border-2 border-brand text-brand font-bold py-3 px-8 rounded-full hover:bg-brand hover:text-white transition-all">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-dark rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-brand-light/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <Briefcase className="w-12 h-12 text-brand-light mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Don't see a matching role?</h2>
              <p className="text-lg text-brand-light font-medium mb-10 max-w-xl mx-auto">
                We're always looking for talented individuals who share our passion for empowering students. Send us your CV and we'll let you know when a suitable opening arises.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:justtapcapital3204@gmail.com" className="bg-white text-brand-dark px-10 py-4 rounded-full font-bold hover:bg-brand-light hover:text-white transition-all">
                  Drop us your CV
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
