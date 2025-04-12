
import { createBrowserRouter } from "react-router";


export const router =  createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
       {
        path:"/login",
        element:<Login />
       },
       {
        path:"/register",
        element:<Register />
       }

      ],
    },
  ]);
  