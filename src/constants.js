// src/constants.js

export const EMPTY_LEAD_STATE = {
    // 1. Basic Info
    leadID: "", fullName: "", email: "", mobileNumbers: [], permanentLocation: "", currentAddress: "",
    state: "", region: "", zone: "", regionalHead: "", zonalHead: "", planningToStudy: "",
    source: { source: '', name: '', email: '', phoneNumber: '' }, 
    
    // 2. Education / Loan Info
    loanId: '', loanType: "", courseStartMonth: "", courseStartYear: "", degree: "",
    fieldOfInterest: "", interestedCountries: "", admitReceived: false, admittedUniversities: "",
    admissionStatus: "Not Yet Applied", approachedAnyBank: false, previousBankApproached: "",
    expectedAdmitDate: null, expectedApplicationDate: null,
    fileLoggedIn: null,
    loanSanctioned: null,
    sanctionDetails: {
        rateOfInterest: '',
        processingFeePaid: null,
        disbursementDone: null,
        coApplicant: '',
        loanSecurity: '',
        loanAmount: ''
    },
    courseDuration: "",
    
    // 4. Financial Info
    age: "", workExperience: "", hasStudentLoans: false,
    studentLoanDetails: "",
    fee: "", originalFee: "", originalFeeCurrency: "USD", conversionRate: "",
    living: "", otherExpenses: "", maxUnsecuredGivenByUBI: "",
    hasAssets: false, assets: [], listOfFOsServed: [], currentFO: "",
    studentAppliedDate: "", studentAppliedTime: "", assignedFO: "", assignedFOPhone: '',

    // 5. Family Info / Co-Applicant
    relations: [], // Will hold relation objects,
    ownHouseGuarantor: { // Expanded to a full object
        name: '',
        phoneNumber: '',
        relationshipType: '',
        employmentType: '',
        annualIncome: '',
        currentObligations: '',
        cibilScore: '',
        hasCibilIssues: false,
        cibilIssues: '',
    },

    // 6. References, Notes, etc.
    references: [
        { relationship: '', name: '', address: '', phoneNumber: '' },
        { relationship: '', name: '', address: '', phoneNumber: '' }
    ], 
    panStatus: "Not Interested", panNumber: "",
    referralList: [
        { name: "", code: "", phoneNumber: "" },
        { name: "", code: "", phoneNumber: "" },
        { name: "", code: "", phoneNumber: "" }
    ],
    collateralLocation: "", suggestedBank: "", lastCallDate: "", reminderCallDate: "",
    leadStatus: "No status", targetSanctionDate: "",    
    testScores: {
        GRE: "", IELTS: "", TOEFL: "", GMAT: "",
        SAT: "", PTE: "", ACT: "", DUOLINGO: "",
    },
    callHistory: [],
};

