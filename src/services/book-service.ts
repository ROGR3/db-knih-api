import { createAdditionalBookInfoUrl, createBookInfoUrl, fetchPage } from "../fetchers/fetch";
import { HTMLElement, parse } from 'node-html-parser';

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

export class BookScraper {

    public async getBookInfo(bookLink: string): Promise<BookInfo | undefined> {
        const bookHtml = parse(await fetchPage(createBookInfoUrl(bookLink)));
        const additionalInfoHtml = parse(await fetchPage(createAdditionalBookInfoUrl(bookLink.split("-").pop() ?? "")));

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
    }

    private getBookPlot(bookHTMLContent: HTMLElement): string | undefined {
        const mainPlot = this.getTextContent(bookHTMLContent, ".justify.new2.odtop")?.replace(/\.\.\.\. celý text|\.\./g, "");
        const additionalPlot = this.getTextContent(bookHTMLContent, ".justify.new2.odtop>span");
        return mainPlot + "" + additionalPlot;
    }

    private getGenres(bookHTMLContent: HTMLElement): string[] | undefined {
        const genreString = this.getTextContent(bookHTMLContent, '[itemprop="genre"]');
        return genreString ? genreString.split(",").map(genre => genre.trim()) : undefined;
    }

    private getPublishedYear(bookHTMLContent: HTMLElement): number {
        const yearString = this.splitAndTrim(this.getTextContent(bookHTMLContent, ".detail_description>h4"), ",", 1) || this.getTextContent(bookHTMLContent, '[itemprop="datePublished"]');
        return this.safeNumberConvert(yearString);
    }

    private getPublisher(bookHTMLContent: HTMLElement): string | undefined {
        return this.getTextContent(bookHTMLContent, '[itemprop="publisher"]');
    }

    private getRating(bookHTMLContent: HTMLElement): number {
        const ratingString = this.getTextContent(bookHTMLContent, ".bpoints")?.replace(" %", "");
        return this.safeNumberConvert(ratingString);
    }

    private getNumberOfRatings(bookHTMLContent: HTMLElement): number {
        const ratingsString = this.getTextContent(bookHTMLContent, "#voixis>.ratingDetail")?.replace(" hodnocení", "");
        return this.safeNumberConvert(ratingsString);
    }

    private getReviews(bookHTMLContent: HTMLElement): Review[] {
        return bookHTMLContent
            .querySelectorAll(".komentars_user")
            .slice(0, 5)
            .map(reviewElement => ({
                text: this.getTextContent(reviewElement, ".komholdu>p")?.trim(),
                rating: this.getReviewRating(reviewElement),
                username: this.getAttribute(reviewElement, "img", "title"),
                date: this.getTextContent(reviewElement, ".fright.clear_comm>.pozn_light.odleft_pet"),
            }));
    }

    private getReviewRating(reviewElement: HTMLElement): number {
        const titleAttribute = this.getAttribute(reviewElement, ".fright.clear_comm>img", "title");
        return this.safeNumberConvert(titleAttribute?.split(" ")[0]);
    }

    private getPageCount(bookHTMLContent: HTMLElement): number {
        const pageCount = bookHTMLContent.querySelector('[itemprop="numberOfPages"]')?.text;
        return this.safeNumberConvert(pageCount);
    }
    private getOriginalLanguage(bookHTMLContent: HTMLElement): string | undefined {
        const originalLanguage = bookHTMLContent.querySelector('[itemprop="language"]')?.text.trim()
        return originalLanguage;
    }

    private getIsbn(bookHTMLContent: HTMLElement): string | undefined {
        const isbn = bookHTMLContent.querySelector('[itemprop="isbn"]')?.text.trim()
        return isbn;
    }
    private getCoverImage(bookHTMLContent: HTMLElement): string | undefined {
        return this.getAttribute(bookHTMLContent, ".kniha_img", "src");
    }

    private getTextContent(element: HTMLElement, selector: string): string | undefined {
        const selectedElement = element.querySelector(selector);
        return selectedElement?.text.trim();
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
        return text ? Number(text.replace(" ", "")) : 0;
    }
}
