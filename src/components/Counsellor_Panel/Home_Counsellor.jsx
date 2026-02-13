import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select';
import { API_URL, allCountries, countryPhoneCodes } from "../../constants";
import "./Counsellor_Stylling/Home_Counsellor.css";

const Home_Counsellor = ({ switchToLeads, currentUser }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    mobileCountryCode: '+91',
    interestedCountries: [],
    permanentLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalLeads: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser?._id) return;
      try {
        const response = await axios.get(`${API_URL}/stats/${currentUser._id}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchRecentSubmissions = async () => {
      if (!currentUser?._id) return;
      try {
        const response = await axios.get(`${API_URL}/counsellor/${currentUser._id}`);
        // Get the 5 most recent leads from the computed data
        const recentLeads = response.data.slice(0, 5);
        const mappedData = recentLeads.map(lead => ({
          name: lead.name,
          amount: lead.amount,
          country: lead.country,
          status: lead.status
        }));
        setRecentSubmissions(mappedData);
      } catch (error) {
        console.error('Error fetching recent submissions:', error);
      } finally {
        setRecentLoading(false);
      }
    };

    fetchStats();
    fetchRecentSubmissions();
  }, [currentUser?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountriesChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      interestedCountries: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const countryOptions = allCountries.map(country => ({
    value: country,
    label: country
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobileNumber) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const leadData = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumbers: [`${formData.mobileCountryCode} ${formData.mobileNumber}`],
        interestedCountries: formData.interestedCountries,
        permanentLocation: formData.permanentLocation,
        source: {
          source: currentUser?.consultancy || 'Unknown Consultancy',
          name: currentUser?.fullName || 'Unknown Counsellor',
          email: currentUser?.email || '',
          phoneNumber: currentUser?.phoneNumber || ''
        },
        counsellorId: currentUser?._id,
        counsellorName: currentUser?.fullName,
        counsellorEmail: currentUser?.email,
        leadStatus: 'New'
      };

      await axios.post(API_URL, leadData);

      setMessage('Lead submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        mobileNumber: '',
        mobileCountryCode: '+91',
        interestedCountries: [],
        permanentLocation: ''
      });

      // Refresh stats and recent submissions
      const refreshStats = async () => {
        try {
          const response = await axios.get(`${API_URL}/stats/${currentUser._id}`);
          setStats(response.data);
        } catch (error) {
          console.error('Error refreshing stats:', error);
        }
      };

      const refreshRecentSubmissions = async () => {
        try {
          const response = await axios.get(`${API_URL}/counsellor/${currentUser._id}`);
          // Get the 5 most recent leads from the computed data
          const recentLeads = response.data.slice(0, 5);
          const mappedData = recentLeads.map(lead => ({
            name: lead.name,
            amount: lead.amount,
            country: lead.country,
            status: lead.status
          }));
          setRecentSubmissions(mappedData);
        } catch (error) {
          console.error('Error refreshing recent submissions:', error);
        }
      };

      await refreshStats();
      await refreshRecentSubmissions();
    } catch (error) {
      console.error('Error submitting lead:', error);
      setMessage('Failed to submit lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hc-container">
      <div className="hc-top">
        <div className="hc-title">
          <h1>Welcome back, {currentUser?.fullName || 'Counsellor'}!</h1>
        </div>
        <button className="hc-alert-btn">🔔 Global Education Alerts</button>
      </div>

      <div className="hc-stats">
        {statsLoading ? (
          <StatCard label="Total Leads" value="..." />
        ) : (
          <StatCard label="Total Leads" value={stats.totalLeads.toString()} />
        )}
      </div>

      <div className="hc-main">
        <div className="hc-form-card">
          <h3>Submit New Student Lead</h3>
          <p className="hc-title p">Enter applicant details to initiate loan process.</p>
          
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="hc-section-label">Student Details</div>
            <div className="hc-form-grid">
              <input
                type="text"
                name="fullName"
                placeholder="Student's Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Student's Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  name="mobileCountryCode"
                  value={formData.mobileCountryCode}
                  onChange={handleInputChange}
                  style={{ width: '100px' }}
                >
                  {countryPhoneCodes.map(code => (
                    <option key={code.code} value={code.code}>
                      {code.code} ({code.name})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  style={{ flex: 1 }}
                />
              </div>
              <Select
                isMulti
                name="interestedCountries"
                options={countryOptions}
                value={countryOptions.filter(option => formData.interestedCountries.includes(option.value))}
                onChange={handleCountriesChange}
                placeholder="Select Interested Countries"
                isSearchable
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${state.isFocused ? '#ff8c33' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                    minHeight: '48px',
                    boxShadow: state.isFocused ? '0 0 0 1px #ff8c33' : 'none',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    padding: '2px 8px',
                    color: 'white',
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: 'rgba(255, 255, 255, 0.6)',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    background: 'rgba(255, 140, 51, 0.2)',
                    border: '1px solid rgba(255, 140, 51, 0.3)',
                    borderRadius: '4px',
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: 'white',
                    fontSize: '12px',
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': {
                      background: 'rgba(255, 140, 51, 0.3)',
                      color: 'white',
                    },
                  }),
                  indicatorSeparator: (provided) => ({
                    ...provided,
                    background: 'rgba(255, 255, 255, 0.1)',
                  }),
                  dropdownIndicator: (provided, state) => ({
                    ...provided,
                    color: state.isFocused ? 'white' : 'rgba(255, 255, 255, 0.6)',
                    '&:hover': {
                      color: 'white',
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                    marginTop: '4px',
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: 0,
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: 'white',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backgroundColor: state.isSelected
                      ? 'rgba(255, 140, 51, 0.2)'
                      : state.isFocused
                      ? 'rgba(255, 140, 51, 0.1)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 140, 51, 0.1)',
                    },
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                }}
              />
              <input
                type="text"
                name="permanentLocation"
                placeholder="Permanent Address"
                value={formData.permanentLocation}
                onChange={handleInputChange}
                required
                style = {{ gridColumn: 'span 2' }}
              />
            </div>

            <div className="hc-section-label">Counsellor & Consultancy Details</div>
            <div className="hc-form-grid">
              <input type="text" value={currentUser?.fullName || ''} readOnly />
              <input type="text" value={currentUser?.consultancy || 'no'} readOnly />
            </div>

            <button type="submit" className="hc-submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <div className="hc-sidebar">
          <div className="hc-recent-card">
            <div className="hc-recent-header">
              <h4>Recent Submissions</h4>
              <span
                style={{color:'#ff8c33', fontSize:'12px', cursor:'pointer'}}
                onClick={switchToLeads}
              >
                View All
              </span>
            </div>
            {recentSubmissions.map((sub, i) => (
              <div className="hc-recent-row" key={i}>
                <div className="hc-user-info">
                  <div className="name">{sub.name}</div>
                  <div className="details">{sub.amount} • {sub.country}</div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="hc-stat-card">
    <p>{label}</p>
    <h2>{value}</h2>
  </div>
);

export default Home_Counsellor;