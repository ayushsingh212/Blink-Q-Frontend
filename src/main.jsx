import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './Redux/Store'
import { SocketProvider } from './context/SocketProvider.jsx'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<SocketProvider>
<Provider store={store}>
<App />
</Provider>
</SocketProvider>
</BrowserRouter>
</React.StrictMode>
)