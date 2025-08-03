// pages/index.tsx

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import AboutUsSection from '../components/AboutUsSection';
import Footer from '../components/Footer'; 
import Contact from '../components/contactForm';


export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <AboutUsSection />
      <section id="contact-section"></section>
      <Contact />
      <Footer />
      {/* 2. Add it to the end of your page */}
      
    </div>
    
  );
}