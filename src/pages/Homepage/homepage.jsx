import React from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import WhyChooseUs from './sections/WhyChooseUs';
import Programs from './sections/Programs';
import Stats from './sections/Stats';
import NoticesEvents from './sections/NoticesEvents';
import Testimonials from './sections/Testimonials';
import CTABanner from './sections/CTABanner';
import './homepage.css';

export const Homepage = () => {
  return (
    <div className="homepage">
      <Navigation />
      <Hero />
      <Marquee />
      <WhyChooseUs />
      <Programs />
      <Stats />
      <NoticesEvents />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
};
