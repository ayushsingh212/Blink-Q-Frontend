import React from "react";
import Image from "./AllComponents/Image";
import UserChannelDetails from "./AllComponents/UserChannelDetails";
import ChannelVideos from "../../ChannelComponents/ChannelVideos";
import { useSelector } from "react-redux";

export default function UserChannel() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Image />
      <UserChannelDetails />
      <ChannelVideos id={user._id} />
    </>
  );
}
