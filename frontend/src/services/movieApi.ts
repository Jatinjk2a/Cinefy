import { SearchResponse, MovieDetails } from "../types/movie";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

interface SearchParams {
  s: string;
  page?: number;
  y?: string;
  type?: string;
}

export const movieApi = {
  searchMovies: async (
    query: string,
    params: Partial<SearchParams> = {}
  ): Promise<SearchResponse> => {
    if (!API_KEY) throw new Error("OMDB API key not configured. Set VITE_OMDB_API_KEY.");

    const searchParams = new URLSearchParams({
      s: query,
      apikey: API_KEY,
      page: "1",
      ...Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
      ),
    });

    const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (data.Response === "False") {
      if (data.Error === "Movie not found!")
        return { Search: [], totalResults: "0", Response: "False", Error: data.Error };
      throw new Error(data.Error || "Unknown API error");
    }
    return data;
  },

  searchTvShows: async (query: string, page = 1): Promise<SearchResponse> => {
    if (!API_KEY) throw new Error("OMDB API key not configured.");
    const searchParams = new URLSearchParams({
      s: query,
      apikey: API_KEY,
      type: "series",
      page: page.toString(),
    });
    const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);
    return response.json();
  },

  searchMoviesWithPagination: async (
    query: string,
    page = 1,
    params: Partial<Omit<SearchParams, "page">> = {}
  ): Promise<SearchResponse> => {
    if (!API_KEY) throw new Error("OMDB API key not configured.");
    const searchParams = new URLSearchParams({
      s: query,
      apikey: API_KEY,
      page: page.toString(),
      ...Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
      ),
    });
    const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.Response === "False") {
      if (data.Error === "Movie not found!")
        return { Search: [], totalResults: "0", Response: "False", Error: data.Error };
      throw new Error(data.Error || "Unknown API error");
    }
    return data;
  },

  getMovieDetails: async (imdbID: string): Promise<MovieDetails> => {
    if (!API_KEY) throw new Error("OMDB API key not configured.");
    const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
    return response.json();
  },

  getMoviesByTitle: async (title: string): Promise<SearchResponse> => {
    if (!API_KEY) throw new Error("OMDB API key not configured.");
    const response = await fetch(
      `${BASE_URL}?s=${encodeURIComponent(title)}&apikey=${API_KEY}`
    );
    return response.json();
  },
};