export const EMAIL_TEMPLATE_CONTENT = {
    'NL1': {
        subject: "Regarding Your Education Loan Inquiry",
        body: `<p>Dear [Student Name],</p><p>Thank you for your interest in an education loan with Justap. This is a follow-up on your application. We would like to discuss the next steps.</p><p>Best regards,<br/>The Justap Team</p>`
    },
    'NL2': {
        subject: "Follow-up: Your Education Loan Application",
        body: `<p>Dear [Student Name],</p><p>We are writing to follow up on your recent education loan inquiry. Please let us know if you have any questions or if there is anything we can assist you with.</p><p>Best regards,<br/>The Justap Team</p>`
    },
    'NL3(Normal)': {
        subject: "Important Update on Your Loan Application",
        body: `<p>Dear [Student Name],</p><p>This email contains important information regarding your loan application. Please review the details at your earliest convenience.</p><p>Best regards,<br/>The Justap Team</p>`
    },
    'NL3 (NBFC)': {
        subject: "Information Regarding Your NBFC Loan Option",
        body: `<p>Dear [Student Name],</p><p>We have an update regarding your education loan options with our NBFC partners. Please contact us to discuss the details.</p><p>Best regards,<br/>The Justap Team</p>`
    },

    // --- Bank Connection & Intro Templates ---
    'KVB Details -1st Email': {
        subject: "Education Loan Details from Karur Vysya Bank (KVB) via Justap",
        body: `
            <p>Dear [Student Name],</p>
            <p>Thank you for choosing Justap for your education loan needs. We are pleased to connect you with <strong>Karur Vysya Bank (KVB)</strong>, one of our trusted banking partners.</p>
            <p><strong>Why KVB through Justap?</strong></p>
            <ul>
                <li><strong>Streamlined Process:</strong> We simplify the application process, saving you time and effort.</li>
                <li><strong>Expert Guidance:</strong> Our team will guide you at every step, ensuring all paperwork is correct.</li>
                <li><strong>Competitive Rates:</strong> KVB offers competitive interest rates for aspiring students like you.</li>
            </ul>
            [UPLOAD_LINK_PLACEHOLDER]
            <p>Best regards,<br/>The Justap Team</p>`
    },
    'SBI Details 1st Email': {
        subject: "Your Education Loan Opportunity with State Bank of India (SBI) through Justap",
        body: `
            <p>Dear [Student Name],</p>
            <p>We're excited to guide you on your journey to secure an education loan. Based on your profile, we are connecting you with the <strong>State Bank of India (SBI)</strong>, the country's largest public sector bank, known for its reliable student loan schemes.</p>
            <p><strong>The Justap Advantage with SBI:</strong></p>
            <ul>
                <li><strong>Simplified Application:</strong> Avoid long queues and complex forms. We make the SBI application process smooth and digital.</li>
                <li><strong>Dedicated Support:</strong> You'll have a dedicated Justap advisor to help you prepare and submit your application to SBI.</li>
                <li><strong>Transparent Process:</strong> We ensure you understand all terms and conditions, providing full transparency.</li>
            </ul>
            [UPLOAD_LINK_PLACEHOLDER]
            <p>Best regards,<br/>The Justap Team</p>`
    },
    'Only Public Banks Connection Mail': {
        subject: "Connecting You with Leading Public Sector Banks for Your Education Loan",
        body: `
            <p>Dear [Student Name],</p>
            <p>As part of our commitment to finding you the best education loan, we are initiating your application with our network of leading <strong>Public Sector Banks (like SBI, BOB, etc.)</strong>.</p>
            <p>Public banks are known for their trust, wide reach, and government-backed schemes. By partnering with Justap, you get:</p>
            <ul>
                <li><strong>Expert Navigation:</strong> We know the ins and outs of public bank procedures and help you navigate them efficiently.</li>
                <li><strong>End-to-End Assistance:</strong> From document collection to submission, we are with you all the way.</li>
            </ul>
            [UPLOAD_LINK_PLACEHOLDER]
            <p>Best regards,<br/>The Justap Team</p>`
    },
    // NOTE: A generic template for Private Lenders. You can create more specific ones.
    'Only Priavte Lender Connection Mail': {
        subject: "Exploring Fast & Flexible Education Loan Options with Private Lenders",
        body: `
            <p>Dear [Student Name],</p>
            <p>To provide you with a wide range of options, we are also exploring education loan opportunities with our esteemed <strong>Private Banking and NBFC partners (like HDFC Credila, Avanse, etc.)</strong>.</p>
            <p>Private lenders often provide faster processing times and flexible criteria. With Justap, you benefit from:</p>
            <ul>
                <li><strong>Curated Options:</strong> We match your profile to the private lenders most likely to approve your loan.</li>
                <li><strong>Hassle-Free Coordination:</strong> We manage the communication, so you don't have to deal with multiple follow-ups.</li>
            </ul>
            [UPLOAD_LINK_PLACEHOLDER]
            <p>Best regards,<br/>The Justap Team</p>`
    },
    "Public and  Private Lender connection 1st Mail ": {
        subject: "Exploring Fast & Flexible Education Loan Options with Private Lenders",
        body: `
            <p>Dear [Student Name],</p>
            <p>To provide you with a wide range of options, we are also exploring education loan opportunities with our esteemed <strong>Public Banking Services</strong>.</p>
            <p>Private lenders often provide faster processing times and flexible criteria. With Justap, you benefit from:</p>
            <ul>
                <li><strong>Curated Options:</strong> We match your profile to the private lenders most likely to approve your loan.</li>
                <li><strong>Hassle-Free Coordination:</strong> We manage the communication, so you don't have to deal with multiple follow-ups.</li>
            </ul>
            [UPLOAD_LINK_PLACEHOLDER]
            <p>Best regards,<br/>The Justap Team</p>`
    },

    // --- Document Upload Templates ---
    'Documents Partially Uplaoded 2nd followup ': {
        subject: "Reminder: Action Required for Your Education Loan Application - Partial Documents Uploaded",
        body: `
            <p>Dear [Student Name],</p>
            <p>This is a friendly reminder regarding your education loan application with Justap. We noticed that you have partially uploaded your documents.</p>
            <p>To ensure your application proceeds smoothly and without delay, please complete the document upload process as soon as possible.</p>
            [UPLOAD_LINK_PLACEHOLDER]
            <p>Thank you for your prompt attention to this matter.</p>
            <p>Best regards,<br/>The Justap Team</p>`
    },
    'Documents Not Upaloded 2nd followup or beyond': {
        subject: "Urgent: Action Required for Your Education Loan Application - Documents Not Uploaded",
        body: `
            <p>Dear [Student Name],</p>
            <p>This is an urgent reminder regarding your education loan application with Justap. We have not yet received your required documents.</p>
            <p>To avoid any further delays in processing your application, please upload all necessary documents immediately.</p>
            [UPLOAD_LINK_PLACEHOLDER]
            <p>Your timely action is crucial. Please contact us if you are facing any difficulties.</p>
            <p>Best regards,<br/>The Justap Team</p>`
    },

    // --- Informational Templates for Issues & Situations ---
    'UBI Issues': {
        subject: "Handling Common UBI (Union Bank of India) Issues",
        body: `
            <p>When dealing with UBI, students sometimes face issues like processing delays or requests for specific documents not on the standard list. </p>
            <p><strong>Our Strategy:</strong></p>
            <ul>
                <li>We leverage our direct contacts at regional processing hubs to escalate and track the application.</li>
                <li>We pre-verify all documents to match UBI's specific requirements, reducing back-and-forth.</li>
            </ul>
            <p>Advise the student that we are actively managing the process to ensure a smoother experience.</p>`
    },
    'JUST TAP Intro': {
        subject: "Introduction to Justap's Services",
        body: `
            <p>Dear [Student Name],</p>
            <p>Welcome to Justap! We are here to simplify your education loan journey from start to finish.</p>
            <p><strong>How we help:</strong></p>
            <ul>
                <li><strong>Bank Matching:</strong> We analyze your profile to connect you with the most suitable public banks, private banks, and NBFCs.</li>
                <li><strong>Simplified Process:</strong> We digitize the application and guide you on all required documentation, saving you from multiple bank visits.</li>
                <li><strong>Expert Support:</strong> Our dedicated advisors provide support and follow up with banks on your behalf, ensuring a transparent and efficient process.</li>
            </ul>
            <p>We look forward to helping you secure the best possible loan for your future.</p>
            <p>Best regards,<br/>The Justap Team</p>`
    },
    'About ScholrShips': {
        subject: "Information on Scholarships",
        body: `
            <p>While Justap primarily focuses on education loans, we encourage students to explore scholarship opportunities to reduce their financial burden.</p>
            <p><strong>Key Points to Share:</strong></p>
            <ul>
                <li>Advise the student to check their university's financial aid website for available scholarships.</li>
                <li>Mention popular scholarship portals like 'Chevening', 'Fulbright', and others relevant to the student's destination country.</li>
                <li>Explain that securing a scholarship can also strengthen their loan application profile.</li>
            </ul>`
    },
    'Drawback of Self Funds': {
        subject: "Smart Financing: Why an Education Loan Can Be Better Than Self-Funding",
        body: `
            <p>Dear [Student Name],</p>
            <p>While using personal savings for education is an option, many students find that taking an education loan through Justap offers significant advantages:</p>
            <ul>
                <li><strong>Preserve Your Savings:</strong> Keep your family's savings intact for emergencies, investments, or other important life events.</li>
                <li><strong>Build Credit History:</strong> Repaying a loan responsibly is one of the best ways to build a strong credit score, which is crucial for your future financial life.</li>
                <li><strong>Tax Benefits:</strong> You can claim tax deductions on the interest paid on an education loan under Section 80E of the Income Tax Act.</li>
                <li><strong>Financial Independence:</strong> Taking a loan fosters a sense of responsibility and allows you to fund your own education.</li>
            </ul>
            <p>We can help you find a loan with competitive terms that aligns with your financial goals. Let's discuss how we can make this work for you.</p>
            <p>Best regards,<br/>The Justap Team</p>`
    },
    'Referal Program': {
        subject: "Refer a Friend to Justap & Earn Rewards!",
        body: `
            <p>Dear [Student Name],</p>
            <p>Did you know you can earn rewards by helping your friends achieve their study abroad dreams?</p>
            <p>Our referral program is simple: Introduce your friends to Justap. If they successfully secure an education loan with our help, you'll receive a referral bonus as a thank you from us!</p>
            <p>It's a win-win. Your friends get expert guidance for their education loan, and you get rewarded. Feel free to share our contact details or ask us for your unique referral link.</p>
            <p>Best regards,<br/>The Justap Team</p>`
    },
    'Non-Indian / Wrong Number': {
        subject: "Action Required: Please Verify Your Contact Information",
        body: `
            <p>Dear [Student Name],</p>
            <p>We are trying to reach you to discuss your education loan application, but it seems the phone number we have on file might be incorrect or is a non-Indian number which we are unable to connect to.</p>
            <p>To ensure we can provide you with timely updates and support, could you please reply to this email with your current and correct contact number?</p>
            <p>We apologize for any inconvenience and look forward to connecting with you soon.</p>
            <p>Best regards,<br/>The Justap Team</p>`
    },
    'About DHL': {
        subject: "Information Regarding Document Submission via DHL",
        body: `
            <p>Dear [Student Name],</p>
            <p>For certain international universities or specific loan requirements, physical copies of your documents may need to be couriered. We partner with DHL to make this process secure and reliable.</p>
            <p><strong>How it works:</strong></p>
            <ul>
                <li>Our team will inform you if and when a physical document submission is required.</li>
                <li>We will provide you with the necessary address details and instructions for the DHL shipment.</li>
                <li>Justap helps coordinate and track the shipment to ensure your documents reach their destination safely.</li>
            </ul>
            <p>Please wait for confirmation from your Justap advisor before sending any documents.</p>
            <p>Best regards,<br/>The Justap Team</p>`
    },
};

