import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GeoProvider } from './context/GeoContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GeoProvider>
      <App />
    </GeoProvider>
  </StrictMode>,
)
