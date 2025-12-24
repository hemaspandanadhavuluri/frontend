import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, countryPhoneCodes } from '../constants';

// --- Dropdown Options ---
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"];
const NATIONALITIES = ["Indian", "US Citizen", "UK Citizen", "Canadian", "Australian", "Other"];
const STUDY_PLAN_OPTIONS = ["Planning to study in abroad", "Planning to study in India"];
const ADMISSION_STATUS_OPTIONS = ["Received admission", "Applied - no admit yet", "Not yet applied"];
const COURSE_START_MONTH_OPTIONS = ["Jan - March", "April - June", "July - Sept", "Oct - Dec"];
const LOAN_OPTIONS = ["Yes", "No"];

// --- Reusable Input Components ---
const SelectInput = ({ label, name, options, value, onChange, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
            {options.map(option => {
                // Handle both simple arrays and object arrays for options
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                return <option key={optionValue} value={optionValue}>{optionLabel}</option>
            })}
        </select>
    </div>
);

const TextInput = ({ label, name, value, onChange, type = 'text', placeholder = '', required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

const StudentForm = () => {
    const [step, setStep] = useState(1); // 1: Form Step 1, 2: Form Step 2, 3: OTP, 4: Success
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        nationality: NATIONALITIES[0],
        countryCode: countryPhoneCodes[0].code,
        contactNumber: '',
        permanentCity: CITIES[0],
        studyPlan: STUDY_PLAN_OPTIONS[0],
        admissionStatus: ADMISSION_STATUS_OPTIONS[0],
        courseStartMonth: COURSE_START_MONTH_OPTIONS[0],
        approachedBankForLoan: LOAN_OPTIONS[0],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const goToNextStep = (e) => {
        e.preventDefault();
        // Simple validation before proceeding
        if (step === 1 && (!formData.fullName || !formData.contactNumber)) {
            setError("Please fill in your name and contact number to proceed.");
            return;
        }
        setError('');
        setStep(step + 1);
    };

    // New simplified submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // Create the lead with all form data
            const leadPayload = {
                fullName: formData.fullName,
                email: formData.email,
                mobileNumbers: [`${formData.countryCode}-${formData.contactNumber}`],
                permanentLocation: formData.permanentCity,
                nationality: formData.nationality,
                planningToStudy: formData.studyPlan,
                admissionStatus: formData.admissionStatus,
                courseStartMonth: formData.courseStartMonth,
                approachedAnyBank: formData.approachedBankForLoan === 'Yes',
                source: { source: 'Website Form', name: 'Student Self-service' },
                leadStatus: 'New',
            };
            const response = await axios.post(API_URL, leadPayload);

            if (response.status === 201) {
                setMessage('Thank you! Your information has been submitted successfully. Our team will contact you shortly.');
                // Reset form to initial state and go back to the first step
                setFormData({ // Reset form
                    fullName: '', email: '', nationality: NATIONALITIES[0], countryCode: countryPhoneCodes[0].code,
                    contactNumber: '', permanentCity: CITIES[0], studyPlan: STUDY_PLAN_OPTIONS[0],
                    admissionStatus: ADMISSION_STATUS_OPTIONS[0], courseStartMonth: COURSE_START_MONTH_OPTIONS[0],
                    approachedBankForLoan: LOAN_OPTIONS[0],
                });
                setStep(1);
            } else {
                setError('There was an issue submitting your form. Please try again.');
            }
        } catch (err) {
            console.error('Lead Creation Error:', err);
            setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderFormStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={goToNextStep} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextInput label="Full Name" name="name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" />
                            <TextInput label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="you@example.com" required={false} />
                        </div>
                        <SelectInput label="Nationality" name="nationality" options={NATIONALITIES} value={formData.nationality} onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <SelectInput 
                                    label="Country Code" 
                                    name="countryCode" 
                                    options={countryPhoneCodes.map(c => ({ value: c.code, label: `${c.name} (${c.code})` }))}
                                    value={formData.countryCode} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2"><TextInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} type="tel" placeholder="9876543210" /></div>
                        </div>
                        <SelectInput label="Permanent Location (City)" name="permanentCity" options={CITIES} value={formData.permanentCity} onChange={handleChange} />
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Next: Study Details
                        </button>
                    </form>
                );
            case 2:
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <SelectInput label="Where are you planning to study?" name="studyPlan" options={STUDY_PLAN_OPTIONS} value={formData.studyPlan} onChange={handleChange} />
                        <SelectInput label="Status of College Admission" name="admissionStatus" options={ADMISSION_STATUS_OPTIONS} value={formData.admissionStatus} onChange={handleChange} />
                        <SelectInput label="Course Start Month" name="courseStartMonth" options={COURSE_START_MONTH_OPTIONS} value={formData.courseStartMonth} onChange={handleChange} />
                        <SelectInput label="Have you approached any bank for an education loan?" name="approachedBankForLoan" options={LOAN_OPTIONS} value={formData.approachedBankForLoan} onChange={handleChange} />
                        <div className="flex items-center justify-between">
                            <button type="button" onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-800">Back</button>
                            <button type="submit" disabled={loading} className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Apply for an Education Loan</h1>
                <p className="text-gray-600 text-center mb-6">Fill out the form below and we'll get in touch with you.</p>
                
                {/* Updated message display logic */}
                {message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">{message}</div>}
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">{error}</div>}

                {renderFormStep()}
            </div>
        </div>
    );
};

export default StudentForm;