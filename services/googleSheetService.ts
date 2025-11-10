import { Tool } from '../types';

const SHEET_ID = '1VlfBPQw79zF9Znafn_lvclGAdMmwwCs_S5PaPrMb4Ak';
// The name of the sheet within the Google Sheet document. 'Sheet1' is the default.
const SHEET_NAME = 'Sheet1'; 

// Fix: Switched to the Google Visualization API endpoint.
// This is a more robust method for fetching public sheet data as CSV and avoids
// potential redirect or network issues sometimes seen with the /pub URL.
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;


// Simple CSV parser
const parseCSV = (csvText: string): Record<string, string>[] => {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1);

    return rows.map(row => {
        // This regex handles quoted fields that may contain commas
        const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        
        const obj = header.reduce((acc, col, index) => {
            const value = (values[index] || '').replace(/"/g, '').trim();
            acc[col] = value;
            return acc;
        }, {} as Record<string, string>);
        
        return obj;
    });
};

export const fetchTools = async (): Promise<Tool[]> => {
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
        }
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);

        return parsedData.map((item, index) => ({
            id: `gsheet-${index}-${item.Name || ''}`,
            name: item['Name'] || 'Untitled',
            description: item['Description'] || 'No description available.',
            category: item['Category'] || 'General',
            imageUrl: item['Image Link'] || `https://picsum.photos/seed/${item.Name || index}/500/300`,
            toolUrl: item['Tool Link'] || '#',
            featured: (item['Featured'] || '').toUpperCase() === 'TRUE',
        }));
    } catch (error) {
        console.error("Error fetching or parsing Google Sheet data:", error);
        return []; // Return an empty array on error to prevent app crash
    }
};