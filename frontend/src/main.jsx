import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
// import Login from './Login.jsx'
// import Cadastro from './Cadastro.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
