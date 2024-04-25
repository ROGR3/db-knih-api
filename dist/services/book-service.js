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
exports.BookScraper = void 0;
const fetch_1 = require("../fetchers/fetch");
const node_html_parser_1 = require("node-html-parser");
class BookScraper {
    getBookInfo(bookLink) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const bookHtml = (0, node_html_parser_1.parse)(yield (0, fetch_1.fetchPage)((0, fetch_1.createBookInfoUrl)(bookLink)));
            const additionalInfoHtml = (0, node_html_parser_1.parse)(yield (0, fetch_1.fetchPage)((0, fetch_1.createAdditionalBookInfoUrl)((_a = bookLink.split("-").pop()) !== null && _a !== void 0 ? _a : "")));
            const bookHTMLContent = bookHtml.querySelector("#faux>#content");
            if (!bookHTMLContent || !additionalInfoHtml) {
                return undefined;
            }
            return {
                plot: this.getBookPlot(bookHTMLContent),
                genres: this.getGenres(bookHTMLContent),
                year: this.getPublishedYear(bookHTMLContent),
                publisher: this.getPublisher(bookHTMLContent),
                rating: this.getRating(bookHTMLContent),
                numberOfRatings: this.getNumberOfRatings(bookHTMLContent),
                reviews: this.getReviews(bookHTMLContent),
                cover: this.getCoverImage(bookHTMLContent),
                pages: this.getPageCount(additionalInfoHtml),
                originalLanguage: this.getOriginalLanguage(additionalInfoHtml),
                isbn: this.getIsbn(additionalInfoHtml),
            };
        });
    }
    getBookPlot(bookHTMLContent) {
        var _a;
        const mainPlot = (_a = this.getTextContent(bookHTMLContent, ".justify.new2.odtop")) === null || _a === void 0 ? void 0 : _a.replace(/\.\.\.\. celý text|\.\./g, "");
        const additionalPlot = this.getTextContent(bookHTMLContent, ".justify.new2.odtop>span");
        return mainPlot + "" + additionalPlot;
    }
    getGenres(bookHTMLContent) {
        const genreString = this.getTextContent(bookHTMLContent, '[itemprop="genre"]');
        return genreString ? genreString.split(",").map(genre => genre.trim()) : undefined;
    }
    getPublishedYear(bookHTMLContent) {
        const yearString = this.splitAndTrim(this.getTextContent(bookHTMLContent, ".detail_description>h4"), ",", 1) || this.getTextContent(bookHTMLContent, '[itemprop="datePublished"]');
        return this.safeNumberConvert(yearString);
    }
    getPublisher(bookHTMLContent) {
        return this.getTextContent(bookHTMLContent, '[itemprop="publisher"]');
    }
    getRating(bookHTMLContent) {
        var _a;
        const ratingString = (_a = this.getTextContent(bookHTMLContent, ".bpoints")) === null || _a === void 0 ? void 0 : _a.replace(" %", "");
        return this.safeNumberConvert(ratingString);
    }
    getNumberOfRatings(bookHTMLContent) {
        var _a;
        const ratingsString = (_a = this.getTextContent(bookHTMLContent, "#voixis>.ratingDetail")) === null || _a === void 0 ? void 0 : _a.replace(" hodnocení", "");
        return this.safeNumberConvert(ratingsString);
    }
    getReviews(bookHTMLContent) {
        return bookHTMLContent
            .querySelectorAll(".komentars_user")
            .slice(0, 5)
            .map(reviewElement => {
            var _a;
            return ({
                text: (_a = this.getTextContent(reviewElement, ".komholdu>p")) === null || _a === void 0 ? void 0 : _a.trim(),
                rating: this.getReviewRating(reviewElement),
                username: this.getAttribute(reviewElement, "img", "title"),
                date: this.getTextContent(reviewElement, ".fright.clear_comm>.pozn_light.odleft_pet"),
            });
        });
    }
    getReviewRating(reviewElement) {
        const titleAttribute = this.getAttribute(reviewElement, ".fright.clear_comm>img", "title");
        return this.safeNumberConvert(titleAttribute === null || titleAttribute === void 0 ? void 0 : titleAttribute.split(" ")[0]);
    }
    getPageCount(bookHTMLContent) {
        var _a;
        const pageCount = (_a = bookHTMLContent.querySelector('[itemprop="numberOfPages"]')) === null || _a === void 0 ? void 0 : _a.text;
        return this.safeNumberConvert(pageCount);
    }
    getOriginalLanguage(bookHTMLContent) {
        var _a;
        const originalLanguage = (_a = bookHTMLContent.querySelector('[itemprop="language"]')) === null || _a === void 0 ? void 0 : _a.text.trim();
        return originalLanguage;
    }
    getIsbn(bookHTMLContent) {
        var _a;
        const isbn = (_a = bookHTMLContent.querySelector('[itemprop="isbn"]')) === null || _a === void 0 ? void 0 : _a.text.trim();
        return isbn;
    }
    getCoverImage(bookHTMLContent) {
        return this.getAttribute(bookHTMLContent, ".kniha_img", "src");
    }
    getTextContent(element, selector) {
        const selectedElement = element.querySelector(selector);
        return selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.text.trim();
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
        return text ? Number(text.replace(" ", "")) : 0;
    }
}
exports.BookScraper = BookScraper;
