import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './PageHero.css';

const PageHero = () => {
  return (
    <section className="page-hero">
      <div className="page-hero__circle"></div>
      <div className="page-hero__container">
        <div className="page-hero__breadcrumb">
          <span>Home</span>
          <span className="page-hero__breadcrumb-separator">/</span>
          <span>About Us</span>
        </div>
        <SectionLabel>Who We Are</SectionLabel>
        <h1>About <em>Shining Star</em></h1>
        <p className="page-hero__description">
          Empowering young minds in Panchthar, Nepal with quality education since 2051 BS
        </p>
      </div>
    </section>
  );
};

export default PageHero;
