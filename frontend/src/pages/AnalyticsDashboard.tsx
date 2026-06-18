import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "../store/store";
import { Header } from "../components/Header";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  Film, Heart, Eye, Bookmark, TrendingUp, Star, Award, Users,
} from "lucide-react";

const COLORS = ["#e11d48","#7c3aed","#2563eb","#059669","#d97706","#db2777","#0891b2","#65a30d"];

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-gray-700/20 shadow-lg flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

export default function AnalyticsDashboard() {
  const watchedMovies  = useSelector((s: RootState) => s.watched?.movies      ?? []);
  const favorites      = useSelector((s: RootState) => s.favorites?.movies    ?? []);
  const watchlist      = useSelector((s: RootState) => s.watchlist?.movies    ?? []);
  const compareMovies  = useSelector((s: RootState) => s.compare?.compareMovies ?? []);

  const allMovies = useMemo(() => {
    const map = new Map<string, typeof watchedMovies[0]>();
    [...watchedMovies, ...favorites, ...watchlist].forEach(m => m?.imdbID && map.set(m.imdbID, m));
    return [...map.values()];
  }, [watchedMovies, favorites, watchlist]);

  const genreData = useMemo(() => {
    const counts: Record<string, number> = {};
    allMovies.forEach(m => {
      (m.Genre || "").split(", ").forEach(g => {
        const genre = g.trim();
        if (genre) counts[genre] = (counts[genre] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [allMovies]);

  const yearData = useMemo(() => {
    const counts: Record<string, number> = {};
    allMovies.forEach(m => {
      const y = (m.Year || "").slice(0, 4);
      if (/^\d{4}$/.test(y)) counts[y] = (counts[y] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])).map(([year, count]) => ({ year, count }));
  }, [allMovies]);

  const ratingData = useMemo(() => {
    const buckets: Record<string, number> = { "9-10": 0, "7-8": 0, "5-6": 0, "<5": 0 };
    allMovies.forEach(m => {
      const r = parseFloat(m.imdbRating || "0");
      if (r >= 9) buckets["9-10"]++;
      else if (r >= 7) buckets["7-8"]++;
      else if (r >= 5) buckets["5-6"]++;
      else if (r > 0) buckets["<5"]++;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }, [allMovies]);

  const topRated = useMemo(() =>
    [...allMovies]
      .filter(m => parseFloat(m.imdbRating ?? "0") >= 7)
      .sort((a, b) => parseFloat(b.imdbRating ?? "0") - parseFloat(a.imdbRating ?? "0"))
      .slice(0, 5),
    [allMovies]
  );

  const stats = [
    { icon: Eye,      label: "Movies Watched",  value: watchedMovies.length,  color: "from-blue-500 to-blue-700" },
    { icon: Heart,    label: "Favourites",       value: favorites.length,      color: "from-red-500 to-red-700" },
    { icon: Bookmark, label: "Watchlist",        value: watchlist.length,      color: "from-purple-500 to-purple-700" },
    { icon: Film,     label: "Total Tracked",    value: allMovies.length,      color: "from-green-500 to-green-700" },
    { icon: Star,     label: "Avg IMDB Rating",  value: allMovies.length
        ? (allMovies.reduce((s, m) => s + (parseFloat(m.imdbRating ?? "0") || 0), 0) / allMovies.length).toFixed(1)
        : "–",                                                                 color: "from-yellow-500 to-yellow-700" },
    { icon: TrendingUp, label: "Comparing Now",  value: compareMovies.length,  color: "from-pink-500 to-pink-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Header />
      <main className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-1">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Your personal movie activity at a glance</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 shadow-lg text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.color} mx-auto mb-2`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {allMovies.length === 0 ? (
          <div className="text-center py-24">
            <Film className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">No data yet</h2>
            <p className="text-gray-400 dark:text-gray-600">Start watching, favouriting, and adding movies to your watchlist to see analytics here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Genre Distribution */}
            {genreData.length > 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Film className="w-5 h-5 text-red-500" /> Genre Distribution
                </h2>
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                        {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Tooltip formatter={(v: any) => [v, "movies"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* IMDB Rating Buckets */}
            {ratingData.some(r => r.count > 0) && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" /> Rating Distribution
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ratingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="range" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }} labelStyle={{ color: "#f9fafb" }} itemStyle={{ color: "#fbbf24" }} />
                    <Bar dataKey="count" fill="#fbbf24" radius={[6, 6, 0, 0]} name="Movies" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Movies by Year */}
            {yearData.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg lg:col-span-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" /> Movies by Release Year
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={yearData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }} labelStyle={{ color: "#f9fafb" }} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4, fill: "#7c3aed" }} name="Movies" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Top Rated */}
            {topRated.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg lg:col-span-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" /> Your Top Rated Movies
                </h2>
                <div className="space-y-3">
                  {topRated.map((m, i) => (
                    <div key={m.imdbID} className="flex items-center gap-4">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                        {i + 1}
                      </span>
                      {m.Poster && m.Poster !== "N/A" && (
                        <img src={m.Poster} alt={m.Title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{m.Title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{m.Year} · {m.Genre?.split(", ").slice(0, 2).join(", ")}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-yellow-400">{m.imdbRating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
