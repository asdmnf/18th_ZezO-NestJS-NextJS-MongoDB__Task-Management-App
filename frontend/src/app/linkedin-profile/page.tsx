"use client";

import api from "@/lib/axios/api";
import { useState } from "react";

const LinkedinProfile = () => {
  const [email, setEmail] = useState("egypte.2200@gmail.com");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrapeProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/linkedin/scrape", {
        params: { email },
      });
      setProfile(response.data);
    } catch (err) {
      setError("Failed to scrape profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Profile Scraper</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleScrapeProfile}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Scrape Profile
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {profile && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
          {profile.profilePicture && (
            <img
              src={profile.profilePicture}
              alt={profile.name}
              className="rounded mb-2"
            />
          )}
          <a href={profile.linkedinUrl} className="text-blue-500">
            View LinkedIn Profile
          </a>
        </div>
      )}
    </div>
  );
};

export default LinkedinProfile;
