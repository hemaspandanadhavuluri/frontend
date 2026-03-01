import React, { useEffect, useState, useRef } from 'react';
import './Hero.css';
import StudentForm from '../StudentForm';

const Hero = () => {
    const [offset, setOffset] = useState(0);
    const [isCallback, setIsCallback] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToForm = (callbackMode) => {
        setIsCallback(callbackMode);
        setShowForm(true);

        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    // allow closing the form container manually if needed
    const closeForm = () => {
        setShowForm(false);
    };

    return (
        <>
            <section id="hero" className="hero-section">

                {/* Floating Shapes */}
                <div
                    className="shape shape-1"
                    style={{ transform: `translateY(${offset * 0.2}px)` }}
                ></div>

                <div
                    className="shape shape-2"
                    style={{ transform: `translateY(${offset * -0.3}px)` }}
                ></div>

                <div
                    className="shape shape-3"
                    style={{ transform: `translateY(${offset * 0.1}px)` }}
                ></div>

                <div className="hero-content">
                    <span className="hero-badge">
                        Education Finance Experts
                    </span>

                    <h1 className="hero-title">
                        <span className="solid-text">
                            Empowering
                        </span>
                        <br />
                        <span className="gradient-text">
                            Your Dreams.
                        </span>
                    </h1>

                    <p className="hero-subtitle">
                        We connect you with the right banks for your education loans
                        and help you secure your future abroad.
                    </p>

                    <div className="hero-cta">
                        <button
                            onClick={() => handleScrollToForm(false)}
                            className="cta-button primary"
                        >
                            Website Sign Up
                        </button>

                        <button
                            onClick={() => handleScrollToForm(true)}
                            className="cta-button secondary"
                        >
                            Request a Call Back
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <span className="scroll-text">Scroll to explore</span>
                    <div className="line"></div>
                </div>
            </section>

            {/* Student Form Section rendered below hero */}
            {showForm && (
                <div className="hero-form-container" ref={formRef}>
                    <StudentForm
                        isEmbedded={true}
                        isCallback={isCallback}
                        onSuccess={() => setShowForm(false)}
                    />
                </div>
            )}
        </>
    );
};

export default Hero;