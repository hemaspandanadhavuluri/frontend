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
    courseDuration: "",
    
    // 4. Financial Info
    age: "", workExperience: "", hasStudentLoans: false,
    fee: "", living: "", otherExpenses: "", maxUnsecuredGivenByUBI: "",
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
    }
};

export const regions = ['North', 'South', 'East', 'West'];

export const referenceRelationships = ['Uncle', 'Aunt', 'Friend', 'Any other relatives'];

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

export const employmentTypes = ['Salaried', 'Self-employed', 'Retired', 'Not Employed'];

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