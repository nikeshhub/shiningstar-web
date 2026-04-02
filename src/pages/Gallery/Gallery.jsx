import React from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import GalleryHero from './sections/GalleryHero';
import GalleryGrid from './sections/GalleryGrid';
import './Gallery.css';

const Gallery = () => {
  return (
    <div className="gallery-page">
      <Navigation />
      <GalleryHero />
      <GalleryGrid />
      <Footer />
    </div>
  );
};

export default Gallery;
