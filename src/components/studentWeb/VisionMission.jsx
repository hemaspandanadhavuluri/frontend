import React from 'react';
import './VisionMission.css';

const VisionMission = () => {
    return (
        <section id="vision" className="vision-section">
            <div className="vision-container">
                <div className="vision-card">
                    <div className="card-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </div>
                    <h3>Our Vision</h3>
                    <p>To be the world's most trusted partner in global education, empowering students to transcend borders and achieve their highest potential.</p>
                </div>
                <div className="vision-card highlight-card">
                    <div className="card-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <h3>Our Mission</h3>
                    <p>To provide comprehensive, transparent, and personalized guidance for international education, ensuring every student finds their perfect academic and financial fit.</p>
                </div>
                <div className="vision-card">
                    <div className="card-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h3>Our Values</h3>
                    <p>Integrity, Excellence, and Student-Centricity are at the core of everything we do. We believe in building lasting relationships based on trust and results.</p>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;
