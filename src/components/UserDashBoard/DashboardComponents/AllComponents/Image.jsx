import React from "react";
import { useSelector } from "react-redux";

const Image = () => {

  const user = useSelector((state) => state.auth.user)


  if (!user) {
    return <p>User Loading</p>
  }

  const avatarImage = user?.avatar
  const coverImage = user?.coverImage

  return (
    <div className="relative w-full ">
      <img
        src={coverImage || "/default-cover.jpg"}
        alt="Cover"
        className="w-full h-60 object-cover border-4 border-yellow-500 rounded-2xl"
      />
      <div
        className="absolute bottom-[4px] left-[70%] transform rotate-45 translate-y-1/2 w-44 h-44 rounded-full border-4 border-b-yellow-500 border-r-yellow-500 border-l-transparent border-t-transparent ">
        <img
          src={avatarImage || "/default-avatar.jpg"}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover transform -rotate-45 "
        />
      </div>
    </div>
  );
};

export default Image;
