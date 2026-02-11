import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL } from "../Config";
import ChannelDetails from "../components/ChannelComponents/ChannelDetails";
import ChannelVideos from "../components/ChannelComponents/ChannelVideos";

export default function Channel() {
  const { username } = useParams();

  const [channelUser, setChannelUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getChannelData = useCallback(async () => {
    if (!username) return;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${API_BASE_URL}/user/channelProfile/${username}`,
        { withCredentials: true }
      );

      setChannelUser(res.data?.data || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load channel data");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    getChannelData();
  }, [getChannelData]);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-lg">
        Loading channel...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  if (!channelUser) {
    return (
      <div className="flex justify-center py-10">
        Channel not found
      </div>
    );
  }

  return (
    <div>

      <div className="space-y-4 pb-6 border-b-2 border-white">
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

     
      <div className="mt-5 ml-8">
        <ChannelVideos id={channelUser._id} />
      </div>
    </div>
  );
}
