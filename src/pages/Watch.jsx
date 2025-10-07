import React from 'react'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer.jsx'
import VideoCard from '../components/VideoCard.jsx'
import videos from '../data/videoData.js'

export default function Watch() {
const { id } = useParams()
const video = videos.find(v => v.id === id) || videos[0]


const related = videos.filter(v => v.id !== video.id).slice(0, 6)


return (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2">
<VideoPlayer video={video} />
<div className="mt-4 bg-[var(--card)] p-4 rounded">
<h3 className="font-semibold mb-2">Comments</h3>
<p className="text-[var(--muted)]">Comments section below</p>
</div>
</div>


<aside className="space-y-4">
{related.map(r => (
<VideoCard key={r.id} video={r} />
))}
</aside>
</div>
)
}