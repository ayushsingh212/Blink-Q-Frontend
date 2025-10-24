import axios from "axios";
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Config";

export default function VideoPlayer({ video }) {
  if (!video) {
    return (
      <div className="w-full bg-black rounded overflow-hidden shadow-sm flex justify-center items-center h-64">
        <p className="text-[var(--muted)]">Loading video...</p>
      </div>
    );
  }

  const {
    videoFile,
    title,
    channel,
    views = 0,
    uploaded,
    description,
    likeCount: initialLikeCount = 0,
    isLiked: initialIsLiked = false,
    _id: id,
    owner = {},
  } = video;

  const { profilePic, channelName, username } = owner;

  const [likeState, setLikeState] = useState({
    isLiked: initialIsLiked,
    likeCount: initialLikeCount,
    isLoading: false,
  });

  const [showDescription, setShowDescription] = useState(false);

  const handleLike = useCallback(async () => {
    setLikeState((prev) => {
      if (prev.isLoading) return prev;
      const newIsLiked = !prev.isLiked;
      const newLikeCount = newIsLiked
        ? prev.likeCount + 1
        : Math.max(prev.likeCount - 1, 0);
      return { ...prev, isLiked: newIsLiked, likeCount: newLikeCount, isLoading: true };
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/like/toggleVideoLike/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data?.data) {
        const { isLiked, likeCount } = res.data.data;
        setLikeState((prev) => ({
          ...prev,
          isLiked,
          likeCount,
          isLoading: false,
        }));
      } else {
        throw new Error("Invalid server response");
      }
    } catch (error) {
      console.error("Like toggle failed:", error);
      setLikeState((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked
          ? Math.max(prev.likeCount - 1, 0)
          : prev.likeCount + 1,
        isLoading: false,
      }));
    }
  }, [id]);

  return (
    <div>
      <div className="w-full bg-black rounded overflow-hidden shadow-sm">
        {videoFile ? (
          <video
            src={videoFile}
            controls
            className="h-[30vw] w-full object-contain"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex justify-center items-center h-64 text-[var(--muted)]">
            Video not available
          </div>
        )}
      </div>

      <h1 className="mt-3 text-xl font-semibold text-white line-clamp-2">
        {title}
      </h1>

      <div className="text-sm text-[var(--muted)] my-2 flex items-center flex-wrap">
        {channel} • {video?.views?.toLocaleString?.() || 0} views • {uploaded}
        <button
          type="button"
          onClick={() => setShowDescription((prev) => !prev)}
          className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showDescription ? "Hide Description" : "View Description"}
        </button>
      </div>

      {showDescription && description && (
        <div className="my-2 w-full bg-[#0E2954] p-3 rounded-xl text-white">
          <p>{description}</p>
        </div>
      )}

      <Link to={`/channel/${username}`} className="block group">
        <div className="flex gap-2 my-3 items-center">
          <div className="h-8 w-8 bg-gray-600 rounded-full overflow-hidden flex-shrink-0 group-hover:ring-2 ring-blue-400 transition-all">
            <img
              src={profilePic || "/default-avatar.png"}
              alt={`${channelName || username || "Channel"} profile`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
                e.target.onerror = null;
              }}
            />
          </div>
          <div>
            <h2 className="text-white font-medium group-hover:text-blue-300 transition-colors">
              {channelName || username}
            </h2>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 px-3 py-2 bg-white/5 rounded items-center hover:bg-white/10 transition-colors">
          <button
            type="button" 
            onClick={(e) => {
              e.stopPropagation(); 
              handleLike();
            }}
            disabled={likeState.isLoading}
            className={`flex items-center gap-1 transition-colors ${
              likeState.isLiked
                ? "text-blue-400"
                : "text-white hover:text-gray-300"
            } ${likeState.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {likeState.isLiked ? (
              <i className="ri-thumb-up-fill"></i>
            ) : (
              <i className="ri-thumb-up-line"></i>
            )}
            {likeState.isLiked ? "Liked" : "Like"}
          </button>
          <div className="pl-2 border-l-2 border-white/20 text-white">
            {likeState?.likeCount?.toLocaleString()}
          </div>
        </div>

      
        <button
          type="button"
          className="px-3 py-2 bg-white/5 rounded text-white hover:bg-white/10 transition-colors flex items-center gap-1"
        >
          <i className="ri-share-line"></i> Share
        </button>

        
        <button
          type="button"
          className="px-3 py-2 bg-white/5 rounded text-white hover:bg-white/10 transition-colors flex items-center gap-1"
        >
          <i className="ri-save-line"></i> Save
        </button>
      </div>
    </div>
  );
}
