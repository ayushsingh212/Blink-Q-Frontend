import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../../context/SocketProvider";

export default function ChatBox() {

    const { roomID } = useParams();
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const bottomRef = useRef(null);

    const handleSend = useCallback(
        (e) => {
            e.preventDefault();
            if (!message.trim()) {
                alert("Enter a valid message");
                return;
            }
            socket.emit("sendMessage", { roomId: roomID, message });
            setMessage("");
        }, [roomID]
    );

    const handleReceiveMessage = useCallback(
        (data) => {
            setMessages((prev) => {
                const updated = [...prev, data]
                setTimeout(() => {
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
                return updated;
            });
        }
    );

    const handleGoBack = useCallback(
        (data) => {
            navigate('/chatlobby');
        }
    )

    const handleSendError = useCallback(
        (data) => {
            console.log("error sending message", data.error);
        }
    );

    const handleGoBackError = useCallback(
        (data) => {
            console.log("error leaving the chatbox", data.error);
        }
    );

    useEffect(() => {

        if (!socket || !roomID) return;

        socket.on("leaveError", handleGoBackError);
        socket.on("messageError", handleSendError);
        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("leftRoom", handleGoBack);

        return () => {
            socket.emit("leaveRoom", { roomId: roomID });
            socket.off("messageError", handleSendError);
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("leftRoom", handleGoBack);
            socket.off("leaveError", handleGoBackError);
        };

    }, [
        socket,
        roomID,
        handleReceiveMessage,
        handleSendError,
        handleGoBack,
        handleGoBackError,
    ]);

    return (
        <div className="flex flex-col h-screen bg-black text-white">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
                <h2 className="text-xl font-semibold">Room: {roomID}</h2>
                <button
                    onClick={() => socket.emit("leaveRoom", { roomId: roomID })}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg"
                >
                    Leave Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <p className="text-center text-gray-500 italic">
                        No messages yet. Start the conversation!
                    </p>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.senderId === socket.id ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${msg.senderId === socket.id
                                ? "bg-yellow-500 text-black"
                                : "bg-gray-800 text-white"
                                }`}
                        >
                            <p>{msg.message || msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form
                onSubmit={handleSend}
                className="p-3 bg-gray-900 border-t border-gray-700 flex items-center"
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder-gray-400"
                />
                <button
                    type="submit"
                    className="ml-3 bg-yellow-500 hover:bg-yellow-600 text-black p-2 rounded-xl transition-all"
                >
                    <i class="ri-send-plane-fill"></i>
                </button>
            </form>
        </div>
    );

}