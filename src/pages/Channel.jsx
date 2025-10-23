import React from 'react'
import { useParams } from 'react-router-dom'
import ChannelHeader from '../components/ChannelHeader'
import VideoFeed from '../components/HomeComponents/VideoFeed.jsx'

export default function Channel() {
    const { id } = useParams()
    const channelVideos = videos.filter(v => v.channel.toLowerCase().includes(id || 'channel'))


    return (
        <div className="space-y-4">
            <ChannelHeader channelName={id || 'Channel 1'} />
            <h3 className="text-xl">Videos</h3>
            <VideoFeed videos={channelVideos.length ? channelVideos : videos.slice(0, 12)} />
        </div>
    )
}