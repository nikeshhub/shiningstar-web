import React from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import AdmissionsHero from './sections/AdmissionsHero';
import AdmissionProcess from './sections/AdmissionProcess';
import Requirements from './sections/Requirements';
import AdmissionFees from './sections/AdmissionFees';
import InquiryForm from './sections/InquiryForm';
import './Admissions.css';

const Admissions = () => {
  return (
    <div className="admissions-page">
      <Navigation />
      <AdmissionsHero />
      <AdmissionProcess />
      <Requirements />
      <AdmissionFees />
      <InquiryForm />
      <Footer />
    </div>
  );
};

export default Admissions;
