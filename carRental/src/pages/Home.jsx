import React from 'react'
import HeroSection from '../components/HeroSection'
import CarCategoryShowcase from '../components/Carcategoryshowcase'



const Home = () => {
  return (
    <div className="overflow-hidden"> {/* Add overflow-hidden to prevent scroll */}
      <HeroSection/>
      <CarCategoryShowcase/>
    </div>
  )
}

export default Home