import { Footer } from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { RegisterForm } from '@/components/ui/register-form'
import React from 'react'

const Register = () => {
   
  return (
    <>
    <Navbar />
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm">
      <RegisterForm />
    </div>
  </div>
  <Footer />
  </>
  )
}

export default Register
