import React from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import AcademicsHero from './sections/AcademicsHero';
import ProgramsAccordion from './sections/ProgramsAccordion';
import Curriculum from './sections/Curriculum';
import './Academics.css';

const Academics = () => {
  return (
    <div className="academics-page">
      <Navigation />
      <AcademicsHero />
      <ProgramsAccordion />
      <Curriculum />
      <Footer />
    </div>
  );
};

export default Academics;
