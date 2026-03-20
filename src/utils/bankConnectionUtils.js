import { BANK_CONNECTION_API } from '../constants';

/**
 * Fetch private lenders (private banks + NBFCs) with executives
 */
export const fetchPrivateLenders = async () => {
    try {
        const response = await fetch(BANK_CONNECTION_API.PRIVATE_LENDERS);
        if (!response.ok) throw new Error('Failed to fetch private lenders');
        return await response.json();
    } catch (error) {
        console.error('Error fetching private lenders:', error);
        return [];
    }
};

/**
 * Fetch public banks with executives
 */
export const fetchPublicBanks = async () => {
    try {
        const response = await fetch(BANK_CONNECTION_API.PUBLIC_BANKS);
        if (!response.ok) throw new Error('Failed to fetch public banks');
        return await response.json();
    } catch (error) {
        console.error('Error fetching public banks:', error);
        return [];
    }
};

/**
 * Fetch all connected banks with executives (categorized)
 */
export const fetchAllConnectedBanks = async () => {
    try {
        const response = await fetch(BANK_CONNECTION_API.ALL_CONNECTED);
        if (!response.ok) throw new Error('Failed to fetch all connected banks');
        return await response.json();
    } catch (error) {
        console.error('Error fetching all connected banks:', error);
        return { public: [], private: [], nbfc: [] };
    }
};

/**
 * Get banks by type for email templates
 */
export const getBanksForEmailTemplate = async (type = 'both') => {
    switch (type) {
        case 'private':
            return await fetchPrivateLenders();
        case 'public':
            return await fetchPublicBanks();
        case 'both':
        default:
            const allBanks = await fetchAllConnectedBanks();
            return [...allBanks.public, ...allBanks.private, ...allBanks.nbfc];
    }
};