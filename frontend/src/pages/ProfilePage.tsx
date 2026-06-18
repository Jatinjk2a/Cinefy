import React, { useState, useRef } from "react";
import { Header } from "../components/Header";
import {
  Camera, Edit3, Save, X, User, Mail, Phone, MapPin,
  Calendar, Globe, Star, Film, Eye, Heart,
} from "lucide-react";

type ProfileStats = { watchedMovies: number; favoriteMovies: number; watchlistCount: number; reviews: number };
type ProfileData = { name: string; email: string; phone: string; location: string; bio: string; birthDate: string; website: string; avatar: string | null; joinDate: string; stats: ProfileStats };

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe", email: "john.doe@example.com", phone: "+1 (555) 123-4567",
    location: "New York, NY", bio: "Movie enthusiast and critic.", birthDate: "1990-05-15",
    website: "https://johndoe.com", avatar: null, joinDate: "2023-01-15",
    stats: { watchedMovies: 127, favoriteMovies: 23, watchlistCount: 45, reviews: 89 },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setProfileData((prev) => ({ ...prev, avatar: typeof result === "string" ? result : null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const statItems = [
    { icon: Eye, label: "Watched", value: profileData.stats.watchedMovies, color: "blue" },
    { icon: Heart, label: "Favorites", value: profileData.stats.favoriteMovies, color: "red" },
    { icon: Film, label: "Watchlist", value: profileData.stats.watchlistCount, color: "green" },
    { icon: Star, label: "Reviews", value: profileData.stats.reviews, color: "yellow" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <Header />
      <main className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {profileData.avatar ? (
                          <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <User className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2">{profileData.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Member since {new Date(profileData.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {statItems.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className={`text-center p-3 bg-gradient-to-r from-${color}-500/10 to-${color}-500/10 rounded-xl border border-${color}-200/20`}>
                      <div className="flex items-center justify-center mb-2">
                        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
                    </div>
                  ))}
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {([
                    { label: "Full Name", field: "name" as const, type: "text", icon: User },
                    { label: "Email Address", field: "email" as const, type: "email", icon: Mail },
                    { label: "Phone Number", field: "phone" as const, type: "tel", icon: Phone },
                    { label: "Location", field: "location" as const, type: "text", icon: MapPin },
                    { label: "Birth Date", field: "birthDate" as const, type: "date", icon: Calendar },
                    { label: "Website", field: "website" as const, type: "url", icon: Globe },
                  ] as { label: string; field: keyof ProfileData; type: string; icon: React.ElementType }[]).map(({ label, field, type, icon: Icon }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Icon className="w-4 h-4 inline mr-2" />{label}
                      </label>
                      {isEditing ? (
                        <input
                          type={type}
                          value={profileData[field] as string}
                          onChange={(e) => handleInputChange(field, e.target.value as ProfileData[typeof field])}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl text-gray-900 dark:text-white">
                          {String(profileData[field]) || "Not provided"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About Me</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl text-gray-900 dark:text-white leading-relaxed">
                      {profileData.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
