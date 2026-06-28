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
    <div className="min-h-screen font-inter overflow-x-hidden bg-[#F1F3F6] dark:bg-gray-900">
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
