import { Footer } from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { LoginForm } from '@/components/ui/login-form'
import React from 'react'

const Login = () => {
  return (
    <>
     <Navbar />
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  </div>
  <Footer />
  </>
  )
}

export default Login
