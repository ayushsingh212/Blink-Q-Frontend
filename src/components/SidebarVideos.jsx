import React from 'react'
import { NavLink } from 'react-router-dom'


const categories = ['All', 'Music', 'Gaming', 'News', 'Sports', 'Education', 'Podcasts']


export default function Sidebar({ open = true }) {
    return (
        <aside className={`bg-[var(--card)] w-64 p-4 hidden md:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto`}>
            <nav className="flex flex-col gap-1">
                {categories.map(cat => (
                    <NavLink
                        key={cat}
                        to={`/?category=${cat.toLowerCase()}`}
                        className={({ isActive }) => `px-3 py-2 rounded hover:bg-white/5 ${isActive ? 'bg-white/5' : ''}`}
                    >
                        {cat}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}