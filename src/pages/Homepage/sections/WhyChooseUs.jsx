import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import Card from '../../../components/landing/ui/Card';
import { Science, School, People, Psychology, Groups, Shield } from '@mui/icons-material';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <Science sx={{ fontSize: 48 }} />,
      title: 'Practical Learning Environment',
      description: 'Learning that works beyond textbooks, helping students understand real-life applications.'
    },
    {
      icon: <School sx={{ fontSize: 48 }} />,
      title: 'Dedicated & Caring Teachers',
      description: 'Teachers who guide students personally, ensuring every child is supported and understood.'
    },
    {
      icon: <People sx={{ fontSize: 48 }} />,
      title: 'Community-Centered Education',
      description: 'A school deeply connected with families and local values, building strong roots and responsibility.'
    },
    {
      icon: <Psychology sx={{ fontSize: 48 }} />,
      title: 'Discipline & Character Building',
      description: 'Focus on respect, responsibility, and behavior alongside academic learning.'
    },
    {
      icon: <Groups sx={{ fontSize: 48 }} />,
      title: 'Active Student Participation',
      description: 'Encouraging students to engage in classroom activities, presentations, and teamwork.'
    },
    {
      icon: <Shield sx={{ fontSize: 48 }} />,
      title: 'Safe & Supportive Environment',
      description: 'A space where students feel comfortable, motivated, and confident to learn and grow.'
    }
  ];

  return (
    <section className="why-choose">
      <div className="why-choose__container">
        <div className="why-choose__header">
          <SectionLabel>Our Strengths</SectionLabel>
          <h2>Why Choose <em>Shining Star</em></h2>
          <p className="why-choose__intro">
            Discover what makes us the preferred choice for parents and students in Panchthar
          </p>
        </div>

        <div className="why-choose__grid">
          {reasons.map((reason, index) => (
            <Card key={index} className="why-choose__card">
              <div className="why-choose__icon">{reason.icon}</div>
              <h3 className="why-choose__title">{reason.title}</h3>
              <p className="why-choose__description">{reason.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
