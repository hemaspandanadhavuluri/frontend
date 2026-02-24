import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="contact" className="footer-section">
            <div className="footer-content">
                <div className="footer-main-grid">
                    {/* Brand Column */}
                    <div className="footer-brand-col">
                        <div className="brand-header">
                            <img src="/logo2.png" alt="Just Tap Capital" className="footer-logo" />
                            <h2 className="brand-name">Just Tap Capital</h2>
                        </div>
                        <p className="brand-desc">
                            Empowering students globally with seamless financial solutions.
                            We bridge the gap between ambition and reality.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">FB</a>
                            <a href="#" aria-label="Twitter">TW</a>
                            <a href="#" aria-label="LinkedIn">LN</a>
                            <a href="#" aria-label="Instagram">IG</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links-col">
                        <h4>Explore</h4>
                        <ul>
                            <li><a href="#hero">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#vision">Vision</a></li>
                            <li><a href="#testimonials">Stories</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-links-col">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">Education Loans</a></li>
                            <li><a href="#">University Admission</a></li>
                            <li><a href="#">Visa Counseling</a></li>
                            <li><a href="#">Pre-departure</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-contact-col">
                        <h4>Get in Touch</h4>
                        <div className="contact-item">
                            <span className="icon">📍</span>
                            <p>123 Education Lane, Global City, NY 10001</p>
                        </div>
                        <div className="contact-item">
                            <span className="icon">📞</span>
                            <p>+1 (555) 123-4567</p>
                        </div>
                        <div className="contact-item">
                            <span className="icon">✉️</span>
                            <p>hello@justtapcapital.com</p>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Just Tap Capital. All rights reserved.</p>
                    <div className="bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
