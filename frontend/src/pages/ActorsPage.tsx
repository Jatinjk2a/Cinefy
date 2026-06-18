import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../components/Header";
import { SearchBar, SearchBarRef } from "../components/SearchBar";
import { ActorGrid } from "../components/ActorGrid";
import { MovieGrid } from "../components/MovieGrid";
import { LoadingSkeleton, EmptyState } from "../components/LoadingStates";
import { usePopularActors, useActorSearch, useMoviesByActor } from "../hooks/useActorQueries";
import { useDebounce } from "../hooks/useDebounce";
import { User, TrendingUp } from "lucide-react";
import { Actor } from "../types/movie";

export default function ActorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const searchBarRef = useRef<SearchBarRef>(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: popularActors, isLoading: isLoadingPopular } = usePopularActors();
  const { data: searchResults, isLoading: isSearching } = useActorSearch(debouncedQuery);
  const { data: actorMovies, isLoading: isLoadingActorMovies } = useMoviesByActor(selectedActor?.name || "");

  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasSelectedActor = selectedActor !== null;

  const handleActorClick = (actor: Actor) => {
    setSelectedActor(actor);
    setToastMessage(`🎭 Loading movies by ${actor.name}...`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedActor(null);
    searchBarRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSelectedActor(null);
    setToastMessage(`🎭 Searching for "${suggestion}"...`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const displayedActors = hasSearchQuery && searchResults ? searchResults : (popularActors || []);
  const isLoading = hasSearchQuery ? isSearching : isLoadingPopular;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
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

      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Actors & Filmography</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Discover actors and explore their movie collections</p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar
            ref={searchBarRef}
            value={searchQuery}
            onChange={setSearchQuery}
            year=""
            genre="all"
            searchType="actor"
            onYearChange={() => {}}
            onGenreChange={() => {}}
            onSearchTypeChange={() => {}}
            onClearFilters={() => setSearchQuery("")}
          />
        </div>

        {hasSelectedActor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                <User className="inline w-6 h-6 mr-2" />
                Movies by {selectedActor.name}
              </h2>
              <button onClick={handleClearSearch} className="text-red-500 hover:text-red-400 font-semibold text-sm">
                Clear Selection
              </button>
            </div>
            {isLoadingActorMovies ? (
              <LoadingSkeleton count={8} />
            ) : actorMovies?.Search && actorMovies.Search.length > 0 ? (
              <MovieGrid movies={actorMovies.Search} />
            ) : (
              <EmptyState query={selectedActor.name} />
            )}
          </motion.div>
        )}

        {!hasSelectedActor && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {hasSearchQuery ? "Search Results" : "Popular Actors"}
              </h2>
            </div>
            {isLoading ? (
              <LoadingSkeleton count={8} />
            ) : displayedActors.length > 0 ? (
              <ActorGrid actors={displayedActors} onActorClick={handleActorClick} />
            ) : (
              <EmptyState query={debouncedQuery || " "} />
            )}
          </div>
        )}
      </main>
    </motion.div>
  );
}
