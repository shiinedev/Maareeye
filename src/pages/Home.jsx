
import HeroSection from '@/components/HeroSection'
import Testimonials from '@/components/Testimonials';

import { useTheme } from '@/components/ThemeProvider'

import React from 'react'


const Home = () => {
const {theme} = useTheme();
  return (
    <div>
      <HeroSection />

      <section className="pb-10 px-6 text-center">
      <h2 className="md:text-2xl font-bold mb-6 capitalize gradient-title">Take a look at your dashboard</h2>
      <div className='hero-image-wrapper'>
      <div className="mx-auto  max-w-5xl rounded-lg overflow-hidden border shadow-xl hero-image ">
        <img
          src={theme === "dark" ?"/images/DashDark.PNG" :"/images/DashLight.PNG"}
          alt="Dashboard preview"
          className="w-full h-auto hero-image.scrolled "
        />
      </div>
      </div>
    </section>
    <Testimonials />

    </div>
  )
}

export default Home
