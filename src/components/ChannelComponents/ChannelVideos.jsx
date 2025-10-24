import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../Config";
import axios from "axios";
import VideoFeed from "../HomeComponents/VideoFeed";

export default function ChannelVideos({ id }) {

    const [videos, setVideos] = useState([]);

    const fetchVideos = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/video/videosByChannel/${id}`,
                { withCredentials: true }
            );
            console.log(res);
            setVideos(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchVideos();
    }, [id])

    return (
        <div>
            <h2 className="text-4xl font-bold mb-4 underline">Videos</h2>
            <VideoFeed videos={videos} />
        </div>
    )
}