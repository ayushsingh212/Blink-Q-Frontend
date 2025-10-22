import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../../Config";

export default function UserChannelDetails() {

    const user = useSelector((state) => state.auth.user)
    const [subscribersCount, setSubscribersCount] = useState(null);
    const [channelsSubscribedToCount, setChannelsSubscribedToCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProfileData, setShowProfileData] = useState(true);

    const channelInfo = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/user/channelProfile/${user.username}`,
                { withCredentials: true }
            );
            console.log(res);
            setSubscribersCount(res.data.data.subscribersCount);
            setChannelsSubscribedToCount(res.data.data.channelsSubscribedToCount);
            return res;
        } catch (error) {
            setShowProfileData(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        channelInfo();
    }, [user]);

    if (loading) return <div className="text-2xl mt-20 ml-5 font-bold">Loading...</div>;

    return (
        <div
            className="m-10 ml-5  pb-9 border-b-2 border-white">
            <h2 className="text-5xl font-bold mb-5">
                {user.fullName}
            </h2>
            <h4 className="text-2xl font-semibold">
                @{user.username}
            </h4>
            {showProfileData ? (
                <div>
                    <h4 className="text-xl font-semibold">
                        Subscribers: {subscribersCount}
                    </h4>
                    <h4 className="text-xl font-semibold">
                        Number of Subscribered Channels: {channelsSubscribedToCount}
                    </h4>
                </div>
            ) : (
                <div>Loading User Channel Data</div>
            )}
        </div>
    )
}