import React from 'react'
import { Link } from 'react-router-dom'


export default function VideoCard({ video }) {
return (
<div className="group">
<Link to={`/watch/${video.id}`} className="block">
<div className="relative rounded overflow-hidden shadow-md">
<img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
<span className="absolute right-2 bottom-2 text-xs bg-black/70 px-1 rounded">{video.duration}</span>
</div>
</Link>


<div className="mt-2 flex gap-3">
<Link to={`/channel/${encodeURIComponent(video.channel.toLowerCase().replace(/\\s+/g, '-'))}`}>
  <img src={video.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
</Link>
<div className="flex-1">
<Link to={`/watch/${video.id}`} className="font-semibold line-clamp-2">{video.title}</Link>
<div className="text-sm text-[var(--muted)]">
  <Link
    to={`/channel/${encodeURIComponent(video.channel.toLowerCase().replace(/\\s+/g, '-'))}`}
    className="hover:text-white"
  >
    {video.channel}
  </Link>
  {" • "}
  {video.views.toLocaleString()} views
</div>
</div>
</div>
</div>
)
}