import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './AdmissionProcess.css';

const AdmissionProcess = () => {
  const steps = [
    {
      number: '01',
      title: 'Inquiry & School Visit',
      description: 'Contact our admission office or visit the campus to learn about our programs and facilities.',
      icon: '📋'
    },
    {
      number: '02',
      title: 'Application Submission',
      description: 'Fill out the application form and submit required documents including previous academic records.',
      icon: '📝'
    },
    {
      number: '03',
      title: 'Entrance Assessment',
      description: 'Students appear for age-appropriate entrance assessment to evaluate their academic readiness.',
      icon: '📚'
    },
    {
      number: '04',
      title: 'Parent Interview',
      description: 'Meet with school administration to discuss expectations, school policies, and student needs.',
      icon: '👥'
    },
    {
      number: '05',
      title: 'Admission Confirmation',
      description: 'Receive admission decision and complete enrollment by submitting fees and required documents.',
      icon: '✅'
    }
  ];

  return (
    <section className="admission-process">
      <div className="admission-process__container">
        <div className="admission-process__header">
          <SectionLabel>How to Apply</SectionLabel>
          <h2>Admission <em>Process</em></h2>
          <p className="admission-process__intro">
            Follow these simple steps to enroll your child at Shining Star English School
          </p>
        </div>

        <div className="process-steps">
          {steps.map((step, index) => (
            <div key={index} className="process-step">
              <div className="process-step__icon">
                <span className="process-step__emoji">{step.icon}</span>
                <div className="process-step__number">{step.number}</div>
              </div>
              <div className="process-step__content">
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="process-step__connector"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdmissionProcess;
