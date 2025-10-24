import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {

  const avatar = video.owner?.avatar || "/default-avatar.png";
  const username = video.owner?.username || "Unknown User";
  const views = typeof video.__v === "number" ? video.__v.toLocaleString() : "0";
  const id = video?.owner?._id;
  const videoFile = video?.videoFile;

  const [duration, setDuration] = useState("0:00");

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.src = videoFile;

    videoEl.onloadedmetadata = () => {
      setDuration(formatDuration(videoEl.duration));
      videoEl.remove();
    };
  }, [videoFile]);

  return (
    <div className="group">
      <Link to={`/watch/${video._id}`} className="block">
        <div className="relative rounded overflow-hidden shadow-md">
          <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
          <span className="absolute right-2 bottom-2 text-xs bg-black/70 px-1 rounded">{ duration || "0:00"}</span>
        </div>
      </Link>


      <div className="mt-2 flex gap-3">
        <Link to={`/channel/${username}`}>
          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />
        </Link>
        <div className="flex-1">
          <Link to={`/watch/${video._id}`} className="font-semibold line-clamp-2">{video.title}</Link>
          <div className="text-sm text-[var(--muted)]">
            <Link
              to={`/channel/${username}`}
              className="hover:text-white"
            >
              {username}
            </Link>
            {" • "}
            {views} views
          </div>
        </div>
      </div>
    </div>
  )
}