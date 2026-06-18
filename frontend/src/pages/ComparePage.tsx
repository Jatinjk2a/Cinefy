import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCompareMovies } from "../store/compareMovieSlice";
import { Header } from "../components/Header";
import { motion } from "framer-motion";
import { GitCompare, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import StatChart from "../components/StatChart";
import CustomTooltip from "../components/CustomTooltip";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList,
} from "recharts";

export default function ComparePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { compareMovies } = useSelector((state: RootState) => state.compare);

  if (compareMovies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <main className="pt-32 pb-16 container mx-auto px-4 text-center text-white">
          <GitCompare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold mb-4">No movies to compare</h2>
          <p className="text-gray-400 mb-8">Add movies from the movies page to compare them side by side.</p>
          <Button onClick={() => navigate("/movies")}>Browse Movies</Button>
        </main>
      </div>
    );
  }

  const parseRuntime = (rt: string) => parseInt(rt?.replace(" min", "") || "0") || 0;
  const parseBoxOffice = (bo: string) => parseInt(bo?.replace(/[$,]/g, "") || "0") || 0;
  const parseRating = (r: string) => parseFloat(r) || 0;

  const primaryChartData = compareMovies.map((m) => ({
    name: m.Title.length > 15 ? m.Title.slice(0, 15) + "…" : m.Title,
    runtime: parseRuntime(m.Runtime),
    imdbRating: parseRating(m.imdbRating),
    boxOffice: parseBoxOffice(m.BoxOffice),
  }));

  const formatBoxOfficeAxis = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(0)}M` : v > 0 ? `$${v}` : "$0";

  const getGenreSet = (m: typeof compareMovies[0]) =>
    new Set((m.Genre || "").split(", ").map((g) => g.trim()));
  const getActorSet = (m: typeof compareMovies[0]) =>
    new Set((m.Actors || "").split(", ").map((a) => a.trim()));

  const allGenres = compareMovies.map(getGenreSet);
  const commonGenres = [...allGenres[0]].filter((g) =>
    allGenres.slice(1).every((s) => s.has(g))
  );

  const allActors = compareMovies.map(getActorSet);
  const commonActors = [...allActors[0]].filter((a) =>
    allActors.slice(1).every((s) => s.has(a))
  );

  const sourceColorMap: Record<string, string> = {
    "Internet Movie Database": "#f59e0b",
    "Rotten Tomatoes": "#ef4444",
    Metacritic: "#10b981",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101018] to-[#080810] text-gray-200">
      <Header />
      <main className="pt-24 pb-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Movie Comparison
          </h1>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => dispatch(clearCompareMovies())}
            className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear
          </Button>
        </div>

        {/* Movie titles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {compareMovies.map((m) => (
            <div key={m.imdbID} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-center">
              {m.Poster && m.Poster !== "N/A" && (
                <img src={m.Poster} alt={m.Title} className="w-24 h-36 object-cover rounded-lg mx-auto mb-3 shadow-lg" />
              )}
              <h3 className="font-bold text-white">{m.Title}</h3>
              <p className="text-sm text-gray-400">{m.Year}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="space-y-8">
          <StatChart title="⏱ Runtime (minutes)" dataKey="runtime" data={primaryChartData} barColor="#a855f7" legendLabel="Runtime in Minutes" />
          <StatChart title="⭐ IMDB Rating" dataKey="imdbRating" data={primaryChartData} barColor="#22c55e" domain={[0, 10]} />
          <StatChart title="💰 Box Office (USD)" dataKey="boxOffice" data={primaryChartData} barColor="#f59e0b" tickFormatter={formatBoxOfficeAxis} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/20 p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-4 pb-2 border-b border-gray-700">
                🎭 Genres
              </h3>
              <p className="text-purple-300 font-medium mb-3">
                Common: {commonGenres.length > 0 ? commonGenres.join(", ") : "None"}
              </p>
              {compareMovies.map((m, i) => (
                <div key={m.imdbID} className="text-sm mb-2">
                  <span className="font-bold text-gray-100">{m.Title}:</span>
                  <span className="text-gray-400 ml-2">{[...allGenres[i]].filter((g) => !commonGenres.includes(g)).join(", ") || "–"}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-800/20 p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-4 pb-2 border-b border-gray-700">
                👥 Common Actors
              </h3>
              <p className="text-pink-300 font-medium mb-3">
                {commonActors.length > 0 ? commonActors.join(", ") : "No common actors"}
              </p>
              {compareMovies.map((m) => (
                <div key={m.imdbID} className="text-sm mb-2">
                  <span className="font-bold text-gray-100">{m.Title}:</span>
                  <span className="text-gray-400 ml-2">{m.Actors}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-800/20 p-5 rounded-xl border border-gray-700/50 col-span-full">
              <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-4 pb-2 border-b border-gray-700">
                🏆 Awards & Release
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {compareMovies.map((m) => (
                  <div key={m.imdbID}>
                    <span className="font-bold text-gray-100">{m.Title}</span>{" "}
                    <span className="text-gray-500">({m.Year})</span>
                    <p className="text-sm text-amber-300/80 mt-1 pl-2 border-l-2 border-amber-500/30">{m.Awards}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ratings per source */}
          <div className="bg-gray-800/20 p-5 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-4 pb-2 border-b border-gray-700">
              📊 Ratings from All Sources
            </h3>
            {compareMovies.map((m) => {
              const chartData = (m.Ratings || []).map((r) => {
                let value = 0;
                if (r.Value.includes("/100")) value = parseFloat(r.Value.split("/")[0]);
                else if (r.Value.includes("/10")) value = parseFloat(r.Value.split("/")[0]) * 10;
                else if (r.Value.includes("%")) value = parseFloat(r.Value.replace("%", ""));
                return { name: r.Source, value, displayValue: r.Value, fill: sourceColorMap[r.Source] || "#6b7280" };
              });
              return (
                <div key={m.imdbID} className="mb-8">
                  <h4 className="text-purple-300 font-bold mb-3">{m.Title}</h4>
                  <ResponsiveContainer width="100%" height={chartData.length * 50 + 10}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 160, right: 60 }}>
                      <CartesianGrid stroke="#4b5563" strokeDasharray="5 5" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" width={155} tick={{ fill: "#d1d5db", fontSize: 13 }} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: "rgba(107,114,128,0.1)" }} content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={4} background={{ fill: "#374151", radius: 4 }}>
                        <LabelList dataKey="displayValue" position="right" fill="#ffffff" fontSize={13} fontWeight="bold" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
