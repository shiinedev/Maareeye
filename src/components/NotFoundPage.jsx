import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export default function NotFoundPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow-xl"
      >
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-center text-gray-500 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
      </motion.div>
    </div>
  )
}