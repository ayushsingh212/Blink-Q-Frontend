import React, { useEffect } from "react";
import SubscribedButton from "../SubscribedButton";

const ChannelDetails = ({ coverImage, avatarImage, username, fullname, subscribers, channelSubscribed, isSubscribed, id }) => {

    return (
        <div>
            <div className="w-full">
                <img
                    src={coverImage || "/default-cover.jpg"}
                    alt="Cover"
                    className="w-full h-64 object-cover border-4 border-yellow-500 rounded-2xl"
                />
            </div>
            <div className="flex gap-[3vw]">
                <div
                    className=" w-48 h-48 rounded-full  ">
                    <img
                        src={avatarImage || "/default-avatar.jpg"}
                        alt="Avatar"
                        className="w-full m-10 ml-6 h-full rounded-full object-cover "
                    />
                </div>
                <div className="flex flex-col mt-12 p-4 gap-2 justify-center items-start ">
                    <h2 className="text-5xl font-bold mb-2">{fullname}</h2>
                    <h4 className="text-xl font-semibold">@{username}  &bull; {subscribers} subscribers</h4>
                    <h5 className="text-xl font-semibold">Channels Subscribed: {channelSubscribed}</h5>
                    <div>
                        <SubscribedButton username={username} id={id} />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ChannelDetails;
