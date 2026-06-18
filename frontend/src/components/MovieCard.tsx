import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types/movie";
import { Card, CardContent } from "./ui/Card";
import { StarRating } from "./ui/StarRating";
import { WatchlistButton } from "./WatchlistButton";
import { Calendar, Film, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useDebounce";
import { ShareButton } from "./ShareButton";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const [userRatings, setUserRatings] = useLocalStorage<Array<{ movieId: string; rating: number }>>("userRatings", []);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);

  const userRating = isHydrated ? userRatings.find((r) => r.movieId === movie.imdbID)?.rating || 0 : 0;

  const handleRating = (rating: number) => {
    const existingIndex = userRatings.findIndex((r) => r.movieId === movie.imdbID);
    const newRatings = [...userRatings];
    if (existingIndex >= 0) {
      newRatings[existingIndex] = { movieId: movie.imdbID, rating };
    } else {
      newRatings.push({ movieId: movie.imdbID, rating });
    }
    setUserRatings(newRatings);
  };

  const getFallbackPosterUrl = (title: string) =>
    `https://via.placeholder.com/300x450/1f2937/ffffff?text=${encodeURIComponent(title)}`;

  const handleImageError = () => {
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1);
      setIsImageLoading(true);
      setImageError(false);
      setTimeout(() => {
        const img = new window.Image();
        img.onload = () => { setIsImageLoading(false); setImageError(false); };
        img.onerror = () => { setImageError(true); setIsImageLoading(false); };
        img.src = movie.Poster;
      }, 1000);
    } else {
      setImageError(true);
      setIsImageLoading(false);
    }
  };

  const handleCardClick = () => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 800);
  };

  const posterSrc = imageError ? getFallbackPosterUrl(movie.Title) : movie.Poster;
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, scale: isNavigating ? 0.98 : 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full group relative">
      <Card className={`overflow-hidden h-full shadow-xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-red-500/50 transition-all duration-500 flex flex-col ${isNavigating ? "ring-2 ring-red-400/50 ring-offset-2 ring-offset-black" : ""}`}>
        <div className="aspect-[2/3] relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden flex-shrink-0">
          {hasPoster ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Film className="w-8 h-8 text-blue-500" />
                  </motion.div>
                  {retryCount > 0 && <div className="absolute bottom-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">Retry {retryCount}/2</div>}
                </div>
              )}
              <img
                src={posterSrc}
                alt={movie.Title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                onLoad={() => setIsImageLoading(false)}
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/20 via-purple-500/20 to-blue-500/20 dark:from-red-900/30 dark:via-purple-900/30 dark:to-blue-900/30">
              <div className="text-center p-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Film className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{movie.Title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{movie.Year} • {movie.Type}</p>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center opacity-0 transition-all duration-300">
            <Link to={`/movies/${movie.imdbID}`} onClick={handleCardClick}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-3 bg-white/95 backdrop-blur-md text-gray-900 rounded-full font-semibold hover:bg-white transition-all duration-300 shadow-lg border border-white/20">
                <Eye className="w-5 h-5" />
                View Details
              </motion.button>
            </Link>
          </motion.div>

          {isHydrated && userRating > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ {userRating}
            </div>
          )}

          <div className="absolute top-3 left-3">
            <WatchlistButton movie={movie} size="sm" />
          </div>
          <div className="absolute top-1 right-3">
            <ShareButton movie={movie} size="sm" />
          </div>
        </div>

        <CardContent className="p-5 flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t-0">
          <div className="flex-1">
            <Link to={`/movies/${movie.imdbID}`} onClick={handleCardClick}>
              <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer leading-tight">
                {movie.Title}
              </h3>
            </Link>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{movie.Year}</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                {movie.Type.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Rating:</span>
              {isHydrated ? (
                <StarRating rating={userRating} onRatingChange={handleRating} size="sm" />
              ) : (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
