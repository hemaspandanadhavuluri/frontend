import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const testimonials = [
    {
        id: 1,
        name: 'Arjun Verma',
        role: 'Ms in CS, UofT',
        quote: 'Just Tap Capital made my dream reality. The loan process was 100% stress-free.',
        img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Sneha Reddy',
        role: 'MBA, LBS',
        quote: 'Their guidance on non-collateral loans was a game changer for my family.',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Rohan Mehta',
        role: 'MSc Data, TU Munich',
        quote: 'Professional, transparent, and incredibly fast. I got my sanction letter in 3 days.',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop'
    },
    {
        id: 4,
        name: 'Priya Sharma',
        role: 'MSc Finance, NYU',
        quote: 'Detailed comparisons and honest advice. They truly care about your career.',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop'
    },
    {
        id: 5,
        name: 'David Kim',
        role: 'BArch, Cornell',
        quote: 'Navigating international finance was scary until I found Just Tap Capital.',
        img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop'
    }
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(2); // Start in middle

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const getCardStyle = (index) => {
        const offset = (index - activeIndex + testimonials.length) % testimonials.length;

        // Logic to determine position: center (0), next (1), prev (last), or hidden
        if (index === activeIndex) return 'card-active';
        if (index === (activeIndex + 1) % testimonials.length) return 'card-next';
        if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) return 'card-prev';
        return 'card-hidden';
    };

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="section-header text-center">
                <h2 className="section-title">Global <span className="highlight-text">Voices</span></h2>
                <p className="section-subtitle">Real stories. Real Impact.</p>
            </div>

            <div className="deck-container">
                <div className="card-deck">
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className={`deck-card ${getCardStyle(index)}`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div className="deck-content">
                                <div className="deck-quote-icon">“</div>
                                <p>{item.quote}</p>
                                <div className="deck-author">
                                    <img src={item.img} alt={item.name} />
                                    <div>
                                        <h4>{item.name}</h4>
                                        <span>{item.role}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="deck-glow"></div>
                        </div>
                    ))}
                </div>

                <div className="deck-controls">
                    <button onClick={prevSlide} className="control-btn prev-btn">←</button>
                    <button onClick={nextSlide} className="control-btn next-btn">→</button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
