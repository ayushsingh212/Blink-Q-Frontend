import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './Redux/Store'
import { SocketProvider } from './context/SocketProvider.jsx'
import { CommentsProvider } from './ContextAPI/ContextComments.jsx'


createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <SocketProvider>
                    <CommentsProvider>
                        <App />
                    </CommentsProvider>
                </SocketProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)