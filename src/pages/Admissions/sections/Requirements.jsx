import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import Card from '../../../components/landing/ui/Card';
import './Requirements.css';

const Requirements = () => {
  const documentsByLevel = [
    {
      level: 'Pre-Primary & Primary',
      subtitle: 'Nursery - Class 5',
      requirements: [
        'Birth certificate (original and copy)',
        'Recent passport-size photographs (4 copies)',
        'Transfer certificate (if applicable)',
        'Immunization records',
        'Parent/Guardian identification documents'
      ]
    },
    {
      level: 'Lower Secondary',
      subtitle: 'Class 6 - 8',
      requirements: [
        'Birth certificate (original and copy)',
        'Recent passport-size photographs (4 copies)',
        'Transfer certificate from previous school',
        'Previous academic records/mark sheets',
        'Character certificate from previous school',
        'Parent/Guardian identification documents'
      ]
    }
  ];

  return (
    <section className="requirements">
      <div className="requirements__container">
        <div className="requirements__header">
          <SectionLabel>Documents Needed</SectionLabel>
          <h2>Admission <em>Requirements</em></h2>
        </div>

        <div className="requirements__grid">
          {documentsByLevel.map((doc, index) => (
            <Card key={index} className="requirements__card" hover={false}>
              <h3 className="requirements__level">{doc.level}</h3>
              <div className="requirements__subtitle">{doc.subtitle}</div>
              <ul className="requirements__list">
                {doc.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="requirements__note">
          <div className="requirements__note-icon">ℹ️</div>
          <p>
            <strong>Note:</strong> All documents must be submitted at the time of admission. Original documents will be verified and returned immediately. Photocopies will be retained by the school.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Requirements;
