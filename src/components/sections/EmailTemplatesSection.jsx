import React from 'react';
import { NLTemplates, banksDocs, documentStatus, loanIssues, miscSituations,loanCalculator } from '../../constants';
import './EmailTemplatesSection.css';

const EmailTemplatesSection = ({ handleOpenEmailModal, emailMessage }) => {
    return (
        <div className="section-block">
            <div className="space-y-6">
                <div className="template-section">
                    <h4 className="section-title">NL Normal</h4>
                    <div className="button-group">{NLTemplates.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="template-btn nl-normal-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                </div>
                <div className="template-section">
                    <h4 className="section-title">Banks Connection - Intro & Docs Upload</h4>
                    <div className="button-group">{banksDocs.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="template-btn banks-docs-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                </div>
                <div className="template-section">
                    <h4 className="section-title">Document Upload</h4>
                    <div className="button-group">{loanCalculator.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="template-btn document-upload-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                </div>
                {emailMessage && (
                    <div className="email-message">{emailMessage}</div>
                )}
                <div className="template-section">
                    <h4 className="section-title">Loan Calculators</h4>
                    <div className="button-group">
                        {/* <button type="button" className="template-btn loan-calculator-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>EDUCATION LOAN EMI CALCULATOR</button>
                        <button type="button" className="template-btn loan-calculator-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>$ USD TO INR EDUCATION LOAN CALCULATOR</button>
                        <button type="button" className="template-btn loan-calculator-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>Saves Lakhs By Educational Loan Transfer</button>
                        <button type="button" className="template-btn loan-calculator-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>EL TAX Rebate Calculator</button> */}
                        <div className="button-group">{documentStatus.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="template-btn loan-calculator-btn"><svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>

                    </div>
                </div>
                <hr/>
                <div>
                    <h4 className="text-lg font-semibold mb-2">Banks Related - Issues</h4>
                    <div className="flex flex-wrap gap-2">{loanIssues.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-80 flex items-center loan-issues-btn"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.2-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-2">Miscellaneous Situations</h4>
                    <div className="flex flex-wrap gap-2">{miscSituations.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-80 flex items-center misc-situations-btn"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplatesSection;
