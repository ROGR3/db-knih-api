export interface BookInfo {
    plot?: string;
    genres?: string[];
    year?: number;
    publisher?: string;
    rating?: number;
    numberOfRatings?: number;
    reviews?: Review[];
    cover?: string;
    pages?: number;
    originalLanguage?: string;
    isbn?: string;
}
export interface Review {
    text?: string;
    rating?: number;
    username?: string;
    date?: string;
}
export declare class BookScraper {
    getBookInfo(bookLink: string): Promise<BookInfo | undefined>;
    private getBookPlot;
    private getGenres;
    private getPublishedYear;
    private getPublisher;
    private getRating;
    private getNumberOfRatings;
    private getReviews;
    private getReviewRating;
    private getPageCount;
    private getOriginalLanguage;
    private getIsbn;
    private getCoverImage;
    private getTextContent;
    private getAttribute;
    private splitAndTrim;
    private safeNumberConvert;
}
