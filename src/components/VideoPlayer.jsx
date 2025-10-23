import React, { useState } from 'react'


export default function VideoPlayer({ video }) {

    const [description, setDescription] = useState(false);
    const videoFile = video?.videoFile;

    const setShowDescription = (e) => {
        setDescription((prev)=> !prev);
    }

    if (!video) {
        return (
            <div className="w-full bg-black rounded overflow-hidden shadow-sm flex justify-center items-center h-64">
                <p className="text-[var(--muted)]">Loading video...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="w-full bg-black rounded overflow-hidden shadow-sm">
                { videoFile ? (
                    <video src={videoFile} controls></video>
                ) : (
                    <div>Video Isn't Fetched</div>
                )}

            </div>


            <h1 className="mt-3 text-xl font-semibold">{video?.title}</h1>
            <div className="text-sm text-[var(--muted)]">{video?.channel} • {video?.__v?.toLocaleString() || 0} views • {video?.uploaded}
                <span>{ description ? (
                    <button onClick={setShowDescription}>Hide Description</button>
                ) : (
                    <button onClick={setShowDescription}>View Description</button>
                )}</span>
            </div>

            {description && (
                <div>
                    <h2>{video.description}</h2>
                </div>
            )}


            <div className="mt-3 flex items-center gap-3">
                <button className="px-3 py-2 bg-white/5 rounded">Like</button>
                <button className="px-3 py-2 bg-white/5 rounded">Share</button>
                <button className="px-3 py-2 bg-white/5 rounded">Save</button>
            </div>
        </div>
    )
}