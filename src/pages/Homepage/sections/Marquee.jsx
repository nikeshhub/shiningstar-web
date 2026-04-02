import React from 'react';
import './Marquee.css';

const Marquee = () => {
  const items = [
    'Excellence in Education',
    'Character Building',
    'Community Focused',
    'Dedicated Faculty',
    'Holistic Development',
    'Co-Curricular Activities',
    'Safe Environment',
    'Individual Attention',
  ];

  return (
    <div className="marquee">
      <div className="marquee__track">
        {[...items, ...items].map((item, index) => (
          <React.Fragment key={index}>
            <span className="marquee__item">{item}</span>
            <span className="marquee__dot"></span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
