import React from 'react';
import './GlobalConnected.css';

const countries = [
    { name: 'USA', code: 'us' },
    { name: 'UK', code: 'gb' },
    { name: 'Canada', code: 'ca' },
    { name: 'Australia', code: 'au' },
    { name: 'Germany', code: 'de' },
    { name: 'New Zealand', code: 'nz' },
    { name: 'Ireland', code: 'ie' },
    { name: 'France', code: 'fr' }
];

const GlobalConnected = () => {
    return (
        <section id="connected" className="global-section">
            <div className="section-container">
                <h2 className="section-title">Worldwide <span className="highlight-text">Education Loan Support</span></h2>
                <p className="section-desc">We assist students in securing education loans for study opportunities in any country across the globe.</p>

                <div className="flags-grid">
                    {countries.map((country) => (
                        <div key={country.code} className="flag-item">
                            <div className="flag-circle">
                                <img
                                    src={`https://flagcdn.com/w80/${country.code}.png`}
                                    alt={`${country.name} Flag`}
                                    loading="lazy"
                                />
                            </div>
                            <span className="country-name">{country.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GlobalConnected;
