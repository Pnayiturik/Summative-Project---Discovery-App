/**
 * Represents an author of a book
 */
export interface Author {
  _id?: string;
  name: string;
  bio?: string;
}

/**
 * Represents a book in the system
 */
export interface Book {
  _id?: string;
  title: string;
  authors: Author[] | string[]; // if just author ids or embedded docs
  genre: string[];
  description?: string;
  publishedDate?: string; // ISO date
  rating?: number; // 0-5
  coverUrl?: string;
  pages?: number;
  isbn?: string;
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  token?: string;
}

/**
 * Represents the state of filters in the Redux store
 * Used for managing book filtering and search functionality
 */
export interface FilterState {
  query: string;          // search query string
  genres: string[];       // selected genres for filtering
  authors: string[];      // selected authors for filtering
  sortBy: "date" | "rating" | "title"; // current sort criteria
  page: number;          // current page number (1-based)
  pageSize: number;      // number of items per page
  startDate?: string | null; // publication date range start
  endDate?: string | null;   // publication date range end
}
