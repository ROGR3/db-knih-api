import { fetch as crossFetch } from 'cross-fetch';

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36'
];

const headers = {
    'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
};


const fetchSafe =
    (typeof fetch === 'function' && fetch) || // ServiceWorker fetch (Cloud Functions + Chrome extension)
    (typeof window !== 'undefined' && window.fetch) || // Browser fetch
    crossFetch; // Polyfill fetch


export async function fetchPage(url: string): Promise<string> {

    try {
        const response = await fetchSafe(url, { headers });
        if (response.status >= 400 && response.status < 600) {
            throw new Error(`Bad response ${response.status} for url: ${url}`);
        }
        return await response.text();
    } catch (e) {
        console.error(e);
        return 'Error';
    }
};

export function createSearchUrl(text: string): string {
    return `https://www.databazeknih.cz/search?q=${encodeURIComponent(text)}`;
}

export function createBookInfoUrl(book: string): string {
    return `https://www.databazeknih.cz/knihy/${encodeURIComponent(book)}`;
}

export function createAdditionalBookInfoUrl(bookId: string): string {
    return `https://www.databazeknih.cz/book-detail-more-info/${encodeURIComponent(bookId)}`;
}