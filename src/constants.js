// src/constants.js

export const EMPTY_LEAD_STATE = {
    // 1. Basic Info
    leadID: "", fullName: "", email: "", mobileNumbers: [], permanentLocation: "", currentAddress: "",
    state: "", region: "", zone: "", regionalHead: "", zonalHead: "", planningToStudy: "",
    source: { source: '', name: '', email: '', phoneNumber: '' },

    // 2. Education / Loan Info
    loanId: '', loanType: "", courseStartMonth: "", courseStartYear: "", degree: "",
    fieldOfInterest: "", interestedCountries: [], admitReceived: false, admittedUniversities: [],
    admissionStatus: "Not Yet Applied", approachedAnyBank: false, approachedBanks: [],
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
    fee: "", originalFee: "", originalFeeCurrency: "USD", conversionRate: "", loanAmountRequired: "",
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
    panStatus: "Applied", panNumber: "",
    referralList: [
        { name: "", code: "", phoneNumber: "" },
        { name: "", code: "", phoneNumber: "" },
        { name: "", code: "", phoneNumber: "" }
    ],
    collateralLocation: "", suggestedBank: "", lastCallDate: "", reminderCallDate: "",
    leadStatus: "No status", targetSanctionDate: "", reminders: [],
    testScores: {
        GRE: "", IELTS: "", TOEFL: "", GMAT: "",
        SAT: "", PTE: "", ACT: "", DUOLINGO: "",
    },
    callHistory: [],
};

