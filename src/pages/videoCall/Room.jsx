import React, { useEffect, useCallback, useState, useRef } from "react";
import peer from "../../services/peer.js";
import { useSocket } from "../../context/SocketProvider.jsx";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room — id:`, id);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(
    async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        // Set local stream first (so you can preview immediately)
        setMyStream(stream);

        // create offer after having local tracks if your peer implementation expects them
        const offer = await peer.getOffer();
        console.log("Got offer — emitting user:call", offer);
        socket.emit("user:call", { to: remoteSocketId, offer });
      } catch (err) {
        console.error("handleCallUser error:", err);
      }
    },
    [remoteSocketId, socket]
  );

  // Incoming call: set local stream then answer
  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from:", from);
      setRemoteSocketId(from);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);

        // get answer from peer helper and send back
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
        console.log("Sent call:accepted to", from);
      } catch (err) {
        console.error("handleIncommingCall error:", err);
      }
    },
    [socket]
  );

  // Add local stream tracks to peer (only when we want to start sending)
  const sendStreams = useCallback(() => {
    if (!myStream) {
      console.warn("sendStreams called but no myStream");
      return;
    }
    console.log("Adding local tracks to RTCPeerConnection");
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  // When callee accepts -> set local description and then add local tracks
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      console.log("handleCallAccepted — from:", from);
      peer.setLocalDescription(ans);
      // add tracks after setting local description (keep this as in your original)
      sendStreams();
    },
    [sendStreams]
  );

  // Negotiation-needed flow (when renegotiation is required)
  const handleNegoNeeded = useCallback(async () => {
    try {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
      console.log("Sent peer:nego:needed");
    } catch (err) {
      console.error("handleNegoNeeded err:", err);
    }
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  // Incoming nego request -> answer and send back
  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      console.log("Received peer:nego:needed from", from);
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    console.log("Received peer:nego:final");
    await peer.setLocalDescription(ans);
  }, []);

  // When remote tracks come in
  useEffect(() => {
    const onTrack = (ev) => {
      // ev.streams is the array of MediaStream objects
      const remoteS = ev.streams && ev.streams[0];
      if (remoteS) {
        console.log("GOT TRACKS — setting remote stream");
        setRemoteStream(remoteS);
      } else {
        console.log("track event had no streams, falling back to building stream from tracks");
        // fallback: build a MediaStream from tracks (rare)
        const ms = new MediaStream();
        ev.track && ms.addTrack(ev.track);
        setRemoteStream(ms);
      }
    };

    peer.peer.addEventListener("track", onTrack);
    return () => {
      peer.peer.removeEventListener("track", onTrack);
    };
  }, []);

  // Socket event wiring (same as before)
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // Attach remoteStream to remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Room</h1>
        <span className={`px-3 py-1 rounded ${remoteSocketId ? "bg-green-600" : "bg-red-600"}`}>
          {remoteSocketId ? "Connected" : "Waiting"}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local */}
        <div className="bg-gray-800 rounded overflow-hidden">
          <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-64 object-cover" />
          <div className="p-2 text-center bg-gray-900">You</div>
        </div>

        {/* Remote */}
        <div className="bg-gray-800 rounded overflow-hidden">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 object-cover" />
          <div className="p-2 text-center bg-gray-900">Remote</div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={sendStreams}
          disabled={!myStream}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          Send Stream
        </button>

        <button
          onClick={handleCallUser}
          disabled={!remoteSocketId}
          className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
        >
          Call
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
