import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../App.tsx'
import '../styles/globals.css'

// Ensure the document has the proper theme class on initial load
document.documentElement.classList.add('theme-black');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)