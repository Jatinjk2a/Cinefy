import React from "react";
import { Header } from "../components/Header";

const About: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-8 text-center bg-gradient-to-r from-red-900 to-purple-600 dark:from-red-700 dark:to-purple-400 text-transparent bg-clip-text">
              About Cineverse
            </h1>

            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-2 hover:border-red-500">
                <p className="text-lg leading-relaxed">
                  Cineverse is your ultimate movie discovery platform, designed to help film enthusiasts explore, search, and track their favorite movies with ease.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-2 hover:border-red-500">
                <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">Our Mission</h2>
                <p className="text-lg leading-relaxed">
                  We strive to create an inclusive and engaging platform where movie lovers can discover new films, share their passion, and connect with fellow cinema enthusiasts.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Smart Search", desc: "Advanced search features to help you find exactly what you're looking for." },
                  { title: "Rich Database", desc: "Extensive collection of movies with detailed information and ratings." },
                  { title: "Modern UI", desc: "Clean, responsive interface with dark mode support for comfortable browsing." },
                ].map(({ title, desc }) => (
                  <div key={title} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-2 hover:border-red-500">
                    <h3 className="text-xl font-semibold mb-3">{title}</h3>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
