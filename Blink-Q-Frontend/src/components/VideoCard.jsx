import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  const avatar = video.owner?.avatar || "/default-avatar.png";
  const username = video.owner?.username || "Unknown User";

  const viewsCount = video.views ?? video.__v ?? 0;
  const views =
    typeof viewsCount === "number" ? viewsCount.toLocaleString() : "0";
  const id = video?.owner?._id;
  const videoFile = video?.videoFile;
  const thumbnail =
    video.thumbnail || "https://placehold.co/600x400/1a1a1a/ffffff?text=Video";

  const [duration, setDuration] = useState("0:00");

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (videoFile) {
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.src = videoFile;

      const onLoadedMetadata = () => {
        setDuration(formatDuration(videoEl.duration));
        videoEl.removeEventListener("loadedmetadata", onLoadedMetadata);
        videoEl.remove();
      };

      const onError = () => {
        console.error("Error loading video metadata for duration.");
        videoEl.removeEventListener("error", onError);
        videoEl.remove();
      };

      videoEl.addEventListener("loadedmetadata", onLoadedMetadata);
      videoEl.addEventListener("error", onError);

      return () => {
        videoEl.removeEventListener("loadedmetadata", onLoadedMetadata);
        videoEl.removeEventListener("error", onError);
        videoEl.remove();
      };
    }
  }, [videoFile]);

  return (
    <div
      className="group bg-[var(--card-dark-bg,#1a1a1a)] rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-[var(--card-dark-hover-bg,#333333)]
 flex flex-col cursor-pointer"
    >
      <Link to={`/watch/${video._id}`} className="block">
        <div className="relative">
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-40 sm:h-48 object-cover"
            onError={(e) => {
              e.gittarget.src =
                "https://placehold.co/600x400/1a1a1a/ffffff?text=Video";
            }}
          />
          <span className="absolute right-2 bottom-2 text-xs bg-black/70 px-1.5 py-0.5 rounded">
            {duration}
          </span>
        </div>
      </Link>

      <div className="p-3 flex gap-3">
        <Link to={`/channel/${username}`}>
          <img
            src={avatar}
            alt="avatar"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          {" "}
          <Link
            to={`/watch/${video._id}`}
            className="font-semibold text-white line-clamp-2"
            title={video.title}
          >
            {video.title}
          </Link>
          <div className="text-sm text-[var(--muted,#aaa)] mt-1">
            <Link
              to={`/channel/${username}`}
              className="text-white transition-colors"
            >
              {username}
            </Link>
            <div className="truncate text-white"> {views} views</div>
          </div>
        </div>
      </div>
    </div>
  );
}
