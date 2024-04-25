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
exports.SearchScraper = void 0;
const fetch_1 = require("../fetchers/fetch");
const node_html_parser_1 = require("node-html-parser");
class SearchScraper {
    search(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = (0, fetch_1.createSearchUrl)(text);
            const response = yield (0, fetch_1.fetchPage)(url);
            const html = (0, node_html_parser_1.parse)(response);
            const bookElements = html.querySelectorAll('p.new');
            return bookElements.map(this.parseBookInfo.bind(this));
        });
    }
    parseBookInfo(element) {
        const bookRoute = this.extractBookRoute(element);
        return {
            name: this.getTextContent(element, "a.new"),
            id: this.safeNumberConvert(bookRoute.pop()),
            cleanName: bookRoute.join("-"),
            year: this.extractYear(element),
            author: this.extractAuthor(element),
        };
    }
    extractBookRoute(element) {
        var _a;
        const href = this.getAttribute(element, "a.new", "href");
        return ((_a = this.splitAndTrim(href, "/", 2)) === null || _a === void 0 ? void 0 : _a.split("-")) || [];
    }
    extractYear(element) {
        const yearString = this.splitAndTrim(this.getTextContent(element, "span.smallfind"), ",", 0);
        return this.safeNumberConvert(yearString);
    }
    extractAuthor(element) {
        return this.splitAndTrim(this.getTextContent(element, "span.smallfind"), ",", 1) || "";
    }
    getTextContent(element, selector) {
        const selectedElement = element.querySelector(selector);
        return selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.text;
    }
    getAttribute(element, selector, attributeName) {
        const selectedElement = element.querySelector(selector);
        return selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.getAttribute(attributeName);
    }
    splitAndTrim(text, separator, index) {
        var _a;
        if (text) {
            const parts = text.trim().split(separator);
            return (_a = parts[index]) === null || _a === void 0 ? void 0 : _a.trim();
        }
        return undefined;
    }
    safeNumberConvert(text) {
        return text ? Number(text) : 0;
    }
}
exports.SearchScraper = SearchScraper;
