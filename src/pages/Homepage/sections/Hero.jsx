import React from 'react';
import Button from '../../../components/landing/ui/Button';
import { Science, School, Shield } from '@mui/icons-material';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__left">
        <div className="hero__content">
          <h1 className="hero__title">
            Where <em>Excellence</em> Meets Education
          </h1>
          <p className="hero__description">
            Shining Star English School, Panchthar Nepal - Nurturing young minds with quality education,
            strong values, and a commitment to excellence for over 30 years.
          </p>

          <div className="hero__actions">
            <Button variant="primary" size="large" href="/admissions">Apply Now</Button>
            <Button variant="secondary" size="large" href="/academics">Explore Programs</Button>
          </div>
        </div>

        <div className="hero__metrics">
          <div className="hero__metric">
            <div className="hero__metric-value">220+</div>
            <div className="hero__metric-label">Students</div>
          </div>
          <div className="hero__metric">
            <div className="hero__metric-value">12+</div>
            <div className="hero__metric-label">Teachers</div>
          </div>
          <div className="hero__metric">
            <div className="hero__metric-value">99%</div>
            <div className="hero__metric-label">Pass Rate</div>
          </div>
        </div>
      </div>

      <div className="hero__right">
        <div className="hero__grid-overlay"></div>
        <div className="hero__glow hero__glow--1"></div>
        <div className="hero__glow hero__glow--2"></div>
        <div className="hero__ghost-text">Shine</div>

        <div className="hero__badge">
          <div className="hero__badge-icon">
            <div className="hero__badge-dot"></div>
          </div>
          <div className="hero__badge-content">
            <div className="hero__badge-label">Est. 1994 (2051 BS)</div>
            <div className="hero__badge-title">30+ Years</div>
          </div>
        </div>

        <div className="hero__cards">
          <div className="hero__card hero__card--1">
            <div className="hero__card-icon"><Science sx={{ fontSize: 32 }} /></div>
            <div className="hero__card-title">Practical Learning</div>
          </div>
          <div className="hero__card hero__card--2">
            <div className="hero__card-icon"><School sx={{ fontSize: 32 }} /></div>
            <div className="hero__card-title">Caring Teachers</div>
          </div>
          <div className="hero__card hero__card--3">
            <div className="hero__card-icon"><Shield sx={{ fontSize: 32 }} /></div>
            <div className="hero__card-title">Safe Environment</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
