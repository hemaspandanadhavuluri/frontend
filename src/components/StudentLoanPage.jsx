import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './StudentLoanPage.css';
import Navbar from './studentWeb/Navbar';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CountryPage from './pages/CountryPage';
import Scholarship from './pages/Scholarship';
import ExamPage from './pages/ExamPage';
import Footer from './studentWeb/Footer';

function StudentLoanPage() {
  return (
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/study-abroad/:countryId" element={<CountryPage />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/exams/:examId" element={<ExamPage />} />
        </Routes>
        <Footer />
      </div>
  );
}

export default StudentLoanPage;