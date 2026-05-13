import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '14px',
          borderRadius: '12px',
          border: '1px solid #D1FAE5',
        },
        success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
      }}
    />
  </React.StrictMode>
)
