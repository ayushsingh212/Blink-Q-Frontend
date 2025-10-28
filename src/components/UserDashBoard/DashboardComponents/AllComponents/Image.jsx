import React from "react";
import { useSelector } from "react-redux";

const Image = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <p className="text-center text-gray-600">Loading user...</p>;
  }

  const avatarImage = user?.avatar;
  const coverImage = user?.coverImage;

  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <img
        src={coverImage || "/default-cover.jpg"}
        alt="Cover"
        className="w-full h-48 sm:h-60 md:h-72 lg:h-80 object-cover border-4 border-yellow-500 rounded-2xl"
      />

      {/* Avatar with responsive position */}
      <div
        className="
          absolute 
          bottom-[-3rem] sm:bottom-[-4rem] 
          left-1/2 sm:left-[70%] 
          transform -translate-x-1/2 sm:translate-x-0 
          w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 
          rounded-full 
          border-4 
          border-b-yellow-500 border-r-yellow-500 border-l-transparent border-t-transparent
          rotate-45
        "
      >
        <img
          src={avatarImage || "/default-avatar.jpg"}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover transform -rotate-45"
        />
      </div>
    </div>
  );
};

export default Image;
