import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/ThemeProvider'
import { RouterProvider } from 'react-router'

import { AuthProvider } from './context/AuthContext'
import { router } from './routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
      <RouterProvider router={router}>     
      <App />
      </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  
  </StrictMode>,
)
