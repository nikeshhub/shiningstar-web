import React from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import PageHero from './sections/PageHero';
import OurStory from './sections/OurStory';
import Mission from './sections/Mission';
import PrincipalMessage from './sections/PrincipalMessage';
import './About.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Navigation />
      <PageHero />
      <OurStory />
      <Mission />
      <PrincipalMessage />
      <Footer />
    </div>
  );
};

export default AboutPage;