export const regions = ['North', 'South', 'East', 'West'];

export const referenceRelationships = ['Uncle', 'Aunt', 'Friend', 'Any other relatives']; // This is used for references

export const assetOwnerRelationships = ['Father', 'Mother', 'Uncle', 'Aunt', 'Cousin', 'Friend', 'Self'];

export const countryPhoneCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA/Canada' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
    { code: '+86', name: 'China' },
    { code: '+971', name: 'UAE' },
    { code: '+7', name: 'Russia' },
    { code: '+39', name: 'Italy' },
    { code: '+34', name: 'Spain' },
    { code: '+52', name: 'Mexico' },
    { code: '+55', name: 'Brazil' },
    { code: '+27', name: 'South Africa' },
    { code: '+31', name: 'Netherlands' },
    { code: '+32', name: 'Belgium' },
    { code: '+36', name: 'Hungary' },
    { code: '+41', name: 'Switzerland' },
    { code: '+43', name: 'Austria' },
    { code: '+45', name: 'Denmark' },
    { code: '+46', name: 'Sweden' },
    { code: '+47', name: 'Norway' },
    { code: '+48', name: 'Poland' },
    { code: '+54', name: 'Argentina' },
    { code: '+56', name: 'Chile' },
    { code: '+57', name: 'Colombia' },
    { code: '+58', name: 'Venezuela' },
    { code: '+60', name: 'Malaysia' },
    { code: '+62', name: 'Indonesia' },
    { code: '+63', name: 'Philippines' },
    { code: '+64', name: 'New Zealand' },
    { code: '+65', name: 'Singapore' },
    { code: '+66', name: 'Thailand' },
    { code: '+82', name: 'South Korea' },
    { code: '+84', name: 'Vietnam' },
    { code: '+90', name: 'Turkey' },
    { code: '+92', name: 'Pakistan' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+95', name: 'Myanmar' },
    { code: '+98', name: 'Iran' },
    { code: '+212', name: 'Morocco' },
    { code: '+213', name: 'Algeria' },
    { code: '+216', name: 'Tunisia' },
    { code: '+218', name: 'Libya' },
    { code: '+220', name: 'Gambia' },
    { code: '+221', name: 'Senegal' },
    { code: '+222', name: 'Mauritania' },
    { code: '+223', name: 'Mali' },
    { code: '+224', name: 'Guinea' },
    { code: '+225', name: 'Ivory Coast' },
    { code: '+226', name: 'Burkina Faso' },
    { code: '+227', name: 'Niger' },
    { code: '+228', name: 'Togo' },
    { code: '+229', name: 'Benin' },
    { code: '+230', name: 'Mauritius' },
    { code: '+231', name: 'Liberia' },
    { code: '+232', name: 'Sierra Leone' },
    { code: '+233', name: 'Ghana' },
    { code: '+234', name: 'Nigeria' },
    { code: '+235', name: 'Chad' },
    { code: '+236', name: 'Central African Republic' },
    { code: '+237', name: 'Cameroon' },
    { code: '+238', name: 'Cape Verde' },
    { code: '+239', name: 'Sao Tome and Principe' },
    { code: '+240', name: 'Equatorial Guinea' },
    { code: '+241', name: 'Gabon' },
    { code: '+242', name: 'Congo' },
    { code: '+243', name: 'DR Congo' },
    { code: '+244', name: 'Angola' },
    { code: '+245', name: 'Guinea-Bissau' },
    { code: '+248', name: 'Seychelles' },
    { code: '+249', name: 'Sudan' },
    { code: '+250', name: 'Rwanda' },
    { code: '+251', name: 'Ethiopia' },
    { code: '+252', name: 'Somalia' },
    { code: '+253', name: 'Djibouti' },
    { code: '+254', name: 'Kenya' },
    { code: '+255', name: 'Tanzania' },
    { code: '+256', name: 'Uganda' },
    { code: '+257', name: 'Burundi' },
    { code: '+258', name: 'Mozambique' },
    { code: '+260', name: 'Zambia' },
    { code: '+261', name: 'Madagascar' },
    { code: '+263', name: 'Zimbabwe' },
    { code: '+264', name: 'Namibia' },
    { code: '+265', name: 'Malawi' },
    { code: '+266', name: 'Lesotho' },
    { code: '+267', name: 'Botswana' },
    { code: '+268', name: 'Swaziland' },
    { code: '+269', name: 'Comoros' },
];

