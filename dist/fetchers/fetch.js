"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdditionalBookInfoUrl = exports.createBookInfoUrl = exports.createSearchUrl = exports.fetchPage = void 0;
const cross_fetch_1 = require("cross-fetch");
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36'
];
const headers = {
    'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
};
const fetchSafe = (typeof fetch === 'function' && fetch) || // ServiceWorker fetch (Cloud Functions + Chrome extension)
    (typeof window !== 'undefined' && window.fetch) || // Browser fetch
    cross_fetch_1.fetch; // Polyfill fetch
function fetchPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchSafe(url, { headers });
            if (response.status >= 400 && response.status < 600) {
                throw new Error(`Bad response ${response.status} for url: ${url}`);
            }
            return yield response.text();
        }
        catch (e) {
            console.error(e);
            return 'Error';
        }
    });
}
exports.fetchPage = fetchPage;
;
function createSearchUrl(text) {
    return `https://www.databazeknih.cz/search?q=${encodeURIComponent(text)}`;
}
exports.createSearchUrl = createSearchUrl;
function createBookInfoUrl(book) {
    return `https://www.databazeknih.cz/knihy/${encodeURIComponent(book)}`;
}
exports.createBookInfoUrl = createBookInfoUrl;
function createAdditionalBookInfoUrl(bookId) {
    return `https://www.databazeknih.cz/book-detail-more-info/${encodeURIComponent(bookId)}`;
}
exports.createAdditionalBookInfoUrl = createAdditionalBookInfoUrl;
