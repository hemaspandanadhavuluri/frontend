import React from 'react';
import './Intro.css';

const Intro = () => {
    return (
        <section id="about" className="intro-section">
            <div className="intro-container">
                <div className="intro-content">
                    <h2 className="intro-title">Welcome to <br />Just Tap Capital</h2>
                    <div className="title-bar"></div>
                    <p className="intro-text">
                        We are the bridge between your dreams and global reality. Specializing in overseas education loans and university admissions, we ensure that financial constraints never stand in the way of your academic aspirations.
                    </p>
                    <p className="intro-text">
                        Our team of expert counselors and financial advisors work in parallel to provide you with a seamless experience, from choosing the right university to securing the best centralized loan options.
                    </p>
                    <button className="intro-btn">Read Our Story</button>
                </div>
                <div className="intro-image-wrapper">
                    <div className="intro-image">
                        {/* Placeholder for Intro Image */}
                        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1769&auto=format&fit=crop" alt="Consultation" />
                    </div>
                    <div className="experience-badge">
                        <span className="years">10+</span>
                        <span className="text">Years of <br />Excellence</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Intro;
