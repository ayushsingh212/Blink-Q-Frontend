import React from 'react'
import { Link } from 'react-router-dom'


export default function VideoCard({ video }) {

  const avatar = video.owner?.avatar || "/default-avatar.png";
  const username = video.owner?.username || "Unknown User";
  const views = typeof video.__v === "number" ? video.__v.toLocaleString() : "0";
  return (
    <div className="group">
      <Link to={`/watch/${video._id}`} className="block">
        <div className="relative rounded overflow-hidden shadow-md">
          <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
          <span className="absolute right-2 bottom-2 text-xs bg-black/70 px-1 rounded">{video.duration || "0:00"}</span>
        </div>
      </Link>


      <div className="mt-2 flex gap-3">
        <Link to={`/channel/${encodeURIComponent(username.toLowerCase().replace(/\s+/g, '-'))}`}>
          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />
        </Link>
        <div className="flex-1">
          <Link to={`/watch/${video._id}`} className="font-semibold line-clamp-2">{video.title}</Link>
          <div className="text-sm text-[var(--muted)]">
            <Link
              to={`/channel/${encodeURIComponent(username.toLowerCase().replace(/\\s+/g, '-'))}`}
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