import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/ThemeProvider'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from "react-router-dom"; 
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'
import UnAuthenticatedRoutes from './components/UnAuthenticatedRoutes'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboars/Dashboard'
import Overview from './pages/Dashboars/Overview'
import AddTransaction from './pages/Dashboars/AddTransaction'
import Transactions from './pages/Dashboars/Transactions'
import Accounts from './pages/Dashboars/Accounts'
import ProtectedRoute from './components/ProtectedRoute'

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
        path: "/login",    
        element:<UnAuthenticatedRoutes children={ <Login />} />
      },
      {
        path: "/register", 
        element:<UnAuthenticatedRoutes children={<Register />} /> 
      },
      {
        path:"/profile",
        element:<ProtectedRoute children={<Profile />} />
      },
      {
        path:"/dashboard",
        element: <ProtectedRoute children={<Dashboard/>} /> ,
        children:[
          {
            index:true,
            element:<Overview />
          },
          {
            path:"/dashboard/addTransaction",
            element: <AddTransaction />
          },
          {
            path:"/dashboard/transactionList",
            element:<Transactions />
          },
          {
            path:"/dashboard/accounts",
            element:<Accounts />
          }
        ]
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
