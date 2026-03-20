import axios from 'axios';
import { BANK_EMAIL_TEMPLATE_CONTENT, EMAIL_TEMPLATE_PLACEHOLDERS, EMAIL_TEMPLATE_CONTENT } from '../constants';

const BANK_API_URL = 'https://justtapcapital.com/api/banks';

/**
 * Fetch private banks and NBFCs with executives
 */
export const fetchPrivateLendersWithExecutives = async () => {
    try {
        const response = await axios.get(`${BANK_API_URL}/private-lenders`);
        return response.data;
    } catch (error) {
        console.error('Error fetching private lenders:', error);
        return [];
    }
};

/**
 * Fetch public banks with executives
 */
export const fetchPublicBanksWithExecutives = async () => {
    try {
        const response = await axios.get(`${BANK_API_URL}/public-banks`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public banks:', error);
        return [];
    }
};

/**
 * Fetch all connected banks with executives
 */
export const fetchAllConnectedBanksWithExecutives = async () => {
    try {
        const response = await axios.get(`${BANK_API_URL}/all-connected`);
        const data = response.data;
        
        // Filter to only return banks with relationshipManagers
        return (data || []).filter(bank => bank.relationshipManagers && bank.relationshipManagers.length > 0);
    } catch (error) {
        console.error('Error fetching connected banks:', error);
        return [];
    }
};

/**
 * Format bank executives list as HTML for email template
 * @param {Array|Object} banks - Array of banks with executives OR object with public/private/nbfc arrays
 * @returns {String} HTML formatted list
 */
export const formatBanksExecutivesList = (banks) => {
    console.log('formatBanksExecutivesList - Input banks:', banks);
    
    if (!banks || banks.length === 0) {
        console.log('No banks found');
        return 'No bank executives connected yet.';
    }

    let html = '';
    
    banks.forEach(bank => {
        console.log(`Processing bank: ${bank.name}, relationshipManagers:`, bank.relationshipManagers);
        if (bank.relationshipManagers && bank.relationshipManagers.length > 0) {
            bank.relationshipManagers.forEach(exec => {
                console.log(`Adding executive: ${exec.name}`);
                html += `${bank.name} - ${exec.name}\n📧 ${exec.email}\n📞 ${exec.phoneNumber}\n\n`;
            });
        }
    });

    console.log('Final HTML output:', html);
    return html || 'No bank executives connected yet.';
};

/**
 * Format banks list grouped by bank name (for display purposes)
 * @param {Array|Object} banks - Array of banks with executives OR object with public/private/nbfc arrays
 * @returns {String} HTML formatted list
 */
export const formatBanksListByBank = (banks) => {
    // Handle case where banks is an object with public, private, nbfc arrays
    if (banks && typeof banks === 'object' && !Array.isArray(banks)) {
        const allBanks = [
            ...(banks.public || []),
            ...(banks.private || []),
            ...(banks.nbfc || [])
        ];
        banks = allBanks;
    }
    
    // Filter out banks that don't have executives (connected banks only)
    const connectedBanks = banks?.filter(bank => 
        bank.executives && 
        Array.isArray(bank.executives) && 
        bank.executives.length > 0 &&
        bank.executives.some(exec => exec.name && exec.email && exec.phoneNumber)
    ) || [];
    
    if (connectedBanks.length === 0) {
        return '<li>No bank executives connected yet.</li>';
    }

    let html = '';

    connectedBanks.forEach(bank => {
        const validExecs = bank.executives.filter(exec => exec.name && exec.email && exec.phoneNumber);
        const execNames = validExecs.map(exec => `${exec.name} (${exec.phoneNumber})`).join(', ');

        html += `
            <li style="margin-bottom: 8px;">
                <strong>${bank.name}</strong>: ${execNames}
            </li>
        `;
    });

    return html;
};

/**
 * Populate email template with dynamic bank data
 * @param {String} templateName - The template name from EMAIL_TEMPLATE_CONTENT
 * @param {Object} data - Additional data like studentName, uploadLink, etc.
 * @returns {Object} - { subject, body }
 */
export const populateBankConnectionTemplate = async (templateName, data = {}) => {
    const { studentName = '[Student Name]', uploadLink = '' } = data;

    // Get the template from EMAIL_TEMPLATE_CONTENT
    const template = EMAIL_TEMPLATE_CONTENT[templateName];
    
    if (!template) {
        throw new Error(`Template "${templateName}" not found`);
    }

    let subject = template.subject;
    let body = template.body;

    // Replace student name
    body = body.replace(/\[Student Name\]/g, studentName);

    // Replace upload link if present
    if (uploadLink) {
        body = body.replace(/\[UPLOAD_LINK_PLACEHOLDER\]/g, 
            `<p><a href="${uploadLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Upload Documents Here</a></p>`
        );
    } else {
        body = body.replace(/\[UPLOAD_LINK_PLACEHOLDER\]/g, '');
    }

    // Fetch and populate bank executives based on template type
    let banksWithExecutives = [];
    
    if (templateName === 'Only Public Banks Connection Mail') {
        // Get only public banks
        banksWithExecutives = await fetchPublicBanksWithExecutives();
    } else if (templateName === 'Only Priavte Lender Connection Mail') {
        // Get only private banks and NBFCs
        banksWithExecutives = await fetchPrivateLendersWithExecutives();
    } else if (templateName === 'Public and  Private Lender connection 1st Mail ') {
        banksWithExecutives = await fetchAllConnectedBanksWithExecutives();
        console.log('Fetched banks with executives:', banksWithExecutives);
    }

    // Format and replace the connected banks list
    const banksListHtml = formatBanksExecutivesList(banksWithExecutives);
    console.log('Generated HTML:', banksListHtml);
    body = body.replace(/<ul id="connected-banks-list">.*?<\/ul>/gs, `<ul>${banksListHtml}</ul>`);
    body = body.replace(/Connected Banks and Executives:[\s\S]*?(?=To proceed|Best regards)/i, `Connected Banks and Executives:\n\n<ul>${banksListHtml}</ul>\n\n`);

    return { subject, body };
};

/**
 * Replace placeholders in email template with actual data (for BANK_EMAIL_TEMPLATE_CONTENT)
 */
export const populateEmailTemplate = (templateType, data) => {
    const template = BANK_EMAIL_TEMPLATE_CONTENT[templateType];
    if (!template) {
        throw new Error(`Template type ${templateType} not found`);
    }

    const {
        studentName = '',
        bankName = '',
        executiveName = '',
        executiveEmail = '',
        executiveMobile = '',
        companyName = 'Justap Capital',
        applicationId = '',
        sanctionAmount = ''
    } = data;

    let subject = template.subject;
    let body = template.body;

    // Replace placeholders in subject
    subject = subject.replace(EMAIL_TEMPLATE_PLACEHOLDERS.BANK_NAME, bankName);

    // Replace placeholders in body
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.STUDENT_NAME, 'g'), studentName);
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.BANK_NAME, 'g'), bankName);
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.EXECUTIVE_NAME, 'g'), executiveName);
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.EXECUTIVE_EMAIL, 'g'), executiveEmail);
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.EXECUTIVE_MOBILE, 'g'), executiveMobile);
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.COMPANY_NAME, 'g'), companyName);
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.APPLICATION_ID, 'g'), applicationId);
    body = body.replace(new RegExp(EMAIL_TEMPLATE_PLACEHOLDERS.SANCTION_AMOUNT, 'g'), sanctionAmount);

    return { subject, body };
};

/**
 * Get available email template types
 */
export const getEmailTemplateTypes = () => {
    return Object.keys(BANK_EMAIL_TEMPLATE_CONTENT);
};

/**
 * Validate email template data
 */
export const validateEmailTemplateData = (templateType, data) => {
    const requiredFields = ['studentName', 'bankName', 'executiveName', 'executiveEmail', 'executiveMobile'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
};

/**
 * Check if template requires bank executives data
 */
export const requiresBankExecutives = (templateName) => {
    const bankConnectionTemplates = [
        'Only Public Banks Connection Mail',
        'Only Priavte Lender Connection Mail',
        'Public and  Private Lender connection 1st Mail '
    ];
    return bankConnectionTemplates.includes(templateName);
};

