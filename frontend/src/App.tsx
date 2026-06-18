import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Providers } from "./providers/Providers";
import { CompareDrawer } from "./components/CompareDrawer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const TvShowsPage = lazy(() => import("./pages/TvShowsPage"));
const ActorsPage = lazy(() => import("./pages/ActorsPage"));
const ActorDetailPage = lazy(() => import("./pages/ActorDetailPage"));
const GenresPage = lazy(() => import("./pages/GenresPage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));

function AppShell() {
  return (
    <>
      <div className="fixed bottom-6 right-24 z-50">
        <CompareDrawer />
      </div>
      <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/movies" replace />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/compare" element={<ComparePage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/tv-shows" element={<TvShowsPage />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actors/:name" element={<ActorDetailPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <ScrollToTopButton />
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <Providers>
      <AppShell />
    </Providers>
  );
}
