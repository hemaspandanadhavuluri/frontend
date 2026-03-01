import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
    {
        question: "How much education funding can I secure?",
        answer: "We offer up to 100% financing for your tuition, living expenses, and travel costs. Our plans are tailored to your university's specific requirements."
    },
    {
        question: "Do I need collateral to apply?",
        answer: "Not necessarily. We specialize in non-collateral loans up to 75 Lakhs for eligible profiles, focusing on your academic merit rather than family assets."
    },
    {
        question: "How long does the approval process take?",
        answer: "Our streamlined digital process typically ensures sanction letters within 3-5 working days after document submission."
    },
    {
        question: "Can I pay off the loan early?",
        answer: "Yes, we negotiate flexible repayment terms including nil or minimal foreclosure charges, allowing you to become debt-free faster."
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <div className="section-header text-center">
                    <h2 className="section-title"><span style={{color:'#fff'}}>Common</span> <span className="highlight-text">Queries</span></h2>
                    <p className="section-subtitle" style={{color:'#fff'}}>Clarifying your path to global education.</p>
                </div>

                <div className="faq-grid" style={{color: '#fff'}}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <span className="faq-toggle">{activeIndex === index ? '−' : '+'}</span>
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
