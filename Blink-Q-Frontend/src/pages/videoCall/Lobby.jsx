import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      console.log("Joining room:", room);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className=" mt-[6vw] flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-semibold mb-6 text-center text-yellow-400">
          Join a Video Chat Room
        </h1>

        <form
          onSubmit={handleSubmitForm}
          className="flex flex-col space-y-5"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email ID
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium mb-1">
              Room Number
            </label>
            <input
              type="text"
              id="room"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 transition-all text-black font-semibold py-3 rounded-lg shadow-md hover:shadow-yellow-400/30"
          >
            Join Room
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Invite your friend to the same room number to connect instantly!
        </p>
      </div>
    </div>
  );
};

export default LobbyScreen;
