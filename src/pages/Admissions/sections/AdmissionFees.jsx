import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './AdmissionFees.css';

const AdmissionFees = () => {
  const feeStructure = [
    {
      level: 'Pre-Primary',
      grade: 'Nursery - UKG',
      admission: 'NPR 5,000',
      monthly: 'NPR 3,000',
      annual: 'NPR 36,000'
    },
    {
      level: 'Primary',
      grade: 'Class 1-5',
      admission: 'NPR 8,000',
      monthly: 'NPR 4,500',
      annual: 'NPR 54,000'
    },
    {
      level: 'Lower Secondary',
      grade: 'Class 6-8',
      admission: 'NPR 10,000',
      monthly: 'NPR 5,500',
      annual: 'NPR 66,000'
    }
  ];

  return (
    <section className="admission-fees">
      <div className="admission-fees__container">
        <div className="admission-fees__header">
          <SectionLabel>Fee Structure</SectionLabel>
          <h2>Admission <em>Fees</em></h2>
          <p className="admission-fees__intro">
            Affordable and transparent fee structure for quality education
          </p>
        </div>

        <div className="fee-table">
          <div className="fee-table__header">
            <div className="fee-table__cell">Level</div>
            <div className="fee-table__cell">Admission Fee</div>
            <div className="fee-table__cell">Monthly Fee</div>
            <div className="fee-table__cell">Annual Total</div>
          </div>

          {feeStructure.map((fee, index) => (
            <div key={index} className="fee-table__row">
              <div className="fee-table__cell fee-table__cell--primary">
                <div className="fee-table__level">{fee.level}</div>
                <div className="fee-table__grade">{fee.grade}</div>
              </div>
              <div className="fee-table__cell">{fee.admission}</div>
              <div className="fee-table__cell">{fee.monthly}</div>
              <div className="fee-table__cell fee-table__cell--highlight">{fee.annual}</div>
            </div>
          ))}
        </div>

        <div className="admission-fees__notes">
          <h4>Additional Information</h4>
          <ul>
            <li>Fees are subject to annual review and may change</li>
            <li>Scholarships available for meritorious students</li>
            <li>Financial assistance programs for economically disadvantaged students</li>
            <li>Sibling discount of 10% applicable on monthly fees</li>
            <li>Transportation and meals charged separately as per usage</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdmissionFees;
