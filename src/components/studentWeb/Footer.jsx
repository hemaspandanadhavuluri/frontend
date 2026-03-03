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
                            <a 
                                href="https://www.facebook.com/share/1AkZvPQpFe/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                FB
                            </a>

                            <a 
                                href="https://x.com/justtapcapital?s=11"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                            >
                                TW
                            </a>

                            <a 
                                href="https://www.linkedin.com/company/just-tap-capital/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                LN
                            </a>

                            <a 
                                href="https://www.instagram.com/justtapcapital.official?igsh=MXJpcGVkejF4MHB2bg%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                IG
                            </a>
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
                            <p>H.no: 2-10 celebrity complex venalagadda jeedimetla village Quthubullapur, Suchitra, Hyderabad - 500067</p>
                        </div>
                        <div className="contact-item">
                            <span className="icon">📞</span>
                            <p>+91 8340863204</p>
                        </div>
                        <div className="contact-item">
                            <span className="icon">✉️</span>
                            <p>justtapcapital3204@gmail.com</p>
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