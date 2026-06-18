import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { motion } from "framer-motion";
import { Tag, Search } from "lucide-react";

const movieGenres = [
  "Action","Adventure","Animation","Biography","Comedy","Crime","Drama",
  "Family","Fantasy","History","Horror","Music","Mystery","Romance",
  "Sci-Fi","Sport","Thriller","War","Western",
].map((g) => ({ value: g, label: g }));

const GenresPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredGenres = movieGenres.filter((g) =>
    g.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <main className="container mx-auto px-6 pt-32 pb-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Explore by Genre
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
            Find your next favorite story, tailored to your mood.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-12 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/50 dark:bg-black/50 border border-white/20 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredGenres.length > 0 ? (
            filteredGenres.map((genre, index) => (
              <motion.div
                key={genre.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}>
                <Link to={`/movies?genre=${genre.value}`} className="block group">
                  <div className="relative p-8 h-full bg-white/5 dark:bg-black/20 rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-red-500/10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 p-4 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        <Tag className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{genre.label}</h3>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                No genres found for &quot;{searchTerm}&quot;
              </h2>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default GenresPage;
