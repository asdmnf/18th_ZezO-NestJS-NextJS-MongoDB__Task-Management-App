"use client";

import { AlertCard } from "@/components/AlertCard";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <AlertCard
        title="Hey there!"
        message="Welcome to Task Management App."
        className="container m-5"
      />
    </main>
  );
}