export const EMAIL_TEMPLATE_CONTENT = {
    'NL1': {
        subject: "Unable to Conect - Regarding Your Education from Just Tap Capital",
        body: `<p>Dear [Student Name],</p><p>This is [FO Name], your Financial Officer from Just Tap Capital. India's Largest Education finance Platform for Scholarships and Education Loans.<p> We recently discussed funding your education as you had registered on the Just Tap Capital website; called you now for the same, you must have been busy as you didn't answer my call</p><p><strong> Could you please call me back on 7013148402 as soon as possible?</strong></p>
<p>Thank you!</p>
<p>FY1, Just Tap Capital is an organisation supported by the IT Ministry. Govt of India under the Digital India campaign and the assistance is three of cost. JTC IS BSSociated with 15+ Public and Private banks/lenders in India to help you get the best education loan matching your profile with the lowest interest rates.<p>Best regards,<br/>The Justap Team</p>`
    },
    'NL2': {
        subject: "Important: Update Regarding Your Education Funding with Just Tap Capital.Reply Required",
        body: `<p>Dear [Student Name],</p><p>This is [FO Name], your Financial Officer from Just Tap Capital-India's Largest Education Finance Platform for Scholarships and Education Loans.I was actively helping you with your Education Loan process recently as you had registered on the Just Tap Capital website. I have been trying to connect with you a few times now to discuss the same. But, my calls went unanswered

<p><strong>Please call back on 7013148402 at the earliest, without fail.</strong></p>

<p>I would like you to join our invite-only community on WhatsApp to get latest info and updates on Global Scholarships and Education Loan deals</p>

<p>Being an organisation funded by the IT Ministry, Just Tap Capital can compare your profile with 15+ lenders to get you the lowest interest rate in India. guaranteed. Also, I can resolve any sort of issue related to your education loan</p></p><p>Best regards,<br/>The Justap Team</p>`
    },
    'NL3(Normal)': {
        subject: "Important: You’re missing India’s Lowest Interest Rate Guaranteed Education Loan",
        body: `<p>Dear [Student Name],</p><p>This is [FO Name], your Financial Officer from Just Tap Capital- India's Largest Education Finance Platform supported under the Ministry of IT, Govt. of India.</p>

        <p>
        I have been trying to connect with you multiple times now to inform you that your profile is eligible to get 
        <strong>India's Lowest Interest Rate Guaranteed Education Loan.</strong> But you are not answering my calls.
        </p>

        <p>
        Students who go directly to the banks/agents will miss the below exclusive benefits of Just Tap Capital:
        </p>

        <ul>
            <li>India's Lowest Interest Rate guaranteed for your profile</li>
            <li>Minimum 25% discount on the bank's processing fee</li>
            <li>3X faster loan process – better than going to the bank directly</li>
            <li>Eligible for Interest Rate Protection Scheme (valid for 10 years)</li>
            <li>Complete Post-sanction support till the entire repayment duration</li>
        </ul>

        <p>
        <strong>You're eligible for a special rate! Please call back this time without fail on 9963563204.</strong>
        </p>

        <p>
        Apart from this, if there is any specific reason for not proceeding with the loan, I request you to share the feedback with me as a friend.
        </p>

        <p>
        I am looking forward to hearing from you this time.
        </p></p><p>Best regards,<br/>The Justap Team</p>`
    },
    'NL3 (NBFC)': {
        subject: "Important: You’re missing India’s Lowest Interest Rate Guaranteed Education Loan",
        body: `<p>Dear [Student Name],</p><p><p>
            This is [FO Name], your Financial Officer from 
            <strong>Just Tap Capital</strong> - India's Largest Education Finance Platform supported under the 
            <strong>Ministry of IT, Govt. of India.</strong>
            </p>

            <p>
            I have been trying to connect with you multiple times now to inform you that your profile is eligible to get 
            <strong>India's Lowest Interest Rate Guaranteed Education Loan.</strong> But you are not answering my calls.
            </p>

            <p>
            Students who go directly to the banks/agents will miss the below exclusive benefits of Just Tap Capital:
            </p>

            <ul>
                <li>✅ India's Lowest Interest Rate guaranteed for your profile</li>
                <li>✅ Minimum 25% discount on the bank's processing fee</li>
                <li>✅ 3X faster loan process - better than going to the bank directly</li>
                <li>✅ Eligible for Interest Rate Protection Scheme (valid for 10 years)</li>
                <li>✅ Complete Post-sanction support till the entire repayment duration</li>
            </ul>

            <p>
            <strong>You're eligible for a special rate! Please call back this time without fail on 7013148402</a>.</strong>
            </p>

            <p>
            Apart from this, if there is any specific reason for not answering my calls, I expect you to share the feedback with me as a friend.
            </p>

            <p>I am looking forward to hearing from you this time.</p></p><p>Best regards,<br/>The Justap Team</p>`
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
            <p>As part of our commitment to finding you the best education loan, we are initiating your application with our network of leading <strong>Public Sector Banks</strong>.</p>
            <p>Public banks are known for their trust, wide reach, and government-backed schemes. By partnering with Justap, you get:</p>
            <ul>
                <li><strong>Expert Navigation:</strong> We know the ins and outs of public bank procedures and help you navigate them efficiently.</li>
                <li><strong>End-to-End Assistance:</strong> From document collection to submission, we are with you all the way.</li>
            </ul>
            <p><strong>Connected Public Banks and Executives:</strong></p>
            <ul id="connected-banks-list">
                <!-- Dynamic list will be inserted here -->
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
            <p>Your assigned bank executive is [Executive Name] from [Bank Name], reachable at [Executive Mobile Number].</p>
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
            <p>Your assigned bank executive is [Executive Name] from [Bank Name], reachable at [Executive Mobile Number].</p>
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
            <p>Your assigned bank executive is [Executive Name] from [Bank Name], reachable at [Executive Mobile Number].</p>
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

    'EDUCATION LOAN EMI CALCULATOR':{
        subject: "Calculate Your Education Loan EMI with Justap's Easy-to-Use Calculator",
        body: `
            <p>Dear [Student Name],</p>
            <p>To help you plan your finances better, we are excited to introduce our <strong>Education Loan EMI Calculator</strong>. This tool allows you to estimate your monthly EMI based on various loan amounts, interest rates, and repayment tenures.</p>
            <p><strong>How to Use the EMI Calculator:</strong></p>
            <ul>
                <li>Enter your desired loan amount.</li>
                <li>Select the interest rate applicable to your loan.</li>
                <li>Choose your preferred repayment tenure.</li>
                <li>Click 'Calculate' to see your estimated monthly EMI.</li>
            </ul>
            <p>You can access our EMI Calculator here: <a href="http://16.112.180.35:3000/emi-calculator" target="_blank" style="color: blue; text-decoration: underline;">EMI Calculator</a></p>
            <p>Using this calculator will give you a clear idea of your monthly financial commitment, helping you make informed decisions about your education loan.</p>
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
        subject: "Key Challenges with Union Bank of India (UBI) & Our Support",
        body: `
        <p>While Union Bank of India offers education loans, students commonly face a few challenges during processing and disbursement.</p>
        <p><strong>Common UBI Challenges:</strong></p>
        <ul>
            <li><strong>Higher Loan Margin:</strong> Margin can go up to ~33% for top global universities, increasing upfront student contribution.</li>
            <li><strong>No Pre-Visa Disbursement:</strong> Funds not released before visa approval for GIC, blocked accounts, etc.</li>
            <li><strong>Tedious Living Expense Process:</strong> Monthly bill submission required for off-campus living disbursements.</li>
            <li><strong>Unexpected EMI Deductions:</strong> EMI deductions reported during moratorium impacting CIBIL in some cases.</li>
        </ul>

        <p><strong>How We Support You Better:</strong></p>
        <ul>
            <li><strong>Lower & Transparent Margin:</strong> Starting from 15% with no hidden university-based increases.</li>
            <li><strong>Pre-Visa Disbursement Support:</strong> Assistance for GIC, blocked accounts, and other embassy requirements.</li>
            <li><strong>Simple Disbursement Process:</strong> Hassle-free living expense disbursement without monthly bill stress.</li>
            <li><strong>Clear EMI Communication:</strong> No deductions without consent, protecting your CIBIL during moratorium.</li>
        </ul>

        <p>We guide students throughout the process to ensure a smooth and transparent loan experience.</p>`
    },
    'BOB Issues': {
        subject: "Key Challenges with Bank of Baroda (BOB) & Our Support",
        body: `
        <p>While Bank of Baroda is a popular public bank option, students may face certain challenges during their education loan process.</p>

        <p><strong>Common BOB Challenges:</strong></p>
        <ul>
            <li><strong>Frequent Interest Rate Hikes:</strong> Interest rates may increase every 6 months, significantly raising total repayment.</li>
            <li><strong>No Pre-Visa Disbursement:</strong> Funds are not released before visa approval for fee deposits or embassy requirements.</li>
            <li><strong>Tedious Living Expense Process:</strong> Monthly bill submission required for off-campus living expense disbursement.</li>
            <li><strong>Slow Processing Timeline:</strong> Sanction can take 2–3 months with strict collateral checks and limited tracking visibility.</li>
        </ul>

        <p><strong>How We Support You Better:</strong></p>
        <ul>
            <li><strong>Stable Interest Rates:</strong> Fixed and predictable rates without frequent unexpected hikes.</li>
            <li><strong>Pre-Visa Disbursement Support:</strong> Assistance with fee deposits and visa-related financial requirements.</li>
            <li><strong>Simple Disbursement Process:</strong> Smooth living expense disbursement without monthly bill hassles.</li>
            <li><strong>Faster Processing:</strong> Quick approvals in 2–4 weeks with digital tracking and simplified collateral handling.</li>
        </ul>

        <p>We ensure a faster, transparent, and student-friendly loan experience from start to finish.</p>`
    },

    'Bank Of India Issues': {
        subject: "Key Challenges with Bank of India (BOI) & Our Support",
        body: `
        <p>While Bank of India is a common choice for education loans, students may face several challenges during the loan process.</p>

        <p><strong>Common BOI Challenges:</strong></p>
        <ul>
            <li><strong>Higher Interest Rates:</strong> Interest rates can range around 11%–12.25%, often higher than many other lenders.</li>
            <li><strong>High Loan Margin Requirement:</strong> Margin may go up significantly based on total expenses, increasing upfront contribution.</li>
            <li><strong>Tedious Living Expense Disbursement:</strong> Monthly bills required for off-campus living expense release.</li>
            <li><strong>No Pre-Visa Disbursement:</strong> Funds not released before visa approval for GIC, blocked accounts, or fee deposits.</li>
            <li><strong>Unexpected EMI Deductions:</strong> EMI deductions reported during moratorium in some cases impacting CIBIL.</li>
        </ul>

        <p><strong>How We Support You Better:</strong></p>
        <ul>
            <li><strong>Competitive Interest Rates:</strong> Lower starting rates for better affordability and repayment planning.</li>
            <li><strong>Flexible Loan Margin:</strong> Transparent margins starting from 15% without sudden increases.</li>
            <li><strong>Simple Disbursement Process:</strong> Smooth living expense disbursement without monthly bill stress.</li>
            <li><strong>Pre-Visa Disbursement Support:</strong> Assistance for visa-related deposits like GIC and blocked accounts.</li>
            <li><strong>Transparent EMI Handling:</strong> No deductions without clear consent, ensuring CIBIL safety during moratorium.</li>
        </ul>

        <p>We ensure a faster, transparent, and student-friendly loan journey from application to disbursement.</p>`
    },

    'CANARA Bank Issues': {
        subject: "Key Challenges with Canara Bank & Our Support",
        body: `
        <p>While Canara Bank is a well-known public sector lender, students may experience certain challenges during their education loan process.</p>

        <p><strong>Common Canara Bank Challenges:</strong></p>
        <ul>
            <li><strong>Higher Interest Rates:</strong> Interest rates can range around 10.85%–11.35%, often higher than many private lenders.</li>
            <li><strong>Tedious Living Expense Disbursement:</strong> Monthly bills required for off-campus living expense release.</li>
            <li><strong>High Loan Margin Requirement:</strong> Margin may increase significantly based on total expenses, raising upfront contribution.</li>
            <li><strong>No Pre-Visa Disbursement:</strong> Funds not released before visa approval for GIC, blocked accounts, or fee deposits.</li>
            <li><strong>Unexpected EMI Deductions:</strong> EMI deductions reported during moratorium in some cases impacting CIBIL.</li>
        </ul>

        <p><strong>How We Support You Better:</strong></p>
        <ul>
            <li><strong>Competitive Interest Rates:</strong> Lower starting rates for better affordability and repayment planning.</li>
            <li><strong>Simple Disbursement Process:</strong> Smooth living expense disbursement without monthly bill stress.</li>
            <li><strong>Flexible Loan Margin:</strong> Transparent margins starting from 15% without sudden increases.</li>
            <li><strong>Pre-Visa Disbursement Support:</strong> Assistance for visa-related deposits like GIC and blocked accounts.</li>
            <li><strong>Transparent EMI Handling:</strong> No deductions without consent, ensuring CIBIL safety during moratorium.</li>
        </ul>

        <p>We ensure a smooth, transparent, and student-friendly education loan experience.</p>`
    },
    'PNB Issues': {
        subject: "Key Challenges with Punjab National Bank (PNB) & Our Support",
        body: `
        <p>Punjab National Bank is a widely used public sector bank, but students often face certain challenges during the education loan journey.</p>

        <p><strong>Common PNB Challenges:</strong></p>
        <ul>
            <li><strong>Higher Interest Rates:</strong> Interest rates typically range from ~10.85% to 12.25%, higher than many alternatives.</li>
            <li><strong>High Loan Margin Requirement:</strong> Margin can increase significantly based on total expenses, raising upfront contribution.</li>
            <li><strong>Tedious Living Expense Disbursement:</strong> Monthly bill submission required for off-campus living expenses.</li>
            <li><strong>No Pre-Visa Disbursement:</strong> Funds are not released before visa approval for GIC, blocked accounts, or fee deposits.</li>
            <li><strong>Unexpected EMI Deductions:</strong> EMI deductions reported during moratorium, impacting student and co-applicant CIBIL.</li>
        </ul>

        <p><strong>How We Support You Better:</strong></p>
        <ul>
            <li><strong>Competitive Interest Rates:</strong> Lower starting rates for better affordability and repayment planning.</li>
            <li><strong>Simple Disbursement Process:</strong> Smooth living expense disbursement without monthly bill stress.</li>
            <li><strong>Flexible Loan Margin:</strong> Transparent margins starting from 15% without sudden increases.</li>
            <li><strong>Pre-Visa Disbursement Support:</strong> Assistance for visa-related deposits like GIC and blocked accounts.</li>
            <li><strong>Transparent EMI Handling:</strong> No deductions without consent, ensuring CIBIL safety during moratorium.</li>
        </ul>

        <p>We focus on making the education loan process smoother, faster, and student-friendly.</p>`
    },

    'USD Lender Issues (PRODIGY/MPOWER)': {
        subject: "Key Challenges with USD Lenders (Prodigy & MPower) & Our Support",
        body: `
        <p>USD-based lenders like Prodigy and MPower are popular for abroad education loans, but students should be aware of certain financial and process-related challenges.</p>

        <p><strong>Common USD Lender Challenges:</strong></p>
        <ul>
            <li><strong>Higher Effective Interest Cost:</strong> Interest rates typically range ~11.5%–14.5%, often higher than INR education loans.</li>
            <li><strong>Exchange Rate Impact:</strong> USD loans may effectively cost much more when converted and repaid in INR.</li>
            <li><strong>No Tax Benefits:</strong> Interest paid is not eligible for Section 80E income tax exemption in India.</li>
            <li><strong>High Processing Fees:</strong> Processing fees can go up to 4%–5%, significantly increasing upfront cost.</li>
            <li><strong>Strict Disbursement Checks:</strong> Semester score checks and documentation may delay future disbursements.</li>
        </ul>

        <p><strong>How We Support You Better:</strong></p>
        <ul>
            <li><strong>Lower Interest Rates:</strong> Competitive INR loan options starting from lower rates for better savings.</li>
            <li><strong>No Forex Risk:</strong> INR-based loans protect you from currency fluctuation and repayment uncertainty.</li>
            <li><strong>Tax Benefit Eligibility:</strong> Claim income tax deductions under Section 80E for up to 8 years.</li>
            <li><strong>Lower Processing Fees:</strong> Minimal processing charges compared to international lenders.</li>
            <li><strong>Smooth Disbursement Process:</strong> Easy fund release without semester-wise restrictions or delays.</li>
        </ul>

        <p>We help you choose the most cost-effective and student-friendly loan option for your study abroad plans.</p>`
    },
    'Overall Lender Issues - When Going Directly': {
        subject: "Challenges Students Face When Approaching Banks Directly & Our Support",
        body: `
        <p>Students who approach banks or lenders directly often face unexpected challenges during their education loan journey.</p>

        <p><strong>Common Challenges When Going Directly:</strong></p>
        <ul>
            <li><strong>Higher & Fluctuating Interest Rates:</strong> Rates may start low but increase rapidly post-disbursement, increasing repayment burden.</li>
            <li><strong>Limited Negotiation Power:</strong> Students approaching directly often miss out on better rate negotiations and market comparisons.</li>
            <li><strong>Slow Disbursement Timelines:</strong> Delays in fund release can impact tuition fee payments and accommodation arrangements.</li>
        </ul>

        <p><strong>How We Support You Better:</strong></p>
        <ul>
            <li><strong>Negotiated Lower Interest Rates:</strong> Up to 2% better ROI with access to exclusive lender partnerships.</li>
            <li><strong>Interest Rate Protection:</strong> Support in controlling unexpected rate hikes during the loan tenure.</li>
            <li><strong>Faster Disbursements:</strong> Streamlined processing to ensure funds are released on time.</li>
            <li><strong>End-to-End Guidance:</strong> Continuous support from application to final disbursement and beyond.</li>
        </ul>

        <p>We ensure you get the most cost-effective and stress-free education loan experience without dealing with banks alone.</p>`
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
    subject: "Smart Financing: Why Taking an Education Loan Can Be Smarter Than Using Self-Funds",
    body: `
        <p>Many students initially plan to use self-funds for their education, but later realize certain financial and visa-related challenges.</p>

        <p><strong>Common Challenges with Self-Funding:</strong></p>
        <ul>
            <li><strong>Visa Approval Concerns:</strong> Education loans are often considered a more reliable funding source by visa officers.</li>
            <li><strong>High TCS Charges:</strong> Transfers above ₹10L attract ~5% TCS when using self-funds for foreign payments.</li>
            <li><strong>No Tax Benefits:</strong> Self-funding does not provide Section 80E tax exemption benefits available on education loans.</li>
        </ul>

        <p><strong>How an Education Loan Helps:</strong></p>
        <ul>
            <li><strong>Stronger Visa Financial Profile:</strong> Loans improve financial credibility and visa acceptance chances.</li>
            <li><strong>Zero TCS on Loan Transfers:</strong> No TCS applicable when funds are sent through education loan.</li>
            <li><strong>Tax Savings:</strong> Claim income tax deductions on interest paid for up to 8 years under Section 80E.</li>
        </ul>

        <p>An education loan not only supports your studies but also helps you manage finances more efficiently.</p>`
},

    'Referal Program': {
        subject: "Refer a Friend to Justap & Earn Rewards!",
        body: `
            <p>Dear [Student Name],</p>
            <p>Did you know you can earn upto 3000 rupees rewards by helping your friends achieve their study abroad dreams?</p>
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

export const regions = ['AP', 'Hyderabad', 'TG-Rest', 'Banglore', 'Tamilnadu', 'kerala', 'delhi', '7 sisters', 'mumbai', 'maharastra-rest'];

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
    "UBI Issues", "BOB Issues", "Overall Lender Issues - When Going Directly", "HDFC Credilla Issues", "CANARA Bank Issues", "PNB Issues",
    "Bank Of India Issues", "USD Lender Issues (PRODIGY/MPOWER)"
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
export const NLTemplates = ['NL1', 'NL2', 'NL3(Normal)', 'NL3 (NBFC)']
export const banksDocs = [
    "KVB Details -1st Email",
    "SBI Details 1st Email",
    "Only Public Banks Connection Mail",
    "Only Priavte Lender Connection Mail",
    "Public and  Private Lender connection 1st Mail ",
    "Vidya loans Details 1st Email"

];
export const loanCalculator =[
     'EDUCATION LOAN EMI CALCULATOR',
     '$ USD TO INR EDUCATION LOAN CALCULATOR', 
     'Saves Lakhs By Educational Loan Transfer',
      'EL TAX Rebate Calculator'
     ];

export const documentStatus = [
    "Documents Partially Uplaoded 2nd followup ",
    "Documents Not Upaloded 2nd followup or beyond",
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

export const degrees = ['Masters', 'Graduation', 'PhD', 'MBBS', 'UG Certificate', 'PG Certificate'];

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
    "UK", "USA", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export const API_URL = 'http://16.112.180.35:5000/api/leads';

export const MOCK_USER_FULLNAME = 'FO 1 (Mock)';

// EMI Calculator Default Values
export const EMI_CALCULATOR_DEFAULTS = {
  courseMonths: 24,
  loanAmount: 2000000,
  interest: 8.5,
  moratorium: "No",
  graceMonths: 6,
  repayYears: 2,
};

// EMI Calculator Options
export const GRACE_PERIOD_OPTIONS = Array.from({ length: 13 }, (_, i) => i); // 0 to 12

// New constants for the Assets section
export const assetTypes = ['Physical Property', 'Fixed Deposit', 'LIC Policy', 'Government Bond'];
export const physicalPropertyTypes = ['House', 'Flat', 'Non-agricultural Land', 'Commercial Property'];
export const propertyAuthorities = ['Gram Panchayat', 'Municipality'];
export const licPolicyTypes = ['Term', 'Life'];

// --- NEW: Reasons for Lead Statuses ---
export const leadStatusOptions = ['No status', 'On Priority', 'Sanctioned', 'Application Incomplete', 'Close'];

export const priorityReasons = ['Admit received', 'University Shortlisted', 'Nearest Intake'];

export const closeReasons = ['Not Interested', 'Not lifting', 'Not eligible for loan'];

// --- NEW: Indian Banks segregated into Public and Private ---
export const publicBanksIndia = [
    'State Bank of India',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Bank of India',
    'Indian Bank',
    'Central Bank of India',
    'UCO Bank',
    'Bank of Maharashtra',
    'Punjab & Sind Bank',
    'Indian Overseas Bank'
];

export const privateBanksIndia = [
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'IndusInd Bank',
    'Yes Bank',
    'Federal Bank',
    'IDFC First Bank',
    'Bandhan Bank',
    'RBL Bank',
    'South Indian Bank',
    'City Union Bank',
    'Karur Vysya Bank',
    'Tamilnad Mercantile Bank',
    'Karnataka Bank',
    'Nainital Bank',
    'Dhanlaxmi Bank',
    'Jammu & Kashmir Bank',
    'Saraswat Cooperative Bank',
    'Abhyudaya Cooperative Bank',
    'Bharat Cooperative Bank',
    'Catholic Syrian Bank',
    'DCB Bank',
    'ESAF Small Finance Bank',
    'Equitas Small Finance Bank',
    'Fincare Small Finance Bank',
    'Jana Small Finance Bank',
    'North East Small Finance Bank',
    'Shivalik Small Finance Bank',
    'Suryoday Small Finance Bank',
    'Ujjivan Small Finance Bank',
    'Utkarsh Small Finance Bank',
    'AU Small Finance Bank',
    'Capital Small Finance Bank',
    'FINO Payments Bank',
    'India Post Payments Bank',
    'Jio Payments Bank',
    'NSDL Payments Bank',
    'Paytm Payments Bank',
    'Airtel Payments Bank'
];
