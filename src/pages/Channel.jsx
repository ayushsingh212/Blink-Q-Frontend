import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE_URL } from '../Config'
import axios from 'axios';
import ChannelDetails from '../components/ChannelComponents/ChannelDetails';
import ChannelVideos from '../components/ChannelComponents/ChannelVideos';

export default function Channel() {
    const { username } = useParams()
    const [channelUser, setChannelUser] = useState({});

    const getChannelData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/user/channelProfile/${username}`,
                { withCredentials: true }
            )
            console.log(res);
            setChannelUser(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (username) getChannelData();
    }, [])

    return (
        <div>
            <div className="space-y-4 pb-6 border-b-2 border-white ">
                <ChannelDetails
                    coverImage={channelUser.coverImage}
                    avatarImage={channelUser.avatar}
                    username={channelUser.username}
                    fullname={channelUser.fullName}
                    subscribers={channelUser.subscribersCount}
                    channelSubscribed={channelUser.channelsSubscribedToCount}
                    isSubscribed={channelUser.isSubscribed}
                    id={channelUser._id}
                />
            </div>
            <div className='mt-5 ml-8'>
                <ChannelVideos id={channelUser._id}/>
            </div>
        </div>
    )
}