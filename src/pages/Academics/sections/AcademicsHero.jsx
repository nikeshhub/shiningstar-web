import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './AcademicsHero.css';

const AcademicsHero = () => {
  return (
    <section className="page-hero">
      <div className="page-hero__circle"></div>
      <div className="page-hero__container">
        <div className="page-hero__breadcrumb">
          <span>Home</span>
          <span className="page-hero__breadcrumb-separator">/</span>
          <span>Academics</span>
        </div>
        <SectionLabel>Our Programs</SectionLabel>
        <h1>Academic <em>Excellence</em></h1>
        <p className="page-hero__description">
          Comprehensive educational programs from Pre-Primary to Secondary level
        </p>
      </div>
    </section>
  );
};

export default AcademicsHero;
