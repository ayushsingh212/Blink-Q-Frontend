import React,{useState, useEffect} from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../Config";
import VideoCard from "../../VideoCard";
import { Link } from "react-router-dom";

export default function WatchHistory(){
    const [showVideos, setShowVideos] = useState([]);
    const getWatchHistory = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/user/watchHistory`,
                { withCredentials: true }
            );
            console.log(res);
            setShowVideos(res.data.data);
            return res.data.data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getWatchHistory();
    }, [])

    return (
        <div className="ml-5">
            <h4
                className="text-4xl font-semibold mb-10 underline">Watch History</h4>
            {showVideos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {showVideos.map(v => <VideoCard key={v.id} video={v} />)}
                </div>
            ) : (
                <div>
                    <h2>Haven't watched anything yet. Watch from
                        <span>
                            <Link to="/"
                                className="ml-1 underline">
                                Video Feed
                            </Link>
                        </span>
                    </h2>
                </div>
            )}
        </div>
    )
}