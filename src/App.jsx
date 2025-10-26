import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebarvideos from './components/HomeComponents/SidebarVideos'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Search from './pages/Search'
import Channel from './pages/Channel'
import Signupform from './components/Authentication/SignupForm'
import Loginform from './components/Authentication/LoginForm'
import FloatingModal from './pages/FloatingModal'
import UserDashboard from './pages/User-Dashboard/UserDashbord'
import { useDispatch } from 'react-redux'
import { fetchUser } from './Redux/Slices/AuthSlice'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import RoomPage from './pages/videoCall/Room.jsx'
import LobbyScreen from './pages/videoCall/Lobby.jsx'

export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation();
    const dispatch = useDispatch();

    const shouldHideSidebar = location.pathname === '/';

    useEffect(() => {
        dispatch(fetchUser());
        console.log("fetchuser runs");
    }, [dispatch])

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="min-h-screen flex flex-col">
                <Navbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
                <div className="flex flex-1">
                    {shouldHideSidebar && <Sidebarvideos open={sidebarOpen} />}
                    <main className="flex-1 p-4 overflow-y-auto">
                        <FloatingModal />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path='/lobby' element={<LobbyScreen/>}/>
                            <Route  path="/room/:roomId" element ={<RoomPage/>}   />
                            <Route path="/watch/:id" element={<Watch />} />
                            <Route path="/search/:query" element={<Search />} />
                            <Route path="/channel/:username" element={<Channel />} />
                            <Route path="/floatingmodal" element={<FloatingModal />} />
                            <Route path="/login" element={<Loginform />} />
                            <Route path="/signup" element={<Signupform />} />
                            <Route path="/userdashboard" element={<UserDashboard />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </>

    )
}