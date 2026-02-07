import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  courseStartQuarters,
  courseStartYears,
  degrees,
  fieldsOfInterest,
  admissionStatuses,
  allCountries,
  universities,
  publicBanksIndia,
  privateBanksIndia
} from '../../constants';
import './FurtherEducationSection.css';

const FurtherEducationSection = ({
  lead,
  setLead,
  handleChange,
  handleDateChange,
  renderSelectField,
  renderAutocompleteField,
  handleShowPrimeBanks,
  primeBankList,
  fetchedForUniversity
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBankIndex, setSelectedBankIndex] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [bankComparisons, setBankComparisons] = useState([]);
  const [publicBanks, setPublicBanks] = useState([]);
  const [privateBanks, setPrivateBanks] = useState([]);
  const [backendDataAvailable, setBackendDataAvailable] = useState(true);

  const handleOpenModal = async (index) => {
    setSelectedBankIndex(index);
    const bank = lead.approachedBanks[index];
    try {
      const response = await axios.get(`/api/bank-comparisons/${encodeURIComponent(bank.bankName)}`);
      const comparison = response.data;
      setModalContent({
        title: `Bank Details - ${bank.bankName}`,
        disadvantages: comparison.disadvantages || [],
        advantages: comparison.justTapAdvantages || []
      });
    } catch (error) {
      console.error('Failed to fetch bank comparison:', error);
      // Fallback to existing logic if backend fails
      const fallbackContent = getModalContent(bank);
      setModalContent(fallbackContent);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBankIndex(null);
  };

  const getModalContent = (bank) => {
    // Try to get comparison data from seeded list / backend
    const normalize = (s) => (s || '').toString().trim().toLowerCase();
    const name = normalize(bank.bankName);

    const getBankComparison = (bankName) => {
      if (!bankName) return null;
      const nm = normalize(bankName);

      // exact
      let comp = bankComparisons.find(c => normalize(c.bankName) === nm);
      if (comp) return comp;

      // partial / contains
      comp = bankComparisons.find(c => normalize(c.bankName).includes(nm) || nm.includes(normalize(c.bankName)));
      if (comp) return comp;

      // token match
      const tokens = nm.split(/\s+/).filter(Boolean);
      if (tokens.length > 0) {
        comp = bankComparisons.find(c => {
          const cn = normalize(c.bankName);
          return tokens.every(t => cn.includes(t));
        });
        if (comp) return comp;
      }

      // abbreviations
      const abbrMap = {
        sbi: 'Public Banks',
        pnb: 'Punjab National Bank ',
        bob: 'Bank of Baroda',
        ubi: 'Union Bank Of India',
        boi: 'Bank of India',
        canara: 'Canara Bank',
        kvb: 'Private Banks',
        credila: 'Credila',
        usd: 'USD Lenders',
        prodigy: 'USD Lenders',
        mpower: 'USD Lenders',
        hdfc: 'Private Banks',
        icici: 'Private Banks',
        axis: 'Private Banks',
        kotak: 'Private Banks',
        idbi: 'Private Banks',
        indusind: 'Private Banks'
      };
      if (abbrMap[nm]) {
        comp = bankComparisons.find(c => normalize(c.bankName) === normalize(abbrMap[nm]));
        if (comp) return comp;
      }

      // classify public/private
      const isPublic = publicBanksIndia.some(pb => pb.toLowerCase().includes((bankName || '').toLowerCase()) || (bankName || '').toLowerCase().includes(pb.toLowerCase()));
      const isPrivate = privateBanksIndia.some(pb => pb.toLowerCase().includes((bankName || '').toLowerCase()) || (bankName || '').toLowerCase().includes(pb.toLowerCase()));
      const classification = isPublic ? 'Public Banks' : (isPrivate ? 'Private Banks' : 'Private Banks');
      console.log(`Bank: ${bankName}, isPublic: ${isPublic}, isPrivate: ${isPrivate}, classification: ${classification}`);
      const result = bankComparisons.find(c => normalize(c.bankName) === normalize(classification)) || null;
      console.log(`Found comparison:`, result);
      return result;
    };

    const comparison = getBankComparison(bank.bankName);
    if (comparison) {
      return {
        title: `Bank Details - ${bank.bankName}`,
        disadvantages: comparison.disadvantages || [],
        advantages: comparison.justTapAdvantages || []
      };
    }

    // fallback to existing messages
    if (bank.loanSanctioned === false) {
      return {
        title: `Bank Details - ${bank.bankName}`,
        disadvantages: [
          `Very long processing time: Another issue that most of my students are facing recently, is the long processing time being taken at ${bank.bankName}. Though they are very quick with logging in the file, after the login the files are stuck for months and months without a single update.`
        ],
        advantages: [
          'Through JustTapCapital, it\'s our promise that your entire process will be completed within 7-10 working days after the submission of all required documents.'
        ]
      };
    } else if (bank.loanSanctioned === true) {
      return {
        title: `Bank Details - ${bank.bankName}`,
        disadvantages: [
          `Disbursement issues: Though they promise a very smooth process. Most of my students who have taken loans from ${bank.bankName} have repeatedly shared their concerns that as their disbursement process takes too long, they were unable to pay their fees on time and faced a lot of issues due to not having enough funds on time.`
        ],
        advantages: [
          'Here at JustTapCapital, to tackle this issue we have a dedicated Post Sanction team who will be helping you with all your issues related to sanction letter, disbursement delay and their guidance goes up to your repayment as well.'
        ]
      };
    }
    return null;
  };

  // Fetch bank comparisons from backend
  useEffect(() => {
    const fetchBankComparisons = async () => {
      try {
        const [allResponse, publicResponse, privateResponse] = await Promise.all([
          axios.get('/api/bank-comparisons'),
          axios.get('/api/bank-comparisons/type/public'),
          axios.get('/api/bank-comparisons/type/private')
        ]);
        console.log('Bank comparisons fetched:', allResponse.data);
        setBankComparisons(allResponse.data);
        setPublicBanks(publicResponse.data);
        setPrivateBanks(privateResponse.data);
        setBackendDataAvailable(true);
      } catch (err) {
        console.error('Failed to fetch bank comparisons:', err);
        // minimal fallback scenarios
        setBankComparisons([
          { bankName: 'Public Banks', disadvantages: ['Very Long processing time', 'Living expenses disbursement'], justTapAdvantages: ['Competitive Interest Rates'] },
          { bankName: 'Private Banks', disadvantages: ['Very High Interest Rates'], justTapAdvantages: ['Competitive Interest Rates'] }
        ]);
        setPublicBanks([]);
        setPrivateBanks([]);
        setBackendDataAvailable(false);
      }
    };
    fetchBankComparisons();
  }, []);

  return (
    <div className="section-block">
      <h1 className="ed-details-section-title">🎓 Further Education Details</h1>

      <div className="further-education-fields">
        {renderSelectField("courseStartMonth", "Course Start Month", lead.courseStartMonth, handleChange, courseStartQuarters)}
        {renderSelectField("courseStartYear", "Course Start Year", lead.courseStartYear, handleChange, courseStartYears)}
        {renderSelectField("degree", "Degree", lead.degree, handleChange, degrees)}
        {renderSelectField("fieldOfInterest", "Field of Interest", lead.fieldOfInterest, handleChange, fieldsOfInterest)}
        {renderAutocompleteField("interestedCountries", "Interested Countries", lead.interestedCountries, handleChange, allCountries)}
        {renderSelectField("admissionStatus", "Admission Status", lead.admissionStatus, handleChange, admissionStatuses)}

        {lead.admissionStatus === 'Applied - No Admit Yet' && (
          <div className="date-field" style={{ width: '100%' }}>
            <label>Expected Admit Date</label>
            <input
              type="date"
              value={lead.expectedAdmitDate ? new Date(lead.expectedAdmitDate).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                handleDateChange('expectedAdmitDate', e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
        )}

        {lead.admissionStatus === 'Not Yet Applied' && (
          <div className="date-field" style={{ width: '100%' }}>
            <label>Expected Application Date</label>
            <input
              type="date"
              value={lead.expectedApplicationDate ? new Date(lead.expectedApplicationDate).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                handleDateChange('expectedApplicationDate', e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
        )}

        {renderAutocompleteField("admittedUniversities", "Admitted Universities", lead.admittedUniversities, handleChange, universities)}
      </div>

      <div className="form-section_ed">
  <fieldset>
    <legend>Has the student already approached any bank? *</legend>

    <div className="radio-group_ed">
      <label>
        <input
          type="radio"
          name="approachedAnyBank"
          value="true"
          checked={lead.approachedAnyBank === true}
          onChange={handleChange}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="approachedAnyBank"
          value="false"
          checked={lead.approachedAnyBank === false}
          onChange={handleChange}
        />
        No
      </label>
    </div>
  </fieldset>

  {lead.approachedAnyBank && (
    <div className="bank-section_ed">
      <label className="section-label_ed">Approached Banks</label>

      {lead.approachedBanks.map((bank, index) => (
        <div key={index} className="bank-card_ed">

          <div className="bank-row_ed">
            <input
              type="text"
              placeholder="Bank Name"
              value={bank.bankName}
              onChange={(e) => {
                const newBanks = [...lead.approachedBanks];
                newBanks[index].bankName = e.target.value;
                setLead(prev => ({ ...prev, approachedBanks: newBanks }));
              }}
            />

            <button
              type="button"
              className="remove-btn_ed"
              onClick={() => {
                const newBanks = lead.approachedBanks.filter((_, i) => i !== index);
                setLead(prev => ({ ...prev, approachedBanks: newBanks }));
              }}
            >
              Remove
            </button>
          </div>

          <fieldset>
            <legend>Has the file been logged in?</legend>

            <div className="radio-group_ed">
              <label>
                <input
                  type="radio"
                  name={`fileLoggedIn-${index}`}
                  value="true"
                  checked={bank.fileLoggedIn === true}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].fileLoggedIn = e.target.value === 'true';
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
                Yes
              </label>

              <label>
                <input
                  type="radio"
                  name={`fileLoggedIn-${index}`}
                  value="false"
                  checked={bank.fileLoggedIn === false}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].fileLoggedIn = e.target.value === 'true';
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
                No
              </label>
            </div>
          </fieldset>

          {/* {bank.fileLoggedIn === false && (
            <div className="info-box_ed">
              <h4>Advantages of going with Justap:</h4>
              <ul>
                <li>Direct tie-ups for faster processing</li>
                <li>Expert guidance reducing rejection chances</li>
                <li>Dedicated loan advisor</li>
              </ul>
            </div>
          )} */}

          {bank.fileLoggedIn === true && (
            <fieldset>
              <legend>Has the loan been sanctioned?</legend>

              <div className="radio-group_ed">
                <label>
                  <input
                    type="radio"
                    name={`loanSanctioned-${index}`}
                    value="true"
                    checked={bank.loanSanctioned === true}
                    onChange={(e) => {
                      const newBanks = [...lead.approachedBanks];
                      newBanks[index].loanSanctioned = e.target.value === 'true';
                      setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                    }}
                  />
                  Yes
                </label>

                <label>
                  <input
                    type="radio"
                    name={`loanSanctioned-${index}`}
                    value="false"
                    checked={bank.loanSanctioned === false}
                    onChange={(e) => {
                      const newBanks = [...lead.approachedBanks];
                      newBanks[index].loanSanctioned = e.target.value === 'true';
                      setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                    }}
                  />
                  No
                </label>
              </div>
            </fieldset>
          )}

          {bank.loanSanctioned === true && (
            <div className="sanction-box_ed">
              <h4>Sanction Details</h4>

              <div className="form-grid_ed">
                <input
                  type="number"
                  placeholder="Loan Amount"
                  value={bank.sanctionDetails?.loanAmount || ''}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, loanAmount: e.target.value };
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Rate of Interest (%)"
                  value={bank.sanctionDetails?.rateOfInterest || ''}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, rateOfInterest: e.target.value };
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
                <input
                  type="number"
                  placeholder="Processing Fee"
                  value={bank.sanctionDetails?.processingFee || ''}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, processingFee: e.target.value };
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
                <input
                  type="text"
                  placeholder="Insurance"
                  value={bank.sanctionDetails?.insurance || ''}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, insurance: e.target.value };
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
                <input
                  type="text"
                  placeholder="PSM"
                  value={bank.sanctionDetails?.psm || ''}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, psm: e.target.value };
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
                <input
                  type="text"
                  placeholder="Co-Applicant"
                  value={bank.sanctionDetails?.coApplicant || ''}
                  onChange={(e) => {
                    const newBanks = [...lead.approachedBanks];
                    newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, coApplicant: e.target.value };
                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                  }}
                />
              </div>

              <fieldset>
                <legend style={{paddingTop: '10px'}}>Type of Loan</legend>
                <div className="radio-group_ed">
                  <label>
                    <input
                      type="radio"
                      name={`typeOfLoan-${index}`}
                      value="secured"
                      checked={bank.sanctionDetails?.typeOfLoan === 'secured'}
                      onChange={(e) => {
                        const newBanks = [...lead.approachedBanks];
                        newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, typeOfLoan: e.target.value };
                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                      }}
                    />
                    Secured Loan
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`typeOfLoan-${index}`}
                      value="unsecured"
                      checked={bank.sanctionDetails?.typeOfLoan === 'unsecured'}
                      onChange={(e) => {
                        const newBanks = [...lead.approachedBanks];
                        newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, typeOfLoan: e.target.value };
                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                      }}
                    />
                    Unsecured Loan
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend style={{paddingTop: '10px'}}>PF Paid?</legend>
                <div className="radio-group_ed">
                  <label>
                    <input
                      type="radio"
                      name={`pfPaid-${index}`}
                      value="true"
                      checked={bank.sanctionDetails?.pfPaid === true}
                      onChange={(e) => {
                        const newBanks = [...lead.approachedBanks];
                        newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, pfPaid: e.target.value === 'true' };
                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                      }}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`pfPaid-${index}`}
                      value="false"
                      checked={bank.sanctionDetails?.pfPaid === false}
                      onChange={(e) => {
                        const newBanks = [...lead.approachedBanks];
                        newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, pfPaid: e.target.value === 'true' };
                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                      }}
                    />
                    No
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend style={{paddingTop: '10px'}}>Disbursement Done?</legend>
                <div className="radio-group_ed">
                  <label>
                    <input
                      type="radio"
                      name={`disbursementDone-${index}`}
                      value="true"
                      checked={bank.sanctionDetails?.disbursementDone === true}
                      onChange={(e) => {
                        const newBanks = [...lead.approachedBanks];
                        newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, disbursementDone: e.target.value === 'true' };
                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                      }}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`disbursementDone-${index}`}
                      value="false"
                      checked={bank.sanctionDetails?.disbursementDone === false}
                      onChange={(e) => {
                        const newBanks = [...lead.approachedBanks];
                        newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, disbursementDone: e.target.value === 'true' };
                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                      }}
                    />
                    No
                  </label>
                </div>
              </fieldset>
            </div>
          )}

          {bank.loanSanctioned === false && (
            <div className="button-container_ed">
              <button
                type="button"
                className="modal-trigger-btn_ed"
                onClick={() => handleOpenModal(index)}
              >
                ✨ Open Details
              </button>
            </div>
          )}

          {bank.loanSanctioned === true && (
            <div className="button-container_ed">
              <button
                type="button"
                className="modal-trigger-btn_ed"
                onClick={() => handleOpenModal(index)}
              >
                ✨ Open Details
              </button>
            </div>
          )}

        </div>
      ))}

      <button
        type="button"
        className="add-btn_ed"
        onClick={() => {
          const newBanks = [
            ...lead.approachedBanks,
            { bankName: '', fileLoggedIn: false, loanSanctioned: false, sanctionDetails: {} }
          ];
          setLead(prev => ({ ...prev, approachedBanks: newBanks }));
        }}
      >
        + Add Bank
      </button>
    </div>
  )}
