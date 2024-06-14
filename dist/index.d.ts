import { BookInfo, BookScraper } from "./services/book-service";
import { SearchInfo, SearchScraper } from "./services/search-service";
declare class DBKnih {
    private bookService;
    private searchService;
    constructor(bookService: BookScraper, searchService: SearchScraper);
    search(text: string): Promise<SearchInfo[]>;
    getBookInfo(bookLink: string): Promise<BookInfo | undefined>;
}
export declare const dbKnih: DBKnih;
export {};
