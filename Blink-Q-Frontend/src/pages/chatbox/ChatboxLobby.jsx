import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider"; // custom context for socket.io connection

export default function ChatBoxLobby() {
    const [email, setEmail] = useState("");
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");

    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            console.log('clicked');
            if (!email.trim() || !roomId.trim()) {
                setError("Email and Room ID are required");
                return;
            }
            console.log("Socket connected:", socket.connected);
            socket.emit("joinRoom", { roomId });
            console.log("emitted");
            setError("");
        },
        [socket, email, roomId]
    );

    const handleJoinedRoom = useCallback(
        (data) => {
            console.log("Joined Room:", data.roomId);
            navigate(`/chatroom/${data.roomId}`);
        },
        [navigate]
    );

    const handleJoinError = useCallback((data) => {
        console.error("Join Error:", data.error);
        setError(data.error);
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("joinedRoom", handleJoinedRoom);
        socket.on("joinError", handleJoinError);

        return () => {
            socket.off("joinedRoom", handleJoinedRoom);
            socket.off("joinError", handleJoinError);
        };
    }, [socket, handleJoinedRoom, handleJoinError]);

    return (
        <div className=" mt-[6vw] flex items-center justify-center bg-black text-white">
            <div className="bg-gray-900/70 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-semibold mb-6 text-center text-yellow-400">
                    Join a Chat Room
                </h1>

                <form onSubmit={handleSubmitForm} className="flex flex-col space-y-5">
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
                            Room ID
                        </label>
                        <input
                            type="text"
                            id="room"
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Enter room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
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

                {error && (
                    <p className="mt-4 text-center text-sm text-red-400">{error}</p>
                )}

                <p className="mt-6 text-center text-sm text-gray-400">
                    Invite your friend to the same room ID to start chatting instantly!
                </p>
            </div>
        </div>
    );
}
