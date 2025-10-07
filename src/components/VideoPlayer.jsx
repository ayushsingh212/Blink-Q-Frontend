import React from 'react'


export default function VideoPlayer({ video }) {
return (
<div>
<div className="w-full bg-black rounded overflow-hidden shadow-sm">
{/* dummy iframe / video */}
<div className="aspect-video bg-black flex items-center justify-center text-white/50">VIDEO PLAYER - {video?.title}</div>
</div>


<h1 className="mt-3 text-xl font-semibold">{video?.title}</h1>
<div className="text-sm text-[var(--muted)]">{video?.channel} • {video?.views?.toLocaleString()} views • {video?.uploaded}</div>


<div className="mt-3 flex items-center gap-3">
<button className="px-3 py-2 bg-white/5 rounded">Like</button>
<button className="px-3 py-2 bg-white/5 rounded">Share</button>
<button className="px-3 py-2 bg-white/5 rounded">Save</button>
</div>
</div>
)
}