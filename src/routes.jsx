import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import UnAuthenticatedRoutes from "./components/UnAuthenticatedRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Overview from "./pages/Dashboard/Overview";
import AddTransaction from "./pages/Dashboard/AddTransaction";
import Transactions from "./pages/Dashboard/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import Accounts from "./pages/Dashboard/Accounts";
import MakePlan from "./pages/Dashboard/MakePlan";
import YourPlans from "./pages/Dashboard/YourPlans";
import Report from "./pages/Dashboard/Report";
import NotFoundPage from "./components/NotFoundPage";


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
        path:"*",
        element:<NotFoundPage />
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
        element: <ProtectedRoute children={<Dashboard />} /> ,
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
            path:"/dashboard/addTransaction/:id",
            element: <AddTransaction />
          },
          {
            path:"/dashboard/transactionList",
            element:<Transactions />
          },
          {
            path:"/dashboard/accounts",
            element:<Accounts />
          },
          {
            path:"/dashboard/makePlan",
            element:<MakePlan />
          },
          {
            path:"/dashboard/makePlan/:id",
            element:<MakePlan />
          },
          {
            path:"/dashboard/yourPlans",
            element:<YourPlans />
          },
          {
            path:"/dashboard/report",
            element:<Report />
          }
        ]
      }
    ],
  },
]);
