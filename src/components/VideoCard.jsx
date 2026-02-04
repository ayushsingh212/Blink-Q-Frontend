import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Owner = {
  _id: string;
  username: string;
  avatar: string;
};

type Video = {
  _id: string;
  title: string;
  thumbnail: string;
  videoFile: string;
  views: number;
  owner: Owner;
};

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const avatar = video?.owner?.avatar || "/default-avatar.png";
  const username = video?.owner?.username || "Unknown";

  const thumbnail =
    video?.thumbnail ||
    "https://placehold.co/600x400/1a1a1a/ffffff?text=Video";

  const views = (video?.views || 0).toLocaleString();

  const [duration, setDuration] = useState("0:00");

  /* Format Duration */
  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${mins}:${secs}`;
  };

  /* Load Video Metadata */
  useEffect(() => {
    if (!video?.videoFile) return;

    const videoEl = document.createElement("video");
    videoEl.src = video.videoFile;
    videoEl.preload = "metadata";

    const handleLoaded = () => {
      setDuration(formatDuration(videoEl.duration));
      cleanup();
    };

    const cleanup = () => {
      videoEl.removeEventListener("loadedmetadata", handleLoaded);
      videoEl.remove();
    };

    videoEl.addEventListener("loadedmetadata", handleLoaded);

    return cleanup;
  }, [video?.videoFile]);

  return (
    <div className="group bg-neutral-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* Thumbnail */}
      <Link to={`/watch/${video._id}`} className="relative block">

        <img
          src={thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-44 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/1a1a1a/ffffff?text=Video";
          }}
        />

        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-0.5 rounded-md text-white font-medium">
          {duration}
        </span>
      </Link>

      {/* Content */}
      <div className="p-3 flex gap-3">

        {/* Avatar */}
        <Link to={`/channel/${username}`}>
          <img
            src={avatar}
            alt={username}
            loading="lazy"
            className="w-10 h-10 rounded-full object-cover border border-neutral-700"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
        </Link>

        {/* Text */}
        <div className="flex-1 min-w-0">

          {/* Title */}
          <Link
            to={`/watch/${video._id}`}
            className="block text-white font-semibold text-sm leading-snug line-clamp-2 hover:text-blue-400 transition-colors"
            title={video.title}
          >
            {video.title}
          </Link>

          {/* Meta */}
          <div className="mt-1 text-xs text-neutral-400 space-y-0.5">

            <Link
              to={`/channel/${username}`}
              className="hover:text-white transition-colors block truncate"
            >
              {username}
            </Link>

            <p>{views} views</p>

          </div>
        </div>
      </div>
    </div>
  );
}
