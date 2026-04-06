import Hero from './components/Hero'
import WhyChooseUs from './components/WhyChooseUs'
import Ecosystem from './components/Ecosystem'
import Partners from './components/Partners'
import UniversityMarquee from './components/UniversityMarquee'
import LoanSolutions from './components/LoanSolutions'
import LoanBenefits from './components/LoanBenefits'
import TestSupport from './components/TestSupport'
import Services from './components/Services'
import Process from './components/Process'
import Calculators from './components/Calculators'
import Testimonials from './components/Testimonials'
import Destinations from './components/Destinations'
import FinalCTA from './components/FinalCTA'
import Careers from './components/Careers'
import FAQ from './components/FAQ'
import Scholarships from './components/Scholarships'
import About from './components/About'
import StudentForm from './StudentForm'
import { useState, useEffect } from 'react'

// Custom SVG Icon Components to replace missing Lucide brand icons
const Linkedin = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

function StudentLoanPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderContent = () => {
    if (currentPage === 'careers') {
      return <Careers />;
    }
    if (currentPage === 'scholarships') {
      return <Scholarships />;
    }
    if (currentPage === 'about') {
      return <About />;
    }
    return (
      <>
        <Hero onCheckEligibility={() => setIsApplyModalOpen(true)} />
        <UniversityMarquee />
        <WhyChooseUs />
        <Ecosystem />
        <Partners />
        <LoanSolutions onCheckEligibility={() => setIsApplyModalOpen(true)} />
        <LoanBenefits />
        <Calculators onCheckEligibility={() => setIsApplyModalOpen(true)} />
        <TestSupport />
        <Services />
        <Process />
        <Testimonials />
        <Destinations />
        <FinalCTA onCheckEligibility={() => setIsApplyModalOpen(true)} />
        <FAQ />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">

      {/* HEADER */}
      <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <img src="/logo.jpg" alt="JustTap Capital Logo" className="h-16 w-auto object-contain" />
          </div>

          <nav className="hidden lg:flex gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className={`font-semibold transition-colors uppercase tracking-wider text-xs ${currentPage === 'home' ? 'text-brand' : 'text-slate-600 hover:text-brand'}`}>Study Abroad</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsApplyModalOpen(true); }} className={`font-semibold transition-colors uppercase tracking-wider text-xs ${isApplyModalOpen ? 'text-brand' : 'text-slate-600 hover:text-brand'}`}>Education Loans</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('scholarships'); }} className={`font-semibold transition-colors uppercase tracking-wider text-xs ${currentPage === 'scholarships' ? 'text-brand' : 'text-slate-600 hover:text-brand'}`}>Scholarships</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }} className={`font-semibold transition-colors uppercase tracking-wider text-xs ${currentPage === 'about' ? 'text-brand' : 'text-slate-600 hover:text-brand'}`}>About Us</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-bold text-slate-600 hover:text-brand transition-colors">
              Log In
            </button>
            <button 
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-brand/25"
            >
              Get Started
            </button>
          </div>

        </div>
      </header>


      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* MODAL FOR STUDENT FORM */}
      {isApplyModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setIsApplyModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl my-8 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <StudentForm isModal={true} onSuccess={() => setIsApplyModalOpen(false)} />
          </div>
        </div>
      )}


      {/* FOOTER */}
      <footer
        className="w-full py-16 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/footer-bg1.jpg')" }}
      >

        {/* Dark overlay */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Logo */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-1 rounded">
                  <img src="/logo.jpg" alt="JustTap Capital Logo" className="h-14 w-auto object-contain" />
                </div>
                <span className="text-xl font-bold text-orange-400">Just Tap Capital</span>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                Empowering students with the right education loans, admissions support,
                and global opportunities.
              </p>
            </div>


            {/* Explore */}
            <div>
              <h3 className="font-semibold text-white mb-4">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="text-gray-200 hover:text-white transition">Home</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }} className="text-gray-200 hover:text-white transition">About Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('scholarships'); }} className="text-gray-200 hover:text-white transition">Scholarships</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('careers'); }} className="text-gray-200 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition">Stories</a></li>
              </ul>
            </div>


            {/* Services */}
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-200 hover:text-white transition">Education Loans</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition">University Admission</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition">Visa Counseling</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition">Pre-departure</a></li>
              </ul>
            </div>


            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Get in Touch</h3>

              <p className="text-gray-200 mb-3 text-sm leading-relaxed">
                H.no: 2-10 Celebrity Complex, Venalagadda,  
                Jeedimetla Village, Quthubullapur,  
                Suchitra, Hyderabad - 500067
              </p>

              <p className="text-gray-200 text-sm flex items-center gap-2 mb-2">
                📞 +91 8340863204
              </p>

              <p className="text-gray-200 text-sm flex items-center gap-2">
                ✉️ justtapcapital3204@gmail.com
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a href="https://www.linkedin.com/company/just-tap-capital/" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/justtapcapital.official?igsh=MXJpcGVkejF4MHB2bg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/share/1FFQspqnc1/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

          </div>


          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-white/20 text-center">
            <p className="text-gray-300 text-sm">
              © 2024 Just Tap Capital. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  )
}

export default StudentLoanPage