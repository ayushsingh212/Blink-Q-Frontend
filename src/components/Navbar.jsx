import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loginform from './LoginForm'
import { setShowLogin } from '../Redux/Slices/AuthSlice'


export default function Navbar({ onToggleSidebar }) {
    const [q, setQ] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { status } = useSelector((state) => state.auth)

    const link = useSelector((state) => state.auth.user?.avatar)

    const navigateLogin = () => {
        dispatch(setShowLogin({ login: true, signup: false }));
    }

    function submit(e) {
        e.preventDefault()
        if (!q.trim()) return
        navigate(`/search/${encodeURIComponent(q.trim())}`)
    }

    return (
        <nav className="w-full bg-[var(--card)] sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded hover:bg-white/5 md:hidden"
                    aria-label="toggle sidebar"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>


                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-6 bg-red-600 rounded-sm flex items-center justify-center font-bold">BQ</div>
                    <span className="font-semibold hidden sm:inline">BlinkQ</span>
                </Link>


                <form onSubmit={submit} className="flex-1 max-w-xl mx-4">
                    <div className="relative">
                        <input
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="Search"
                            className="w-full rounded px-3 py-2 bg-transparent border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
                        />
                        <button className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/5 rounded">Search</button>
                    </div>
                </form>


                <div className="flex items-center gap-3">
                    <button className="hidden md:inline p-2 rounded hover:bg-white/5">Upload</button>
                    {!status ? (
                        <button onClick={navigateLogin} className='w-24 h-8 roun'>Login</button>
                    ) : (
                        <button onClick={()=> navigate("/userdashboard")}>
                            <img src={link} alt="avatar" className="w-8 h-8 rounded-full" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}