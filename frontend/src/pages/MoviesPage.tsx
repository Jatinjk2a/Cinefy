import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { SearchBar, SearchBarRef } from "../components/SearchBar";
import { MovieGrid } from "../components/MovieGrid";
import { ActorGrid } from "../components/ActorGrid";
import { LoadingSkeleton, ErrorState, EmptyState } from "../components/LoadingStates";
import { useMoviesWithGenreFilter } from "../hooks/useMovieQueries";
import { useCombinedSearch, useInfiniteMoviesByActor } from "../hooks/useActorQueries";
import { useDebounce } from "../hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, User } from "lucide-react";

const movieGenres = [
  { value: "all", label: "All Genres" },
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Animation", label: "Animation" },
  { value: "Biography", label: "Biography" },
  { value: "Comedy", label: "Comedy" },
  { value: "Crime", label: "Crime" },
  { value: "Documentary", label: "Documentary" },
  { value: "Drama", label: "Drama" },
  { value: "Family", label: "Family" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "History", label: "History" },
  { value: "Horror", label: "Horror" },
  { value: "Music", label: "Music" },
  { value: "Mystery", label: "Mystery" },
  { value: "Romance", label: "Romance" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Sport", label: "Sport" },
  { value: "Thriller", label: "Thriller" },
  { value: "War", label: "War" },
  { value: "Western", label: "Western" },
];

function MoviesPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("all");
  const [searchType, setSearchType] = useState<"movie" | "actor" | "both">("both");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const searchBarRef = useRef<SearchBarRef>(null);

  const [searchParams] = useSearchParams();
  const urlGenreParam = searchParams.get("genre");

  useEffect(() => {
    if (urlGenreParam && urlGenreParam !== "all" && genre !== urlGenreParam) {
      setGenre(urlGenreParam);
      setSearchQuery(urlGenreParam);
      setToastMessage(`🎬 Exploring ${urlGenreParam} movies...`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else if (!urlGenreParam && searchQuery !== "") {
      setGenre("all");
    }
  }, [urlGenreParam]); // eslint-disable-line

  const debouncedQuery = useDebounce(searchQuery, 500);
  const debouncedYear = useDebounce(year, 500);

  const { movies: combinedMovies, actors: combinedActors, isLoading: isCombinedLoading, error: combinedError } = useCombinedSearch(debouncedQuery, searchType);

  const moviesForFilter = searchType !== "actor" ? (combinedMovies?.Search || []) : [];
  const { filteredMovies, isFiltering } = useMoviesWithGenreFilter(moviesForFilter, genre !== "all" ? genre : undefined);

  const { data: actorMoviesData, isLoading: isLoadingActorMovies } = useInfiniteMoviesByActor(
    searchType === "actor" && debouncedQuery ? debouncedQuery : ""
  );

  const actorMoviesList = actorMoviesData?.pages?.flatMap((p) => p.Search || []) || [];
  const baseMovies = searchType === "actor" ? actorMoviesList : filteredMovies;
  const displayMovies = debouncedYear
    ? baseMovies.filter((m) => m.Year?.includes(debouncedYear))
    : baseMovies;
  const isLoading = isCombinedLoading || isFiltering || (searchType === "actor" && isLoadingActorMovies);

  const hasResults = displayMovies.length > 0 || (combinedActors && combinedActors.length > 0);

  const handleSearch = (query: string) => { setSearchQuery(query); };
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setToastMessage(`🎬 Searching for "${suggestion}"...`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.3),_transparent_50%)]"></div>
      </div>

      <Header />

      {showToast && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl border border-white/10">
            {toastMessage}
          </motion.div>
        </AnimatePresence>
      )}

      <main className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 via-red-600 to-purple-600 dark:from-white dark:via-red-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            Discover Movies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300">
            Search millions of films and TV shows
          </motion.p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-3xl mx-auto mb-8">
          <SearchBar
            ref={searchBarRef}
            value={searchQuery}
            onChange={setSearchQuery}
            year={year}
            genre={genre}
            searchType={searchType}
            onYearChange={setYear}
            onGenreChange={setGenre}
            onSearchTypeChange={setSearchType}
            onClearFilters={() => { setYear(""); setGenre("all"); setSearchType("both"); }}
          />
        </div>

        {/* Active filters display */}
        {(genre !== "all" || year) && (
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {genre !== "all" && (
              <span className="flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-600 dark:text-red-400 text-sm font-medium">
                <Tag className="w-3 h-3" /> {genre}
                <button onClick={() => setGenre("all")} className="ml-1 hover:text-red-800">×</button>
              </span>
            )}
            {year && (
              <span className="flex items-center gap-1 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-600 dark:text-purple-400 text-sm font-medium">
                {year}
                <button onClick={() => setYear("")} className="ml-1 hover:text-purple-800">×</button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {!debouncedQuery ? (
          <EmptyState />
        ) : isLoading ? (
          <LoadingSkeleton count={8} />
        ) : combinedError ? (
          <ErrorState message={String(combinedError)} />
        ) : !hasResults ? (
          <EmptyState query={debouncedQuery} />
        ) : (
          <div className="space-y-10">
            {combinedActors && combinedActors.length > 0 && searchType !== "movie" && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Actors</h2>
                </div>
                <ActorGrid actors={combinedActors} onActorClick={() => {}} />
              </section>
            )}

            {displayMovies.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Movies {genre !== "all" && `• ${genre}`}
                    <span className="ml-2 text-sm font-normal text-gray-500">({displayMovies.length})</span>
                  </h2>
                </div>
                <MovieGrid movies={displayMovies} />
              </section>
            )}
          </div>
        )}
      </main>
    </motion.div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <MoviesPageContent />
    </Suspense>
  );
}
