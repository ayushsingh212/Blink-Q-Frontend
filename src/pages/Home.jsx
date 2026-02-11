import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL } from "../Config";
import ChannelDetails from "../components/ChannelComponents/ChannelDetails";
import ChannelVideos from "../components/ChannelComponents/ChannelVideos";

export default function Channel() {
  const { username } = useParams();

  const [channelUser, setChannelUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  const getChannelData = useCallback(async () => {
    if (!username) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${API_BASE_URL}/user/channelProfile/${username}`,
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );

      setChannelUser(res.data?.data ?? null);
    } catch (err) {
      if (axios.isCancel(err)) return;

      console.error(err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    getChannelData();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [getChannelData]);



  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-lg font-medium">
          Loading channel...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20 space-y-4">
        <p className="text-red-500 text-lg">{error}</p>

        <button
          onClick={getChannelData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!channelUser) {
    return (
      <div className="flex justify-center py-20 text-lg">
        Channel not found
      </div>
    );
  }



  return (
    <div className="w-full">

 
      <section className="space-y-4 pb-6 border-b border-white/20">
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
      </section>

      {/* Videos */}
      <section className="mt-6 px-6">
        <ChannelVideos id={channelUser._id} />
      </section>

    </div>
  );
}
