import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { initAntiDebug } from './antiDebug'
import './index.css'

initAntiDebug();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
