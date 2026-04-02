import React from 'react';
import './SectionLabel.css';

const SectionLabel = ({ children }) => {
  return (
    <div className="section-label">
      {children}
    </div>
  );
};

export default SectionLabel;
