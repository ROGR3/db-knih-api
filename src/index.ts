import { BookScraper } from "./services/book-service";
import { SearchScraper } from "./services/search-service";

class DBKnih {
    constructor(
        private bookService: BookScraper,
        private searchService: SearchScraper
    ) { }

    public async search(text: string) {
        return this.searchService.search(text);
    }

    public async getBookInfo(bookLink: string) {
        return this.bookService.getBookInfo(bookLink);
    }
}

export const dbKnih = new DBKnih(new BookScraper(), new SearchScraper());