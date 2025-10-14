import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Search from './pages/Search'
import Channel from './pages/Channel'
import Signupform from './components/SignupForm'
import Loginform from './components/LoginForm'
import FloatingModal from './pages/FloatingModal'


export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false)


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
            <div className="flex flex-1">
                <Sidebar open={sidebarOpen} />
                    <main className="flex-1 p-4 overflow-y-auto">
                        <FloatingModal />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/watch/:id" element={<Watch />} />
                            <Route path="/search/:query" element={<Search />} />
                            <Route path="/channel/:id" element={<Channel />} />
                            <Route path="/login" element={<Loginform />} />
                            <Route path="/signup" element={<Signupform />} />
                        </Routes>
                    </main>
            </div>
        </div>
    )
}