</div>

          


      <div className="info-box">
        Enter a university and click the button below to check the prime university list.
      </div>

      <button className="prime-btn" onClick={handleShowPrimeBanks}>
        PRIME UNIVERSITY LIST
      </button>

      {primeBankList.length > 0 && (
        <div className="table-wrapper">
          <h4>Prime Banks for "{fetchedForUniversity}"</h4>

          <table>
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Max Loan Amount</th>
              </tr>
            </thead>
            <tbody>
              {primeBankList.map((bank, index) => (
                <tr key={index}>
                  <td>{bank.bankName}</td>
                  <td className="amount">{bank.maxLoanAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && modalContent && (
        <div className="modal-overlay_ed" onClick={handleCloseModal}>
          <div className="modal-content_ed" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn_ed" onClick={handleCloseModal}>
              ✕
            </button>

            <h2 className="modal-title_ed">
              {modalContent.title}
            </h2>

            <div className="modal-body_ed">
              <div className="modal-section_ed">
                <h3>Disadvantages of {lead.approachedBanks[selectedBankIndex]?.bankName}</h3>
                <ul className="disadvantages-list_ed">
                  {modalContent.disadvantages.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="divider_ed"></div>

              <div className="modal-section_ed">
                <h3>Advantages of JTC</h3>
                <ul className="advantages-list_ed">
                  {modalContent.advantages.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="modal-close-action-btn_ed" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default FurtherEducationSection;
