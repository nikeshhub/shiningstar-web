import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import Card from '../../../components/landing/ui/Card';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: '🎯',
      title: 'Quality Education',
      description: 'Comprehensive curriculum designed to foster critical thinking, creativity, and academic excellence in every student.'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Faculty',
      description: 'Dedicated and experienced teachers committed to nurturing each child\'s potential and ensuring personalized attention.'
    },
    {
      icon: '🏫',
      title: 'Community Building',
      description: 'Dedicated facilities including well-equipped classrooms, library, and playground serving the local community for generations.'
    },
    {
      icon: '🌱',
      title: 'Holistic Development',
      description: 'Focus on character building, leadership skills, and values alongside academic achievement to develop well-rounded individuals.'
    },
    {
      icon: '🎨',
      title: 'Co-Curricular Activities',
      description: 'Rich variety of extracurricular programs including sports, arts, music, and cultural activities to discover and nurture talents.'
    },
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'Strong partnership between school, parents, and community creating a supportive ecosystem for student success.'
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
