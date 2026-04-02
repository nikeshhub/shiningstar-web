import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import Button from '../../../components/landing/ui/Button';
import './AdmissionsHero.css';

const AdmissionsHero = () => {
  return (
    <section className="admissions-hero">
      <div className="admissions-hero__circle"></div>
      <div className="admissions-hero__container">
        <div className="admissions-hero__breadcrumb">
          <span>Home</span>
          <span className="admissions-hero__breadcrumb-separator">/</span>
          <span>Admissions</span>
        </div>
        <SectionLabel>Join Our Community</SectionLabel>
        <h1>Admissions <em>Open</em></h1>
        <p className="admissions-hero__description">
          Enrolling now for the upcoming academic session. Give your child the gift of quality education and holistic development.
        </p>
        <div className="admissions-hero__actions">
          <Button variant="primary" size="large">Download Prospectus</Button>
          <Button variant="secondary" size="large">Contact Admission Office</Button>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsHero;
