import React from 'react'
import VideoCard from '../VideoCard'

export default function VideoFeed({ videos=[] }) {
    return (
        <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {videos.map((v) => (
                    <VideoCard key={v._id} video={v} />
                ))}
            </div>
        </section>
    )
}