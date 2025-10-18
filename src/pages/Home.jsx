import React, { useEffect } from 'react'
import videos from '../data/videoData.js'
import VideoFeed from '../components/VideoFeed.jsx'
import { fetchUser } from '../Redux/Slices/AuthSlice.js'
import { useDispatch } from 'react-redux'


export default function Home() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser());
        console.log("fetchuser runs");
    })
    return (
        <div>
            <h2 className="text-2xl mb-4">Home</h2>
            <VideoFeed videos={videos} />
        </div>
    )
}