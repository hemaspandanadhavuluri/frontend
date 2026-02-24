import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { countries } from '../data/countries';
import './CountryPage.css';

const CountryPage = () => {
    const { countryId } = useParams();
    const navigate = useNavigate();
    const country = countries[countryId];

    useEffect(() => {
        // Scroll to top when country changes
        window.scrollTo(0, 0);
    }, [countryId]);

    if (!country) {
        return (
            <div className="not-found">
                <h2>Country Not Found</h2>
                <button onClick={() => navigate('/')} className="back-btn">Go Home</button>
            </div>
        );
    }

    return (
        <div className="country-page">
            <section className="country-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${country.heroImage})` }}>
                <div className="hero-content">
                    <h1>Study in {country.displayName}</h1>
                    <p>{country.overview}</p>
                    <button className="cta-button primary">Free Counseling</button>
                </div>
            </section>

            <div className="content-container">
                <section className="section reasons">
                    <h2>Why Study in {country.name}?</h2>
                    <div className="grid">
                        {country.reasons.map((reason, index) => (
                            <div key={index} className="card reason-card">
                                <p>{reason}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section education-system">
                    <h2>Education System</h2>
                    <p className="description-text">{country.educationSystem}</p>
                </section>

                <div className="two-column">
                    <section className="section courses">
                        <h2>Popular Courses</h2>
                        <ul className="list-group">
                            {country.popularCourses.map((course, index) => (
                                <li key={index}>{course}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="section universities">
                        <h2>Top Universities</h2>
                        <ul className="list-group">
                            {country.topUniversities.map((uni, index) => (
                                <li key={index}>{uni}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <section className="section requirements">
                    <h2>Eligibility & Requirements</h2>
                    <p className="description-text">{country.requirements}</p>
                </section>

                <section className="section cost">
                    <h2>Cost of Study</h2>
                    <div className="cost-grid">
                        <div className="cost-card">
                            <h3>Tuition Fees</h3>
                            <p>{country.cost.tuition}</p>
                        </div>
                        <div className="cost-card">
                            <h3>Living Expenses</h3>
                            <p>{country.cost.living}</p>
                        </div>
                    </div>
                </section>

                <section className="section scholarships">
                    <h2>Scholarships</h2>
                    <p className="description-text">{country.scholarships}</p>
                </section>

                <div className="two-column">
                    <section className="section visa">
                        <h2>Visa Process</h2>
                        <p className="description-text">{country.visaInfo}</p>
                    </section>

                    <section className="section work">
                        <h2>Post-Study Work</h2>
                        <p className="description-text">{country.workOpportunities}</p>
                    </section>
                </div>

                <section className="cta-section">
                    <h2>Ready to start your journey to {country.displayName}?</h2>
                    <button className="cta-button large">Apply Now</button>
                </section>
            </div>
        </div>
    );
};

export default CountryPage;
