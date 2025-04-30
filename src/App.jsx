import { Toaster } from "react-hot-toast"
import { Outlet } from "react-router"
import { Footer } from "./components/Footer"


function App() {

  return (
    <>
     <main>
     <Outlet />
     </main>
     <Footer />
     <Toaster />
    </>
  )
}

export default App
