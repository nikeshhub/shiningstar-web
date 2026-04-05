import React from 'react';
import './Marquee.css';

const Marquee = () => {
  const items = [
    'Practical Learning Environment',
    'Dedicated & Caring Teachers',
    'Community-Centered Education',
    'Discipline & Character Building',
    'Active Student Participation',
    'Safe & Supportive Environment',
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