export const loanIssues = [
    "UBI Issues", "BOB Issues", "Overall Lender Issues - When Going Directly" , "HDFC Credilla Issues" ,"CANARA Bank Issues","PNB Issues",
    "Bank Of India (BOB )Issues","USD Lender Issues (PRODIGY/MPOWER)"
];

export const miscSituations = [
    "JUST TAP Intro",
    "About ScholrShips",
    "Drawback of Self Funds",
    "Referal Program",
    "Non-Indian / Wrong Number",
    "About DHL"
];

export const emailTemplates = [
    "Send Intro Mail",
    "Send Document List",
    "Send Reminder",
    "Send Sanction Mail",
];
export const NLTemplates = ['NL1', 'NL2' , 'NL3(Normal)', 'NL3 (NBFC)']
export const banksDocs = [
    "KVB Details -1st Email",
    "SBI Details 1st Email",
    "Only Public Banks Connection Mail",
    "Only Priavte Lender Connection Mail",
    "Public and  Private Lender connection 1st Mail ",
    "Vidya loans Details 1st Email"

];

export const documentStatus = [
    "Documents Partially Uplaoded 2nd followup ",
"Documents Not Upaloded 2nd followup or beyond" ,
];

export const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
];

export const indianCitiesWithState = [
    "Port Blair, Andaman and Nicobar Islands",
    "Adoni, Andhra Pradesh", "Amaravati, Andhra Pradesh", "Anantapur, Andhra Pradesh", "Chittoor, Andhra Pradesh",
    "Dowlaiswaram, Andhra Pradesh", "Eluru, Andhra Pradesh", "Guntur, Andhra Pradesh", "Kadapa, Andhra Pradesh",
    "Kakinada, Andhra Pradesh", "Kurnool, Andhra Pradesh", "Machilipatnam, Andhra Pradesh", "Nandyal, Andhra Pradesh",
    "Nellore, Andhra Pradesh", "Ongole, Andhra Pradesh", "Rajahmundry, Andhra Pradesh", "Srikakulam, Andhra Pradesh",
    "Tirupati, Andhra Pradesh", "Vijayawada, Andhra Pradesh", "Visakhapatnam, Andhra Pradesh", "Vizianagaram, Andhra Pradesh",
    "Itanagar, Arunachal Pradesh",
    "Dhuburi, Assam", "Dibrugarh, Assam", "Dispur, Assam", "Guwahati, Assam", "Jorhat, Assam", "Nagaon, Assam",
    "Sivasagar, Assam", "Silchar, Assam", "Tezpur, Assam", "Tinsukia, Assam",
    "Ara, Bihar", "Barauni, Bihar", "Begusarai, Bihar", "Bettiah, Bihar", "Bhagalpur, Bihar", "Bihar Sharif, Bihar",
    "Bodh Gaya, Bihar", "Buxar, Bihar", "Chapra, Bihar", "Darbhanga, Bihar", "Dehri, Bihar", "Dinapur Nizamat, Bihar",
    "Gaya, Bihar", "Hajipur, Bihar", "Jamalpur, Bihar", "Katihar, Bihar", "Madhubani, Bihar", "Motihari, Bihar",
    "Munger, Bihar", "Muzaffarpur, Bihar", "Patna, Bihar", "Purnia, Bihar", "Pusa, Bihar", "Saharsa, Bihar",
    "Samastipur, Bihar", "Sasaram, Bihar", "Sitamarhi, Bihar", "Siwan, Bihar",
    "Chandigarh, Chandigarh",
    "Ambikapur, Chhattisgarh", "Bhilai, Chhattisgarh", "Bilaspur, Chhattisgarh", "Dhamtari, Chhattisgarh",
    "Durg, Chhattisgarh", "Jagdalpur, Chhattisgarh", "Raipur, Chhattisgarh", "Rajnandgaon, Chhattisgarh",
    "Silvassa, Dadra and Nagar Haveli and Daman and Diu",
    "Daman, Dadra and Nagar Haveli and Daman and Diu", "Diu, Dadra and Nagar Haveli and Daman and Diu",
    "Delhi, Delhi", "New Delhi, Delhi",
    "Madgaon, Goa", "Panaji, Goa",
    "Ahmadabad, Gujarat", "Amreli, Gujarat", "Bharuch, Gujarat", "Bhavnagar, Gujarat", "Bhuj, Gujarat",
    "Dwarka, Gujarat", "Gandhinagar, Gujarat", "Godhra, Gujarat", "Jamnagar, Gujarat", "Junagadh, Gujarat",
    "Kandla, Gujarat", "Khambhat, Gujarat", "Kheda, Gujarat", "Mahesana, Gujarat", "Morbi, Gujarat",
    "Nadiad, Gujarat", "Navsari, Gujarat", "Okha, Gujarat", "Palanpur, Gujarat", "Patan, Gujarat",
    "Porbandar, Gujarat", "Rajkot, Gujarat", "Surat, Gujarat", "Surendranagar, Gujarat", "Valsad, Gujarat",
    "Veraval, Gujarat",
    "Ambala, Haryana", "Bhiwani, Haryana", "Chandigarh, Haryana", "Faridabad, Haryana", "Firozpur Jhirka, Haryana",
    "Gurugram, Haryana", "Hansi, Haryana", "Hisar, Haryana", "Jind, Haryana", "Kaithal, Haryana",
    "Karnal, Haryana", "Kurukshetra, Haryana", "Panipat, Haryana", "Pehowa, Haryana", "Rewari, Haryana",
    "Rohtak, Haryana", "Sirsa, Haryana", "Sonipat, Haryana",
    "Bilaspur, Himachal Pradesh", "Chamba, Himachal Pradesh", "Dalhousie, Himachal Pradesh", "Dharmshala, Himachal Pradesh",
    "Hamirpur, Himachal Pradesh", "Kangra, Himachal Pradesh", "Kullu, Himachal Pradesh", "Mandi, Himachal Pradesh",
    "Nahan, Himachal Pradesh", "Shimla, Himachal Pradesh", "Una, Himachal Pradesh",
    "Anantnag, Jammu and Kashmir", "Baramula, Jammu and Kashmir", "Doda, Jammu and Kashmir", "Gulmarg, Jammu and Kashmir",
    "Jammu, Jammu and Kashmir", "Kathua, Jammu and Kashmir", "Leh, Jammu and Kashmir", "Punch, Jammu and Kashmir",
    "Rajauri, Jammu and Kashmir", "Srinagar, Jammu and Kashmir", "Udhampur, Jammu and Kashmir",
    "Bokaro, Jharkhand", "Chaibasa, Jharkhand", "Deoghar, Jharkhand", "Dhanbad, Jharkhand", "Dumka, Jharkhand",
    "Giridih, Jharkhand", "Hazaribag, Jharkhand", "Jamshedpur, Jharkhand", "Jharia, Jharkhand", "Rajmahal, Jharkhand",
    "Ranchi, Jharkhand", "Saraikela, Jharkhand",
    "Badami, Karnataka", "Ballari, Karnataka", "Bengaluru, Karnataka", "Belgavi, Karnataka", "Bhadravati, Karnataka",
    "Bidar, Karnataka", "Chikkamagaluru, Karnataka", "Chitradurga, Karnataka", "Davangere, Karnataka",
    "Halebid, Karnataka", "Hassan, Karnataka", "Hubballi-Dharwad, Karnataka", "Kalaburagi, Karnataka",
    "Kolar, Karnataka", "Madikeri, Karnataka", "Mandya, Karnataka", "Mangaluru, Karnataka", "Mysuru, Karnataka",
    "Raichur, Karnataka", "Shivamogga, Karnataka", "Shravanabelagola, Karnataka", "Shrirangapattana, Karnataka",
    "Tumakuru, Karnataka", "Vijayapura, Karnataka",
    "Alappuzha, Kerala", "Badagara, Kerala", "Idukki, Kerala", "Kannur, Kerala", "Kochi, Kerala", "Kollam, Kerala",
    "Kottayam, Kerala", "Kozhikode, Kerala", "Mattancheri, Kerala", "Palakkad, Kerala", "Thalassery, Kerala",
    "Thiruvananthapuram, Kerala", "Thrissur, Kerala",
    "Kargil, Ladakh", "Leh, Ladakh",
    "Kavaratti, Lakshadweep",
    "Balaghat, Madhya Pradesh", "Barwani, Madhya Pradesh", "Betul, Madhya Pradesh", "Bharhut, Madhya Pradesh",
    "Bhind, Madhya Pradesh", "Bhopal, Madhya Pradesh", "Burhanpur, Madhya Pradesh", "Chhatarpur, Madhya Pradesh",
    "Chhindwara, Madhya Pradesh", "Damoh, Madhya Pradesh", "Datia, Madhya Pradesh", "Dewas, Madhya Pradesh",
    "Dhar, Madhya Pradesh", "Guna, Madhya Pradesh", "Gwalior, Madhya Pradesh", "Hoshangabad, Madhya Pradesh",
    "Indore, Madhya Pradesh", "Itarsi, Madhya Pradesh", "Jabalpur, Madhya Pradesh", "Jhabua, Madhya Pradesh",
    "Khajuraho, Madhya Pradesh", "Khandwa, Madhya Pradesh", "Khargone, Madhya Pradesh", "Maheshwar, Madhya Pradesh",
    "Mandla, Madhya Pradesh", "Mandsaur, Madhya Pradesh", "Mhow, Madhya Pradesh", "Morena, Madhya Pradesh",
    "Murwara, Madhya Pradesh", "Narsimhapur, Madhya Pradesh", "Narsinghgarh, Madhya Pradesh", "Narwar, Madhya Pradesh",
    "Neemuch, Madhya Pradesh", "Nowgong, Madhya Pradesh", "Orchha, Madhya Pradesh", "Panna, Madhya Pradesh",
    "Raisen, Madhya Pradesh", "Rajgarh, Madhya Pradesh", "Ratlam, Madhya Pradesh", "Rewa, Madhya Pradesh",
    "Sagar, Madhya Pradesh", "Sarangpur, Madhya Pradesh", "Satna, Madhya Pradesh", "Sehore, Madhya Pradesh",
    "Seoni, Madhya Pradesh", "Shahdol, Madhya Pradesh", "Shajapur, Madhya Pradesh", "Sheopur, Madhya Pradesh",
    "Shivpuri, Madhya Pradesh", "Ujjain, Madhya Pradesh", "Vidisha, Madhya Pradesh",
    "Ahmadnagar, Maharashtra", "Akola, Maharashtra", "Amravati, Maharashtra", "Aurangabad, Maharashtra",
    "Bhandara, Maharashtra", "Bhusawal, Maharashtra", "Bid, Maharashtra", "Buldhana, Maharashtra",
    "Chandrapur, Maharashtra", "Daulatabad, Maharashtra", "Dhule, Maharashtra", "Jalgaon, Maharashtra",
    "Kalyan, Maharashtra", "Karli, Maharashtra", "Kolhapur, Maharashtra", "Mahabaleshwar, Maharashtra",
    "Malegaon, Maharashtra", "Matheran, Maharashtra", "Mumbai, Maharashtra", "Nagpur, Maharashtra",
    "Nanded, Maharashtra", "Nashik, Maharashtra", "Osmanabad, Maharashtra", "Pandharpur, Maharashtra",
    "Parbhani, Maharashtra", "Pune, Maharashtra", "Ratnagiri, Maharashtra", "Sangli, Maharashtra",
    "Satara, Maharashtra", "Sevagram, Maharashtra", "Solapur, Maharashtra", "Thane, Maharashtra",
    "Ulhasnagar, Maharashtra", "Vasai-Virar, Maharashtra", "Wardha, Maharashtra", "Yavatmal, Maharashtra",
    "Imphal, Manipur",
    "Cherrapunji, Meghalaya", "Shillong, Meghalaya",
    "Aizawl, Mizoram", "Lunglei, Mizoram",
    "Kohima, Nagaland", "Mon, Nagaland", "Phek, Nagaland", "Wokha, Nagaland", "Zunheboto, Nagaland",
    "Balangir, Odisha", "Baleshwar, Odisha", "Baripada, Odisha", "Bhubaneshwar, Odisha", "Brahmapur, Odisha",
    "Cuttack, Odisha", "Dhenkanal, Odisha", "Kendujhar, Odisha", "Konark, Odisha", "Koraput, Odisha",
    "Paradip, Odisha", "Phulabani, Odisha", "Puri, Odisha", "Sambalpur, Odisha", "Udayagiri, Odisha",
    "Karaikal, Puducherry", "Mahe, Puducherry", "Puducherry, Puducherry", "Yanam, Puducherry",
    "Amritsar, Punjab", "Batala, Punjab", "Chandigarh, Punjab", "Faridkot, Punjab", "Firozpur, Punjab",
    "Gurdaspur, Punjab", "Hoshiarpur, Punjab", "Jalandhar, Punjab", "Kapurthala, Punjab", "Ludhiana, Punjab",
    "Nabha, Punjab", "Patiala, Punjab", "Rupnagar, Punjab", "Sangrur, Punjab",
    "Abu, Rajasthan", "Ajmer, Rajasthan", "Alwar, Rajasthan", "Amer, Rajasthan", "Barmer, Rajasthan",
    "Beawar, Rajasthan", "Bharatpur, Rajasthan", "Bhilwara, Rajasthan", "Bikaner, Rajasthan", "Bundi, Rajasthan",
    "Chittaurgarh, Rajasthan", "Churu, Rajasthan", "Dhaulpur, Rajasthan", "Dungarpur, Rajasthan", "Ganganagar, Rajasthan",
    "Hanumangarh, Rajasthan", "Jaipur, Rajasthan", "Jaisalmer, Rajasthan", "Jalor, Rajasthan", "Jhalawar, Rajasthan",
    "Jhunjhunu, Rajasthan", "Jodhpur, Rajasthan", "Kishangarh, Rajasthan", "Kota, Rajasthan", "Merta, Rajasthan",
    "Nagaur, Rajasthan", "Nathdwara, Rajasthan", "Pali, Rajasthan", "Phalodi, Rajasthan", "Pushkar, Rajasthan",
    "Sawai Madhopur, Rajasthan", "Shahpura, Rajasthan", "Sikar, Rajasthan", "Sirohi, Rajasthan", "Tonk, Rajasthan",
    "Udaipur, Rajasthan",
    "Gangtok, Sikkim", "Gyalshing, Sikkim", "Lachung, Sikkim", "Mangan, Sikkim",
    "Arcot, Tamil Nadu", "Chengalpattu, Tamil Nadu", "Chennai, Tamil Nadu", "Chidambaram, Tamil Nadu",
    "Coimbatore, Tamil Nadu", "Cuddalore, Tamil Nadu", "Dharmapuri, Tamil Nadu", "Dindigul, Tamil Nadu",
    "Erode, Tamil Nadu", "Kanchipuram, Tamil Nadu", "Kanniyakumari, Tamil Nadu", "Kodaikanal, Tamil Nadu",
    "Kumbakonam, Tamil Nadu", "Madurai, Tamil Nadu", "Mamallapuram, Tamil Nadu", "Nagappattinam, Tamil Nadu",
    "Nagercoil, Tamil Nadu", "Palayamkottai, Tamil Nadu", "Pudukkottai, Tamil Nadu", "Rajapalayam, Tamil Nadu",
    "Ramanathapuram, Tamil Nadu", "Salem, Tamil Nadu", "Srirangam, Tamil Nadu", "Thanjavur, Tamil Nadu",
    "Tiruchchirappalli, Tamil Nadu", "Tirunelveli, Tamil Nadu", "Tiruppur, Tamil Nadu", "Thoothukudi, Tamil Nadu",
    "Udhagamandalam, Tamil Nadu", "Vellore, Tamil Nadu",
    "Adilabad, Telangana", "Hyderabad, Telangana", "Karimnagar, Telangana", "Khammam, Telangana", "Mahbubnagar, Telangana",
    "Nizamabad, Telangana", "Sangareddi, Telangana", "Warangal, Telangana",
    "Agartala, Tripura",
    "Agra, Uttar Pradesh", "Aligarh, Uttar Pradesh", "Amroha, Uttar Pradesh", "Ayodhya, Uttar Pradesh",
    "Azamgarh, Uttar Pradesh", "Bahraich, Uttar Pradesh", "Ballia, Uttar Pradesh", "Banda, Uttar Pradesh",
    "Bara Banki, Uttar Pradesh", "Bareilly, Uttar Pradesh", "Basti, Uttar Pradesh", "Bijnor, Uttar Pradesh",
    "Bithur, Uttar Pradesh", "Budaun, Uttar Pradesh", "Bulandshahr, Uttar Pradesh", "Chitrakut, Uttar Pradesh",
    "Deoria, Uttar Pradesh", "Etah, Uttar Pradesh", "Etawah, Uttar Pradesh", "Faizabad, Uttar Pradesh",
    "Farrukhabad-cum- Fatehgarh, Uttar Pradesh", "Fatehpur, Uttar Pradesh", "Fatehpur Sikri, Uttar Pradesh",
    "Ghaziabad, Uttar Pradesh", "Ghazipur, Uttar Pradesh", "Gonda, Uttar Pradesh", "Gorakhpur, Uttar Pradesh",
    "Hamirpur, Uttar Pradesh", "Hardoi, Uttar Pradesh", "Hathras, Uttar Pradesh", "Jalaun, Uttar Pradesh",
    "Jaunpur, Uttar Pradesh", "Jhansi, Uttar Pradesh", "Kannauj, Uttar Pradesh", "Kanpur, Uttar Pradesh",
    "Lakhimpur, Uttar Pradesh", "Lalitpur, Uttar Pradesh", "Lucknow, Uttar Pradesh", "Mainpuri, Uttar Pradesh",
    "Mathura, Uttar Pradesh", "Meerut, Uttar Pradesh", "Mirzapur-Vindhyachal, Uttar Pradesh", "Modinagar, Uttar Pradesh",
    "Moradabad, Uttar Pradesh", "Muzaffarnagar, Uttar Pradesh", "Partapgarh, Uttar Pradesh", "Pilibhit, Uttar Pradesh",
    "Prayagraj, Uttar Pradesh", "Rae Bareli, Uttar Pradesh", "Rampur, Uttar Pradesh", "Saharanpur, Uttar Pradesh",
    "Sambhal, Uttar Pradesh", "Shahjahanpur, Uttar Pradesh", "Sitapur, Uttar Pradesh", "Sultanpur, Uttar Pradesh",
    "Tehri, Uttar Pradesh", "Varanasi, Uttar Pradesh",
    "Almora, Uttarakhand", "Dehra Dun, Uttarakhand", "Haridwar, Uttarakhand", "Mussoorie, Uttarakhand",
    "Nainital, Uttarakhand", "Pithoragarh, Uttarakhand",
    "Alipore, West Bengal", "Alipur Duar, West Bengal", "Asansol, West Bengal", "Baharampur, West Bengal",
    "Bally, West Bengal", "Balurghat, West Bengal", "Bankura, West Bengal", "Baranagar, West Bengal",
    "Barasat, West Bengal", "Barrackpore, West Bengal", "Basirhat, West Bengal", "Bhatpara, West Bengal",
    "Bishnupur, West Bengal", "Budge Budge, West Bengal", "Burdwan, West Bengal", "Chandernagore, West Bengal",
    "Darjeeling, West Bengal", "Diamond Harbour, West Bengal", "Dum Dum, West Bengal", "Durgapur, West Bengal",
    "Halisahar, West Bengal", "Haora, West Bengal", "Hugli, West Bengal", "Ingraj Bazar, West Bengal",
    "Jalpaiguri, West Bengal", "Kalimpong, West Bengal", "Kamarhati, West Bengal", "Kanchrapara, West Bengal",
    "Kharagpur, West Bengal", "Cooch Behar, West Bengal", "Kolkata, West Bengal", "Krishnanagar, West Bengal",
    "Malda, West Bengal", "Midnapore, Bengal", "Murshidabad, West Bengal", "Nabadwip, West Bengal",
    "Palashi, West Bengal", "Panihati, West Bengal", "Purulia, West Bengal", "Raiganj, West Bengal",
    "Santipur, West Bengal", "Shantiniketan, West Bengal", "Shrirampur, West Bengal", "Siliguri, West Bengal",
    "Siuri, West Bengal", "Tamluk, West Bengal", "Titagarh, West Bengal"
];

