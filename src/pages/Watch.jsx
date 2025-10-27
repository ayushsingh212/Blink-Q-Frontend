import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer.jsx'
import VideoCard from '../components/VideoCard.jsx'
import { API_BASE_URL } from '../Config.js'
import axios from 'axios'
import CommentsSection from '../components/CommentSection.jsx'

export default function Watch() {
    const { id } = useParams()
    const [video, setVideo] = useState();
    const [relatedVideos, setRelatedVideos] = useState([]);

    useEffect(() => {

        const fetchVideo = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/video/getVideoInfo/${id}`,
                    { withCredentials: true }
                );
                console.log("Video Fetched", res);
                setVideo(res.data.data);
            } catch (error) {
                console.log("Error Loading the video", error);
            }
        }

        const fetchVideos = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/video/getAllPublicVideos`,
                    { withCredentials: true }
                );
                console.log("Related Videos Fetched", res);
                const allVideos = res.data.data.docs || [];
                const related = allVideos.filter((v) => v._id !== id).slice(0, 6)
                setRelatedVideos(related);
            } catch (error) {
                console.log("error fetching related videos", error);
            }
        }

        fetchVideo();
        fetchVideos();

    }, [id])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <VideoPlayer video={video} />
                <div className="mt-4 bg-[var(--card)] p-4 rounded">
                    <h3 className="font-semibold mb-2">Comments</h3>
                    <CommentsSection id={id} />
                </div>
            </div>


            <aside className="space-y-4">
                {relatedVideos.map(r => (
                    <VideoCard key={r._id} video={r} />
                ))}
            </aside>
        </div>
    )
}