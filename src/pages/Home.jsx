import React, { useEffect } from 'react'
import videos from '../data/videoData.js'
import VideoFeed from '../components/HomeComponents/VideoFeed.jsx';
import { useDispatch } from 'react-redux'


export default function Home() {

    const dispatch = useDispatch();

    return (
        <div>
            <h2 className="text-2xl mb-4">Home</h2>
            <VideoFeed videos={videos} />
        </div>
    )
}