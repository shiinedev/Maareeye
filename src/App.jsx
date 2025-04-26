import { Toaster } from "react-hot-toast"
import { Outlet } from "react-router"


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
