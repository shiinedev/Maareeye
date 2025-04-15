import React from 'react'
import { Button } from "./ui/button"
import Navbar from './Navbar'
const HeroSection = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Main Content */}
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative">
        <div className="max-w-3xl mx-auto mb-24 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-title ">
              Manage Your Finance 
            </span>
            <br />
            <span className="">With Intelligence .</span>
          </h1>

          <p className=" max-w-2xl mx-auto mb-10 capitalize">
            financial management platform that helps you track,
            analyze, and optimize your spending with real-time insights.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="purple" size="xl">
              Get started
            </Button>
            <Button
           
              variant="outline"
              size="xl"
            >
              Ecosystems
            </Button>
          </div>
        </div>

        {/* Hero Image */}
       

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-purple-500 opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-blue-500 opacity-50 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 rounded-full bg-pink-500 opacity-60 animate-pulse delay-1000"></div>
              
      </main>
    </div>
  )
}

export default HeroSection






 
