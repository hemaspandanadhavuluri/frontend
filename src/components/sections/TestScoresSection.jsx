import React from 'react';
import './TestScoresSection.css';

const TestScoresSection = ({ lead, handleNestedChange, renderTextField }) => {
    return (
        <div className="section-block">
            <h1 style={{ color: '#512967', fontWeight: 'bold' ,fontSize:'24px'}}>📝Test Scores</h1>
            <div className="test-scores-fields">
                {renderTextField("GRE", "GRE (200-990)", lead.testScores.GRE, (e) => handleNestedChange('testScores', e), "field-quarter")}
                {renderTextField("IELTS", "IELTS (0-9)", lead.testScores.IELTS, (e) => handleNestedChange('testScores', e), "field-quarter")}
                {renderTextField("TOEFL", "TOEFL (0-120)", lead.testScores.TOEFL, (e) => handleNestedChange('testScores', e), "field-quarter")}
                {renderTextField("GMAT", "GMAT (200-800)", lead.testScores.GMAT, (e) => handleNestedChange('testScores', e), "field-quarter")}
                {renderTextField("SAT", "SAT (400-1600)", lead.testScores.SAT, (e) => handleNestedChange('testScores', e), "field-quarter")}
                {renderTextField("PTE", "PTE (10-90)", lead.testScores.PTE, (e) => handleNestedChange('testScores', e), "field-quarter")}
                {renderTextField("ACT", "ACT (1-36)", lead.testScores.ACT, (e) => handleNestedChange('testScores', e), "field-quarter")}
                {renderTextField("DUOLINGO", "DuoLingo (10-160)", lead.testScores.DUOLINGO, (e) => handleNestedChange('testScores', e), "field-quarter")}
            </div>
        </div>
    );
};

export default TestScoresSection;
