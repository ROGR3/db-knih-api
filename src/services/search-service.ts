import { fetchPage, createSearchUrl } from "../fetchers/fetch";
import { HTMLElement, parse } from 'node-html-parser';

export interface SearchInfo {
    name?: string;
    cleanName?: string;
    id?: number;
    year?: number;
    author?: string;
}

export class SearchScraper {
    public async search(text: string): Promise<SearchInfo[]> {
        const url = createSearchUrl(text);
        const response = await fetchPage(url);
        const html = parse(response);
        const bookElements = html.querySelectorAll('p.new');

        return bookElements.map(this.parseBookInfo.bind(this));
    }

    private parseBookInfo(element: HTMLElement): SearchInfo {
        const bookRoute = this.extractBookRoute(element);
        return {
            name: this.getTextContent(element, "a.new"),
            id: this.safeNumberConvert(bookRoute.pop()),
            cleanName: bookRoute.join("-"),
            year: this.extractYear(element),
            author: this.extractAuthor(element),
        };
    }

    private extractBookRoute(element: HTMLElement): string[] {
        const href = this.getAttribute(element, "a.new", "href");
        return this.splitAndTrim(href, "/", 2)?.split("-") || [];
    }

    private extractYear(element: HTMLElement): number {
        const yearString = this.splitAndTrim(this.getTextContent(element, "span.smallfind"), ",", 0);
        return this.safeNumberConvert(yearString);
    }

    private extractAuthor(element: HTMLElement): string {
        return this.splitAndTrim(this.getTextContent(element, "span.smallfind"), ",", 1) || "";
    }

    private getTextContent(element: HTMLElement, selector: string): string | undefined {
        const selectedElement = element.querySelector(selector);
        return selectedElement?.text;
    }

    private getAttribute(element: HTMLElement, selector: string, attributeName: string): string | undefined {
        const selectedElement = element.querySelector(selector);
        return selectedElement?.getAttribute(attributeName);
    }

    private splitAndTrim(text: string | undefined, separator: string, index: number): string | undefined {
        if (text) {
            const parts = text.trim().split(separator);
            return parts[index]?.trim();
        }
        return undefined;
    }

    private safeNumberConvert(text: string | undefined): number {
        return text ? Number(text) : 0;
    }
}
