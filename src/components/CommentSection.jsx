import React, { useState } from 'react'


export default function CommentsSection({ initial = [] }) {
const [comments, setComments] = useState(initial)
const [txt, setTxt] = useState('')


function add(e) {
e.preventDefault()
if (!txt.trim()) return
setComments([{ id: Date.now(), author: 'You', text: txt }, ...comments])
setTxt('')
}


return (
<div className="mt-6">
<form onSubmit={add} className="flex gap-2">
<input value={txt} onChange={e => setTxt(e.target.value)} placeholder="Add a public comment..." className="flex-1 bg-transparent border border-white/10 rounded px-3 py-2" />
<button className="px-4 py-2 bg-white/5 rounded">Comment</button>
</form>


<div className="mt-4 space-y-3">
{comments.map(c => (
<div key={c.id} className="p-3 bg-white/2 rounded">
<div className="text-sm font-semibold">{c.author}</div>
<div className="text-sm text-[var(--muted)]">{c.text}</div>
</div>
))}
</div>
</div>
)
}