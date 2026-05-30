import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { AnimeProvider } from './context/AnimeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AnimeProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#14142a',
                color: '#e2e8f0',
                border: '1px solid #1e1e3a',
                fontFamily: '"Outfit", sans-serif',
              },
              success: {
                iconTheme: { primary: '#a855f7', secondary: '#050507' },
              },
              error: {
                iconTheme: { primary: '#f43f5e', secondary: '#050507' },
              },
            }}
          />
        </AnimeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
