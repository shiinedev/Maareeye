import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/ThemeProvider'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from "react-router-dom"; // FIX HERE!!
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index:true,
        element:<Home />
      },
      {
        path: "login",    // no slash here
        element: <Login />
      },
      {
        path: "register", // no slash here
        element: <Register />
      }
    ],
  },
]);


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