export const currencies = [
    { code: 'USD', label: 'USD to INR', symbol: '$' },
    { code: 'GBP', label: 'GBP to INR', symbol: '£' },
    { code: 'CAD', label: 'CAD to INR', symbol: 'C$' },
    { code: 'EUR', label: 'EURO to INR', symbol: '€' },
    { code: 'AUD', label: 'AUD to INR', symbol: 'A$' },
    { code: 'NZD', label: 'NZD to INR', symbol: 'NZ$' },
    { code: 'AED', label: 'AED to INR', symbol: 'د.إ' },
];

export const courseStartQuarters = ['Jan-March', 'April-June', 'July-Sept', 'Oct-Dec'];

const currentYear = new Date().getFullYear();
export const courseStartYears = Array.from({ length: 5 }, (_, i) => String(currentYear + i));

export const degrees = ['Masters', 'Graduation', 'PhD','MBBS','UG Certificate','PG Certificate'];

export const fieldsOfInterest = [
    'Computer Science', 'Data Science & Analytics', 'Business Administration (MBA)', 'Engineering (Mechanical, Electrical, etc.)', 
    'Medicine & Healthcare', 'Arts & Humanities', 'Law', 'Finance & Accounting', 'Hospitality & Tourism'
];

export const admissionStatuses = ['Received Admission', 'Applied - No Admit Yet', 'Not Yet Applied'];

