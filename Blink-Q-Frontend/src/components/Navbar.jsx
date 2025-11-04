import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setShowLogin, setShowUpload } from "../Redux/Slices/AuthSlice";

export default function Navbar({ onToggleSidebar }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropDown = useRef(null);
  const lobbyDropDown = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLobbyDropdown, setShowLobbyDropdown] = useState(false);

  const { status } = useSelector((state) => state.auth);

  const link = useSelector((state) => state.auth.user?.avatar);

  const navigateLogin = () => {
    dispatch(setShowLogin({ login: true, signup: false }));
  };

  const VideoUploadPage = () => {
    setShowDropdown(false);
    dispatch(setShowUpload({ videos: true }));
    console.log("done");
  };

  const goToVideoLobby = ()=> {
    setShowLobbyDropdown(false);
    navigate('/lobby');
  }

  const goToChatLobby = ()=> {
    setShowLobbyDropdown(false);
    navigate('/chatLobby');
  }

  function submit(e) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search/${encodeURIComponent(q.trim())}`);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropDown.current && !dropDown.current.contains(e.target)) {
        setShowDropdown(false);
      }

      if (lobbyDropDown.current && !lobbyDropDown.current.contains(e.target)) {
        setShowLobbyDropdown(false);
      }
    }

    if (showDropdown || showLobbyDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showLobbyDropdown]);
  return (
    <nav className="w-full bg-[var(--card)] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-white/5 md:hidden"
          aria-label="toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img
            src="/blinkb.png"
            alt="App logo"
            className="h-10 w-10 rounded-full"
          />
          <span className="font-semibold hidden sm:inline">Blink-B</span>
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-xl md:mx-4 ">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full text-white rounded px-3 py-2 bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
            />
            <button className="absolute hidden md:block right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/5 rounded">
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3">
          {status && (
            <div className="relative" ref={dropDown}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="px-2 text-sm md:text-base rounded-lg hover:bg-white/5 border-[2px] border-white p-1"
              >
                + Create
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-800 text-white rounded shadow-lg z-50">
                  <button
                    onClick={VideoUploadPage}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                  >
                    <i className="ri-video-upload-line"></i>
                    <span className="ml-3">Upload Video</span>
                  </button>
                  <button
                    // onClick={() => navigate("/create-post")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                  >
                    <i className="ri-image-add-line"></i>
                    <span className="ml-3">Create Post</span>
                  </button>
                  <button
                    // onClick={() => navigate("/go-live")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                  >
                    <i className="ri-live-line"></i>
                    <span className="ml-3">Go Live</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {status && (
            <div ref={lobbyDropDown}>
              <button
                onClick={() => setShowLobbyDropdown((prev) => !prev)}
                className=" border-[2px] hidden border-white rounded-lg p-1 px-3 ml-2 md:block">Lobby</button>

              {showLobbyDropdown && (
                <div className="absolute right-[25vw] mt-2 w-50 bg-slate-800 text-white rounded shadow-lg z-50">
                  <button
                    onClick={goToVideoLobby}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                  >
                    <i className="ri-video-upload-line"></i>
                    <span className="ml-3">Video Call Lobby</span>
                  </button>
                  <button
                    onClick={goToChatLobby}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                  >
                    <i className="ri-messenger-line"></i>
                    <span className="ml-3">ChatBox Lobby</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {!status ? (
            <button onClick={navigateLogin} className="w-24 h-8 ">
              Login
            </button>
          ) : (
            <button onClick={() => navigate("/userdashboard")}>
              <img src={link} alt="avatar" className="md:w-11 md:h-11 w-8 h-8 ml-2 border-[3px] p-[1px] rounded-full" />
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}
