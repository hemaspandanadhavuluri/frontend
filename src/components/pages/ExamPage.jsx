import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { exams } from '../data/exams';
import './ExamPage.css';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const exam = exams[examId];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [examId]);

    if (!exam) {
        return (
            <div className="not-found">
                <h2>Exam Not Found</h2>
                <button onClick={() => navigate('/')} className="back-btn">Go Home</button>
            </div>
        );
    }

    return (
        <div className="exam-page">
            <section className="exam-hero">
                <div className="hero-content">
                    <span className="exam-badge">{exam.name}</span>
                    <h1>{exam.fullName}</h1>
                    <p>{exam.overview}</p>
                    <a href="#booking" className="cta-button primary">Book Counseling</a>
                </div>
            </section>

            <div className="content-container">
                <div className="exam-grid">
                    <div className="exam-card eligibility">
                        <h2>Eligibility</h2>
                        <p>{exam.eligibility}</p>
                    </div>

                    <div className="exam-card format">
                        <h2>Format & Scoring</h2>
                        <p><strong>Format:</strong> {exam.format}</p>
                        <p className="mt-2"><strong>Scoring:</strong> {exam.scoring}</p>
                    </div>

                    <div className="exam-card prep">
                        <h2>Preparation Support</h2>
                        <p>{exam.preparation}</p>
                        <ul className="feature-list">
                            <li>Expert Faculty</li>
                            <li>Mock Tests</li>
                            <li>Study Material</li>
                        </ul>
                    </div>
                </div>

                <section id="booking" className="booking-section">
                    <h2>Ready to Ace the {exam.name}?</h2>
                    <p>Join our coaching program and get your target score.</p>
                    <button className="cta-button large" onClick={() => alert('Booking feature coming soon!')}>Book Now</button>
                </section>
            </div>
        </div>
    );
};

export default ExamPage;
