import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setMovieDetails, addUserRating, setLoading, setError } from "../store/movieSlice";
import { addMovieToCompare } from "@/store/compareMovieSlice";
import { movieApi } from "../services/movieApi";
import { Header } from "../components/Header";
import { Button } from "../components/ui/Button";
import { StarRating } from "../components/ui/StarRating";
import { ArrowLeft, Calendar, Clock, Globe, Award, Users, Film } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useDebounce";
import { LoadingSkeleton } from "@/components/LoadingStates";
import { trailerApi } from "@/services/trailerApi";
import { TrailerPlayer } from "@/components/TrailerPlayer";

export default function MovieDetailsPage() {
  const { id: movieId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movieDetails, loading, error } = useSelector((state: RootState) => state.movies);
  const [userRatings, setUserRatings] = useLocalStorage<Array<{ movieId: string; rating: number }>>("userRatings", []);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [trailerVideoId, setTrailerVideoId] = useState<string | null>(null);

  const movie = movieId ? movieDetails[movieId] : undefined;
  const userRating = userRatings.find((r) => r.movieId === movieId)?.rating || 0;

  useEffect(() => {
    if (!movieId) return;
    const fetchMovieDetails = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const details = await movieApi.getMovieDetails(movieId);
        if (details.Response === "True") {
          dispatch(setMovieDetails({ id: movieId, details }));
          try {
            const trailer = await trailerApi.searchTrailerByTitle(details.Title, details.Year);
            if (trailer) setTrailerVideoId(trailer.videoId);
          } catch {}
        } else {
          dispatch(setError(details.Error || "Movie not found"));
        }
      } catch {
        dispatch(setError("Failed to load movie details"));
      } finally {
        dispatch(setLoading(false));
      }
    };
    if (!movie) fetchMovieDetails();
    else {
      trailerApi.searchTrailerByTitle(movie.Title, movie.Year).then((t) => { if (t) setTrailerVideoId(t.videoId); }).catch(() => {});
    }
  }, [movieId, dispatch, movie]);

  const handleRating = (rating: number) => {
    if (!movieId) return;
    const existingIndex = userRatings.findIndex((r) => r.movieId === movieId);
    const newRatings = [...userRatings];
    if (existingIndex >= 0) {
      newRatings[existingIndex] = { movieId, rating };
    } else {
      newRatings.push({ movieId, rating });
    }
    setUserRatings(newRatings);
    dispatch(addUserRating({ movieId, rating }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-32"><LoadingSkeleton count={6} /></main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Header />
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{error || "Movie not found"}</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const ratings = movie.Ratings || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero section */}
        <div className="relative">
          {movie.Poster && movie.Poster !== "N/A" && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={movie.Poster}
                alt=""
                aria-hidden
                className="w-full h-full object-cover opacity-10 blur-2xl scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-gray-900"></div>
            </div>
          )}

          <div className="relative container mx-auto px-4 py-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Poster */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[2/3]">
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                      <Film className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-full object-cover"
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Film className="w-24 h-24 text-gray-600" />
                    </div>
                  )}
                </motion.div>

                {/* Compare button */}
                <Button
                  onClick={() => dispatch(addMovieToCompare(movie))}
                  variant="outline"
                  className="w-full mt-4 border-white/20 text-white hover:bg-white/10">
                  + Add to Compare
                </Button>
              </div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2">{movie.Title}</h1>
                  <div className="flex flex-wrap gap-3 text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{movie.Year}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{movie.Runtime}</span>
                    <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{movie.Language}</span>
                    <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">{movie.Rated}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.Genre?.split(", ").map((g) => (
                    <span key={g} className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-sm text-red-300 font-medium">{g}</span>
                  ))}
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">{movie.Plot}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Director", value: movie.Director, icon: Film },
                    { label: "Cast", value: movie.Actors, icon: Users },
                    { label: "Awards", value: movie.Awards, icon: Award },
                    { label: "Country", value: movie.Country, icon: Globe },
                  ].map(({ label, value, icon: Icon }) => value && value !== "N/A" && (
                    <div key={label}>
                      <div className="flex items-center gap-1 text-gray-500 mb-1"><Icon className="w-3 h-3" />{label}</div>
                      <div className="text-white font-medium">{value}</div>
                    </div>
                  ))}
                </div>

                {ratings.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {ratings.map((r) => (
                      <div key={r.Source} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                        <div className="text-xl font-bold text-yellow-400">{r.Value}</div>
                        <div className="text-xs text-gray-400">{r.Source}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <span className="text-gray-400 font-medium">Your Rating:</span>
                  <StarRating rating={userRating} onRatingChange={handleRating} size="md" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {trailerVideoId && (
          <div className="container mx-auto px-4 mt-12">
            <h2 className="text-2xl font-bold mb-4">Official Trailer</h2>
            <TrailerPlayer videoId={trailerVideoId} title={movie.Title} />
          </div>
        )}
      </main>
    </div>
  );
}
