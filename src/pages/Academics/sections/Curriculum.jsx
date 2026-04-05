import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import Card from '../../../components/landing/ui/Card';
import { MenuBook, Public, Science, Computer } from '@mui/icons-material';
import './Curriculum.css';

const Curriculum = () => {
  const features = [
    {
      icon: <MenuBook sx={{ fontSize: 48 }} />,
      title: 'National Curriculum',
      description: 'Aligned with national education board standards and requirements'
    },
    {
      icon: <Public sx={{ fontSize: 48 }} />,
      title: 'Modern Approach',
      description: 'Contemporary teaching methods with global best practices'
    },
    {
      icon: <Science sx={{ fontSize: 48 }} />,
      title: 'Practical Learning',
      description: 'Hands-on activities and experiments for better understanding'
    },
    {
      icon: <Computer sx={{ fontSize: 48 }} />,
      title: 'Digital Integration',
      description: 'Technology-enhanced learning with computer education'
    }
  ];

  return (
    <section className="curriculum">
      <div className="curriculum__container">
        <div className="curriculum__header">
          <SectionLabel>Our Approach</SectionLabel>
          <h2>Curriculum <em>Features</em></h2>
        </div>

        <div className="curriculum__grid">
          {features.map((feature, index) => (
            <Card key={index} className="curriculum__card">
              <div className="curriculum__icon">{feature.icon}</div>
              <h3 className="curriculum__title">{feature.title}</h3>
              <p className="curriculum__description">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
