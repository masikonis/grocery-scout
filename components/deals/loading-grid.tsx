"use client";

import { LoadingCard } from "./loading-card";

export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
}