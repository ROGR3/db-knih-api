import { BookInfo, BookScraper } from "./services/book-service";
import { SearchInfo, SearchScraper } from "./services/search-service";

class DBKnih {
    constructor(
        private bookService: BookScraper,
        private searchService: SearchScraper
    ) { }

    public async search(text: string): Promise<SearchInfo[]> {
        return this.searchService.search(text);
    }

    public async getBookInfo(bookLink: string): Promise<BookInfo | undefined> {
        return this.bookService.getBookInfo(bookLink);
    }
}

export const dbKnih = new DBKnih(new BookScraper(), new SearchScraper());