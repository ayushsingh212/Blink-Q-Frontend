import React, { createContext, useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {

  const [newSocket, setNewSocket] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.username || user?.id || "guest";

    const socket = io("https://blink.cronaweb.me", {
      auth: { userId },
      withCredentials: true,
      transports: ["websocket","polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log(" Connected to socket:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error(" Socket connection error:", err.message);
    });

    setNewSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={newSocket}>
      {props.children}
    </SocketContext.Provider>
  );
};
