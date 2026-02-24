import React from 'react';
import './Scholarship.css';

const Scholarship = () => {
    return (
        <div className="scholarship-page">
            <section className="scholarship-hero">
                <div className="hero-content">
                    <span className="badge">Coming Soon</span>
                    <h1>Merit Scholarship Program</h1>
                    <p>Unlock your potential with our upcoming performance-based scholarship initiative.</p>
                    <button className="cta-button primary" onClick={() => alert('Thanks for your interest! We will notify you soon.')}>
                        Get Notified
                    </button>
                </div>
            </section>

            <div className="content-container">
                <section className="info-section">
                    <h2>About the Program</h2>
                    <p>
                        We believe in rewarding excellence. Our upcoming scholarship program is designed to support
                        talented students who demonstrate exceptional aptitude. Selection will be based strictly on
                        performance in our proprietary assessment test.
                    </p>
                </section>

                <section className="preview-grid">
                    <div className="preview-card blurred">
                        <h3>Eligibility Criteria</h3>
                        <p>Details about academic requirements and age limits will be revealed soon.</p>
                        <span className="lock-icon">🔒 Program Under Development</span>
                    </div>
                    <div className="preview-card blurred">
                        <h3>Test Structure</h3>
                        <p>Information regarding the syllabus, duration, and format of the assessment.</p>
                        <span className="lock-icon">🔒 Program Under Development</span>
                    </div>
                    <div className="preview-card blurred">
                        <h3>Scholarship Amount</h3>
                        <p>Full and partial tuition waivers for top performers.</p>
                        <span className="lock-icon">🔒 Program Under Development</span>
                    </div>
                    <div className="preview-card blurred">
                        <h3>Timelines</h3>
                        <p>Application dates and test schedules to be announced.</p>
                        <span className="lock-icon">🔒 Program Under Development</span>
                    </div>
                </section>

                <section className="faq-preview">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-placeholder">
                        <p>Stay tuned for detailed FAQs regarding the application process and selection criteria.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Scholarship;
