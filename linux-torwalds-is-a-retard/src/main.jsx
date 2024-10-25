import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../node_modules/sanitize.css/sanitize.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
