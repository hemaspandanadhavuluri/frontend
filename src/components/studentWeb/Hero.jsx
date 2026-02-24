import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="hero" className="hero-section">
            {/* Abstract Floating Shapes */}
            <div className="shape shape-1" style={{ transform: `translateY(${offset * 0.2}px)` }}></div>
            <div className="shape shape-2" style={{ transform: `translateY(${offset * -0.3}px)` }}></div>
            <div className="shape shape-3" style={{ transform: `translateY(${offset * 0.1}px)` }}></div>

            <div className="hero-content">
                <span className="hero-badge">Education Finance Experts</span>
                <h1 className="hero-title">
                    <span style={{ color: '#222222', WebkitTextFillColor: '#222222' }}>Empowering</span> <br />
                    <span className="gradient-text">Your Dreams.</span>
                </h1>
                <p className="hero-subtitle">
                    We connect you with the right banks for your education loans and help you secure your future abroad.
                </p>
                <div className="hero-cta">
                    <a href="#student-form" className="cta-button primary">Start Your Journey</a>
                    <a href="#contact" className="cta-button secondary">Watch Video</a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <span className="scroll-text">Scroll to explore</span>
                <div className="line"></div>
            </div>
        </section>
    );
};

export default Hero;
