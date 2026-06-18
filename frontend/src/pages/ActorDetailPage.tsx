import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { MovieGrid } from "../components/MovieGrid";
import { LoadingSkeleton, ErrorState, EmptyState } from "../components/LoadingStates";
import { useMoviesByActor } from "../hooks/useActorQueries";
import { User, Calendar, MapPin, Film, Star, Award, TrendingUp, ArrowLeft } from "lucide-react";
import { Actor } from "../types/movie";
import { actorApi } from "../services/actorApi";

export default function ActorDetailPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [actor, setActor] = useState<Actor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "filmography" | "stats">("overview");

  const actorName = decodeURIComponent(name || "");
  const { data: actorMovies, isLoading: isLoadingMovies } = useMoviesByActor(actorName);

  useEffect(() => {
    if (!actorName) return;
    setIsLoading(true);
    const actorDetails = actorApi.getActorDetails(actorName);
    if (actorDetails) {
      setActor(actorDetails);
    } else {
      setError("Actor not found");
    }
    setIsLoading(false);
  }, [actorName]);

  const currentYear = new Date().getFullYear();
  const age = actor ? currentYear - actor.birthYear : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-32"><LoadingSkeleton count={6} /></main>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-32">
          <ErrorState message={error || "Actor not found"} />
        </main>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)]"></div>
      </div>

      <Header />

      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{actor.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{actor.nationality}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>Born {actor.birthYear} (Age {age})</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{actor.nationality}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Film className="w-4 h-4 text-blue-500" />
                  <span>{actor.movies.length} known films</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{actor.genres.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-6">
              {(["overview", "filmography", "stats"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all duration-200 ${activeTab === tab ? "bg-gradient-to-r from-red-500 to-purple-600 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-800/50"}`}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Known For</h2>
                <div className="grid grid-cols-2 gap-3">
                  {actor.movies.slice(0, 6).map((movie) => (
                    <div key={movie} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {movie}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {actor.genres.map((genre) => (
                    <span key={genre} className="px-3 py-1 bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20 rounded-full text-sm text-red-600 dark:text-red-400 font-medium">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "filmography" && (
              <div>
                {isLoadingMovies ? (
                  <LoadingSkeleton count={4} />
                ) : actorMovies?.Search && actorMovies.Search.length > 0 ? (
                  <MovieGrid movies={actorMovies.Search} />
                ) : (
                  <EmptyState query={actorName} />
                )}
              </div>
            )}

            {activeTab === "stats" && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" /> Career Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Films", value: actor.movies.length, icon: Film },
                    { label: "Genres", value: actor.genres.length, icon: Award },
                    { label: "Career Span", value: `${currentYear - actor.birthYear - 20}+ yrs`, icon: Calendar },
                    { label: "Nationality", value: actor.nationality, icon: MapPin },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
