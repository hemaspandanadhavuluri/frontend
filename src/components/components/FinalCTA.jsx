import { motion } from 'framer-motion';
import StudentForm from '../StudentForm';

export default function FinalCTA({ onCheckEligibility }) {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none w-[600px] h-[600px]" />
        <div className="absolute top-0 left-0 bg-amber-300/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[400px] h-[400px]" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Start Your Study Abroad Journey <span className="text-yellow-300">Today</span>
            </h2>
            <p className="text-slate-100 text-lg mb-10 leading-relaxed max-w-md">
              Compare loans, find the right university, and secure your admission—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onCheckEligibility}
                className="bg-white text-brand px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-lg shadow-white/20"
              >
                Check Loan Eligibility
              </button>
              <button className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors">
                Apply for Admission
              </button>
            </div>
          </div>

        <StudentForm />
        </div>
      </div>
    </section>
  );
}
