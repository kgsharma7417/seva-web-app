import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Categories from '../components/home/Categories';
import WorkerCards from '../components/home/WorkerCards';
import HowItWorks from '../components/home/HowItWorks';
import FooterCTA from '../components/home/FooterCTA';

const Homepage = () => {
  return (
    <div className="min-h-screen font-inter overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-20"></div>
        <div className="orb bg-[#3B82F6]/20 w-[400px] h-[400px] top-[-100px] left-[-100px]"></div>
        <div className="orb bg-[#06B6D4]/10 w-[500px] h-[500px] top-[20%] right-[-150px]" style={{animationDelay: '-2s'}}></div>
        <div className="orb bg-[#3B82F6]/10 w-[300px] h-[300px] bottom-[-50px] left-[20%]" style={{animationDelay: '-4s'}}></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Categories />
        <WorkerCards />
        <HowItWorks />
        <FooterCTA />
      </div>
    </div>
  );
};

export default Homepage;
