# DB Knih API

DB Knih API je npm balíček poskytující jednoduché rozhraní pro čtení informací z databáze knih. Balíček obsahuje funkce pro vyhledávání knih a získávání podrobností o konkrétní knize.

## Instalace

Pro instalaci DB Knih API můžete použít npm:

```bash
npm install dbknih
```

## Použití

```javascript
const { dbKnih } = require("dbknih");

const searchResults: SearchInfo[] = await dbKnih.search("Harry Potter");

const bookInfo: BookInfo[] = await dbKnih.getBookInfo(
  "https://example.com/book/harry-potter-and-the-philosophers-stone"
);
```

#### Metody

`search(text: string): Promise<SearchInfo[]>:` Vyhledává knihy na základě zadaného textu.
`getBookInfo(bookLink: string): Promise<BookInfo | undefined>:` Získává podrobnosti o konkrétní knize na základě odkazu.

#### Typy

```javascript
interface SearchInfo {
  name?: string;
  cleanName?: string;
  id?: number;
  year?: number;
  author?: string;
}

interface BookInfo {
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

interface Review {
  text?: string;
  rating?: number;
  username?: string;
  date?: string;
}
```

## License

Tento projekt je licencován pod MIT licencí
