import React from 'react'
import { useParams } from 'react-router-dom'
import videos from '../data/videoData.js'
import VideoFeed from '../components/VideoFeed.jsx'


export default function Search() {
const { query } = useParams()
const q = decodeURIComponent(query || '')
const filtered = videos.filter(v => v.title.toLowerCase().includes(q.toLowerCase()) || v.channel.toLowerCase().includes(q.toLowerCase()))


return (
<div>
<h2 className="text-2xl mb-4">Search results for "{q}"</h2>
{filtered.length ? <VideoFeed videos={filtered} /> : <div className="text-[var(--muted)]">No results</div>}
</div>
)
}