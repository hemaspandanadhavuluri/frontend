import React from 'react';
import './Careers.css';

const Careers = () => {
    return (
        <div className="careers-page">
            <section className="careers-hero">
                <div className="careers-hero-content">
                    <h1>Join Our Vision</h1>
                    <p>Be part of a team that's redefining global consultancy.</p>
                    <a href="#open-positions" className="cta-button">View Openings</a>
                </div>
            </section>

            <section className="life-at-company">
                <h2>Life at Just Tap Capital</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <h3>Global Impact</h3>
                        <p>Work on projects that span continents and industries.</p>
                    </div>
                    <div className="benefit-card">
                        <h3>Innovation First</h3>
                        <p>We leverage the latest tech to solve complex problems.</p>
                    </div>
                    <div className="benefit-card">
                        <h3>Continuous Growth</h3>
                        <p>Learning budgets, mentorship, and career paths.</p>
                    </div>
                </div>
            </section>

            <section id="open-positions" className="open-positions">
                <h2>Open Positions</h2>
                <div className="job-list">
                    <div className="job-card">
                        <h3>Senior Financial Consultant</h3>
                        <p className="location">New York, NY (Hybrid)</p>
                        <button className="apply-btn">Apply Now</button>
                    </div>
                    <div className="job-card">
                        <h3>Full Stack Developer</h3>
                        <p className="location">Remote</p>
                        <button className="apply-btn">Apply Now</button>
                    </div>
                    <div className="job-card">
                        <h3>Marketing Strategist</h3>
                        <p className="location">London, UK</p>
                        <button className="apply-btn">Apply Now</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
