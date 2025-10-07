import React from 'react'
import videos from '../data/videoData.js'
import VideoFeed from '../components/VideoFeed.jsx'


export default function Home() {
return (
<div>
<h2 className="text-2xl mb-4">Home</h2>
<VideoFeed videos={videos} />
</div>
)
}