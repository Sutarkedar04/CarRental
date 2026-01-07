import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import BookEv from '../components/BookEv'
import CarCategory from '../components/CarCategory'
import BookingModal from '../components/BookingModal'
import CarGrid from '../components/CarGrid'
import ServicesSection from '../components/ServicesSection'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div>
        <HeroSection/>
        <BookEv/>
        <CarCategory/>
        <BookingModal/>
        <CarGrid/>
        <ServicesSection/>
        <Newsletter/>
    </div>
  )
}

export default Home