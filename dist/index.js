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
exports.dbKnih = void 0;
const book_service_1 = require("./services/book-service");
const search_service_1 = require("./services/search-service");
class DBKnih {
    constructor(bookService, searchService) {
        this.bookService = bookService;
        this.searchService = searchService;
    }
    search(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.searchService.search(text);
        });
    }
    getBookInfo(bookLink) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bookService.getBookInfo(bookLink);
        });
    }
}
exports.dbKnih = new DBKnih(new book_service_1.BookScraper(), new search_service_1.SearchScraper());
