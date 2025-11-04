import React from "react";
import { useParams } from "react-router-dom";
import VideoFeed from "../components/HomeComponents/VideoFeed.jsx";

export default function Search() {
  const { query } = useParams();
  const q = decodeURIComponent(query || "");

  const filtered = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(q.toLowerCase()) ||
      v.channel.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <h2 className="text-center sm:text-left text-2xl sm:text-3xl font-semibold mb-6 break-words">
        Search results for{" "}
        <span className="text-blue-400 break-words">"{q}"</span>
      </h2>

      {/* Results */}
      {filtered.length ? (
        <div className="w-full">
          <VideoFeed videos={filtered} />
        </div>
      ) : (
        <div className="text-gray-400 text-center mt-10 text-base sm:text-lg">
          No results found for <span className="text-blue-400">"{q}"</span>.
        </div>
      )}
    </div>
  );
}
