"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios/api";
import { getProfile } from "@/lib/redux/slices/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const LinkedinProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrapeProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/linkedin/scrape", {
        params: { url },
      });
      setProfile(response.data);
    } catch (err) {
      setError("Failed to scrape profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile) {
      dispatch(getProfile()).then((res) => {
        if (res.type === "auth/getProfile/fulfilled") {
          setUrl(res.payload.linkedin_url);
        }
      });
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Profile Scraper</h1>

      <Input
        type="text"
        placeholder="Enter Linkedin URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleScrapeProfile} disabled={loading}>
        {loading ? "Scraping..." : "Scrape Profile"}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {profile && (
        <Card className="mt-4 max-w-[250px] shadow flex flex-col items-center text-center">
          <CardHeader>
            <CardTitle>{profile.name}</CardTitle>
            <CardDescription>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                className="text-blue-500 font-bold"
                rel="noopener noreferrer"
              >
                View LinkedIn Profile
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile?.profilePicture && (
              <Image
                width={200}
                height={200}
                src={profile.profilePicture}
                alt={profile.name}
                className="rounded mb-2"
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinkedinProfile;
