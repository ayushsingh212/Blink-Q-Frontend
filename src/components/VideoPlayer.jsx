import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../Config';

export default function VideoPlayer({ video }) {

    const [description, setDescription] = useState(false);
    const videoFile = video?.videoFile;
    const imageFile = video?.owner?.profilePic;
    const channelName = video?.owner?.channelName;
    const username = video?.owner?.username;
    const id = video?._id;

    const [like, setLike] = useState();
    const [likes, setLikes] = useState();

    const setShowDescription = (e) => {
        setDescription((prev) => !prev);
    }

    const handleLike = async() => {
        setLike(true);
        setLikes( likes + 1 );
        try {
            const res = await axios.post(`${API_BASE_URL}/like/likeVideo/${id}`,{},
                {withCredentials:true}
            );
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDislike = async() => {
        setLike(false);
        setLikes( likes - 1 );
        try {
            const res = await axios.post(`${API_BASE_URL}/like/likeVideo/${id}`,{},
                {withCredentials:true}
            );
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (video) {
            setLike(video.isLiked);
            setLikes(video.likeCount);
            setDescription(false);
            console.log(video.isLiked, video.likeCount, "here");
        }
        console.log(video);
        setDescription(false);
    }, [video])

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
                {videoFile ? (
                    <video src={videoFile} controls className='h-[30vw] w-full'></video>
                ) : (
                    <div>Video Isn't Fetched</div>
                )}

            </div>


            <h1 className="mt-3 text-xl font-semibold">{video?.title}</h1>
            <div className="text-sm text-[var(--muted)] my-2">{video?.channel} • {video?.__v?.toLocaleString() || 0} views • {video?.uploaded}
                <span>{description ? (
                    <button onClick={setShowDescription}>Hide Description</button>
                ) : (
                    <button onClick={setShowDescription}>View Description</button>
                )}</span>
            </div>

            {description && (
                <div className='my-2 w-full bg-[#0E2954] p-3 rounded-xl'>
                    <h2>{video.description}</h2>
                </div>
            )}

            <Link to={`/channel/${username}`}>
                <div className='flex gap-2 my-3'>
                    <div className=' h-[2vw] w-[2vw] bg-white rounded-full overflow-hidden'>
                        <img src={imageFile} alt="" className=' w-full h-full object-cover ' />
                    </div>
                    <div>
                        <h2>{channelName}</h2>
                    </div>
                </div>
            </Link>


            <div className="mt-3 flex items-center gap-3">
                <div className='flex gap-2 px-3 py-2 bg-white/5 rounded'>
                    <div>
                        {like ? (
                            <button onClick={handleDislike}><i className="ri-thumb-up-fill"></i> Like</button>
                        ) : (
                            <button onClick={handleLike}><i className="ri-thumb-up-line"></i> Like</button>
                        )}
                    </div>
                    <div className='pl-2 border-l-2 border- white'>
                        {likes}
                    </div>
                </div>
                <button className="px-3 py-2 bg-white/5 rounded">Share</button>
                <button className="px-3 py-2 bg-white/5 rounded">Save</button>
            </div>
        </div>
    )
}