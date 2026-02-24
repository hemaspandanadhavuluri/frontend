import React from 'react';
import './WhyChooseUs.css';

const features = [
    {
        id: '01',
        title: 'Zero Collateral',
        desc: 'Unlock 100% funding without pledging assets. We value your potential over your property.',
        icon: '💎'
    },
    {
        id: '02',
        title: 'Visa Assurance',
        desc: 'Our financial proofs are trusted globally, guaranteeing a 99.8% visa success rate for our students.',
        icon: '📜'
    },
    {
        id: '03',
        title: 'Prime Rates',
        desc: 'Exclusive agreements with top banks ensure you get the lowest interest rates in the market.',
        icon: '📉'
    },
    {
        id: '04',
        title: 'Global Reach',
        desc: 'Direct admissions access to 500+ Ivy League & Premium universities across 15+ countries.',
        icon: '🌍'
    }
];

const team = [
    { name: 'Dr. Sarah Johnson', role: 'Head of Finance', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop' },
    { name: 'Mr. David Lee', role: 'Visa Strategist', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop' },
    { name: 'Ms. Priya Patel', role: 'Senior Counselor', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
    { name: 'James Wilson', role: 'Admissions Lead', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop' },
];

const WhyChooseUs = () => {
    return (
        <section id="why-us" className="combined-section">
            {/* Why Choose Us - Luxury Editorial Cards */}
            <div className="why-us-wrapper">
                <div className="section-header text-center">
                    <h2 className="section-title">The <span className="highlight-text">Gold Standard</span></h2>
                    <p className="section-subtitle">Excellence in every detail of your journey.</p>
                </div>

                <div className="luxury-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className="luxury-card">
                            <span className="card-number">{feature.id}</span>
                            <div className="card-content">
                                <div className="card-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                            <div className="card-border"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meet Our Team - Expanding Accordion (Kept as is) */}
            <div className="team-wrapper" id="team">
                <div className="section-header text-center">
                    <h2 className="section-title">The <span className="highlight-text">Architects</span></h2>
                    <p className="section-subtitle">Meet the minds behind your success.</p>
                </div>

                <div className="accordion-container">
                    {team.map((member, idx) => (
                        <div key={idx} className="accordion-item" style={{ backgroundImage: `url(${member.img})` }}>
                            <div className="accordion-overlay">
                                <div className="member-info">
                                    <h3>{member.name}</h3>
                                    <span>{member.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
