export interface SearchInfo {
    name?: string;
    cleanName?: string;
    id?: number;
    year?: number;
    author?: string;
}
export declare class SearchScraper {
    search(text: string): Promise<SearchInfo[]>;
    private parseBookInfo;
    private extractBookRoute;
    private extractYear;
    private extractAuthor;
    private getTextContent;
    private getAttribute;
    private splitAndTrim;
    private safeNumberConvert;
}
