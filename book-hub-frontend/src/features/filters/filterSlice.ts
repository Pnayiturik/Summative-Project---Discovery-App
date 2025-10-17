import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FilterState } from "../../types";

const initialState: FilterState = {
  query: "",
  genres: [],
  authors: [],
  sortBy: "date",
  page: 1,
  pageSize: 12,
  startDate: null,
  endDate: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) { 
      state.query = action.payload; 
      state.page = 1; 
    },
    toggleGenre(state, action: PayloadAction<string>) {
      const idx = state.genres.indexOf(action.payload);
      if (idx >= 0) state.genres.splice(idx, 1);
      else state.genres.push(action.payload);
      state.page = 1;
    },
    setAuthors(state, action: PayloadAction<string[]>) { 
      state.authors = action.payload; 
      state.page = 1; 
    },
    setSortBy(state, action: PayloadAction<FilterState["sortBy"]>) { 
      state.sortBy = action.payload; 
    },
    setPage(state, action: PayloadAction<number>) { 
      state.page = action.payload; 
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1; // Reset to first page when changing page size
    },
    resetFilters() { 
      return initialState; 
    }
  }
});

export const { setQuery, toggleGenre, setAuthors, setSortBy, setPage, setPageSize, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;