import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './GalleryHero.css';

const GalleryHero = () => {
  return (
    <section className="page-hero">
      <div className="page-hero__circle"></div>
      <div className="page-hero__container">
        <div className="page-hero__breadcrumb">
          <span>Home</span>
          <span className="page-hero__breadcrumb-separator">/</span>
          <span>Gallery</span>
        </div>
        <SectionLabel>Our Moments</SectionLabel>
        <h1>Photo <em>Gallery</em></h1>
        <p className="page-hero__description">
          Capturing the vibrant moments and memories at Shining Star English School
        </p>
      </div>
    </section>
  );
};

export default GalleryHero;
