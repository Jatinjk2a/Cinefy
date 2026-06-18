export interface Movie {
	imdbID: string;
	Title: string;
	Year: string;
	Type: string;
	Poster: string;
	// Optional — present when full details have been fetched
	Genre?: string;
	imdbRating?: string;
	Runtime?: string;
	Director?: string;
	Actors?: string;
	Plot?: string;
	Language?: string;
	Country?: string;
	Awards?: string;
	Response?: string;
	Error?: string;
}

export interface MovieDetails {
	imdbID: string;
	Title: string;
	Year: string;
	Rated: string;
	Released: string;
	Runtime: string;
	Genre: string;
	Director: string;
	Writer: string;
	Actors: string;
	Plot: string;
	Language: string;
	Country: string;
	Awards: string;
	Poster: string;
	Ratings: Array<{
		Source: string;
		Value: string;
	}>;
	Metascore: string;
	imdbRating: string;
	imdbVotes: string;
	Type: string;
	DVD: string;
	BoxOffice: string;
	Production: string;
	Website: string;
	Response: string;
	Error?: string;
}

export interface SearchResponse {
	Search: Movie[];
	totalResults: string;
	Response: string;
	Error?: string;
}

export interface UserRating {
	movieId: string;
	rating: number;
}

// Actor-related types
export interface Actor {
	name: string;
	movies: string[];
	genres: string[];
	birthYear: number;
	nationality: string;
}

export interface ActorSearchResult {
	actor: Actor;
	matchedMovies: Movie[];
	totalMovies: number;
}

export interface SearchType {
	type: 'movie' | 'actor';
	query: string;
}