export const universities = [
    'Harvard University', 'Stanford University', 'Massachusetts Institute of Technology (MIT)', 'University of Oxford',
    'University of Cambridge', 'California Institute of Technology (Caltech)', 'ETH Zurich', 'National University of Singapore (NUS)',
    'University of Toronto', 'Technical University of Munich'
];

export const employmentTypes = ['Salaried', 'Self-employed', 'Retired', 'Not Employed', 'Agriculture'];

export const courseDurations = ['1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'];

export const allCountries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export const API_URL = 'http://localhost:5000/api/leads';
 
export const MOCK_USER_FULLNAME = 'FO 1 (Mock)';

// New constants for the Assets section
export const assetTypes = ['Physical Property', 'Fixed Deposit', 'LIC Policy', 'Government Bond'];
export const physicalPropertyTypes = ['House', 'Flat', 'Non-agricultural Land', 'Commercial Property'];
export const propertyAuthorities = ['Gram Panchayat', 'Municipality'];
export const licPolicyTypes = ['Term', 'Life'];

// --- NEW: Reasons for Lead Statuses ---
export const leadStatusOptions = ['No status', 'On Priority', 'Sanctioned', 'Application Incomplete', 'Close'];

export const priorityReasons = ['Admit received', 'University Shortlisted', 'Nearest Intake'];

export const closeReasons = ['Not Interested', 'Not lifting', 'Not eligible for loan'];