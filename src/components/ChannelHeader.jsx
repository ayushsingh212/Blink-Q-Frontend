import React from 'react'


export default function ChannelHeader({ channelName = 'Channel' }) {
    return (
        <div className="bg-[var(--card)] p-4 rounded">
            <div className="h-28 bg-gradient-to-r from-indigo-700 to-emerald-600 rounded mb-3" />
            <div className="flex items-center gap-4">
                <img src={`https://i.pravatar.cc/80?img=5`} className="w-20 h-20 rounded-full" />
                <div className="flex-1">
                    <div className="font-semibold text-lg">{channelName}</div>
                    <div className="text-[var(--muted)]">1M subscribers • 234 videos</div>
                </div>
                <button className="bg-red-600 px-4 py-2 rounded">Subscribe</button>
            </div>
        </div>
    )
}