import { Outlet } from "react-router"
import Navbar from "./components/Navbar"
import { Toaster } from "./components/ui/sonner"

function App() {

  return (
    <>
     <main>
     <Outlet />
     </main>
     <Toaster />
    </>
  )
}

export default App
