import React from 'react'
import HeroSection from '../components/Hero'
import WhyBuckBit from '../components/WhyBuckBit'
import Testimonials from '../components/Testimonial'
import FinalCTA from '../components/FinalCTA'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
    <HeroSection/>
    <WhyBuckBit/>
    <Testimonials/>
    <FinalCTA/>
    <FAQSection/>
    <Footer/>
    </>
  )
}

export default Home