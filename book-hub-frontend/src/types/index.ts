export interface Author {
  _id?: string;
  name: string;
  bio?: string;
}

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

export interface FilterState {
  query: string;
  genres: string[];       // selected genres
  authors: string[];      // selected authors ids/names
  sortBy: "date" | "rating" | "title";
  page: number;
  pageSize: number;
  startDate?: string | null;
  endDate?: string | null;
}
