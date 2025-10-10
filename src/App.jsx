import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './pages/Home.jsx'
import Watch from './pages/Watch.jsx'
import Search from './pages/Search.jsx'
import Channel from './pages/Channel.jsx'


export default function App() {
const [sidebarOpen, setSidebarOpen] = useState(false)


return (
<div className="min-h-screen flex flex-col">
<Navbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
<div className="flex flex-1">
<Sidebar open={sidebarOpen} />
<main className="flex-1 p-4 overflow-y-auto">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/watch/:id" element={<Watch />} />
<Route path="/search/:query" element={<Search />} />
<Route path="/channel/:id" element={<Channel />} />
</Routes>
</main>
</div>
</div>
)
}