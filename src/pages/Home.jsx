import React, { useEffect, useState } from 'react'
import axios from 'axios';
import VideoFeed from '../components/HomeComponents/VideoFeed.jsx';
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../Redux/Slices/AuthSlice.js'
import { API_BASE_URL } from '../Config.js';


export default function Home() {

    const dispatch = useDispatch();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { error } = useSelector((state)=> state.auth);

    const fetchVideos = async() => {

        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/video/getAllPublicVideos`,
                { withCredentials: true }
            );
            console.log("API response", res.data);
            setVideos(res.data.data.docs);
        } catch (error) {
            console.log((error));
            dispatch(setError(error.response?.data?.message || error.message || "Error Loading Videos"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{

        fetchVideos();

    },[dispatch])

    if(error) return (
        <div className=' text-xl text-white font-bold'>
            {error}
        </div>
    )

    if(loading) return (
        <div className=' text-xl text-white font-bold'>
            <i className="ri-loader-2-line text-green-500"></i>
            Loading Vidoes....
        </div>
    )

    return (
        <div>
            <h2 className="text-2xl mb-4">Home</h2>
            <VideoFeed videos={videos} />
        </div>
    )
}