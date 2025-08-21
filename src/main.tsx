import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'
import { Toaster } from 'sonner'
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster 
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    />
  </React.StrictMode>,
)