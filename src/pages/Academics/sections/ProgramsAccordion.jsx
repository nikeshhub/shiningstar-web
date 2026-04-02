import React, { useState } from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './ProgramsAccordion.css';

const ProgramsAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const programs = [
    {
      number: '01',
      icon: '🌱',
      title: 'Pre-Primary',
      subtitle: 'Nursery - UKG',
      ageRange: 'Age 3-5',
      description: 'Our Pre-Primary program focuses on early childhood development through play-based learning, building social skills, and fostering curiosity.',
      subjects: ['Basic English', 'Numbers & Counting', 'Art & Craft', 'Music & Movement', 'Storytelling', 'Social Skills'],
      highlights: [
        'Play-based learning methodology',
        'Safe and nurturing environment',
        'Focus on social and emotional development',
        'Introduction to English language'
      ]
    },
    {
      number: '02',
      icon: '📚',
      title: 'Primary',
      subtitle: 'Class 1-5',
      ageRange: 'Age 6-10',
      description: 'Primary education builds strong academic foundations with emphasis on English, Mathematics, Science, and creative expression.',
      subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Nepali', 'Computer', 'Art', 'Physical Education'],
      highlights: [
        'Strong foundation in core subjects',
        'Interactive and engaging teaching methods',
        'Regular assessments and feedback',
        'Focus on reading and writing skills'
      ]
    },
    {
      number: '03',
      icon: '🎓',
      title: 'Lower Secondary',
      subtitle: 'Class 6-8',
      ageRange: 'Age 11-13',
      description: 'Advanced curriculum building critical thinking, research skills, and subject specialization to prepare students for their academic future.',
      subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Nepali', 'Computer Science', 'Optional Mathematics', 'Health & Physical Education'],
      highlights: [
        'Subject specialization begins',
        'Introduction to research and projects',
        'Advanced problem-solving skills',
        'Strong foundation for future education'
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="programs-accordion">
      <div className="programs-accordion__container">
        <div className="programs-accordion__header">
          <SectionLabel>Complete Curriculum</SectionLabel>
          <h2>Academic <em>Programs</em></h2>
          <p className="programs-accordion__intro">
            Explore our comprehensive academic programs designed for different age groups
          </p>
        </div>

        <div className="accordion">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`accordion-item ${openIndex === index ? 'accordion-item--open' : ''}`}
            >
              <div
                className="accordion-item__header"
                onClick={() => toggleAccordion(index)}
              >
                <div className="accordion-item__icon-number">
                  <div className="accordion-item__icon">{program.icon}</div>
                  <div className="accordion-item__number">{program.number}</div>
                </div>
                <div className="accordion-item__info">
                  <h3 className="accordion-item__title">{program.title}</h3>
                  <div className="accordion-item__subtitle">{program.subtitle}</div>
                  <p className="accordion-item__description">{program.description}</p>
                </div>
                <div className="accordion-item__meta">
                  <span className="accordion-item__tag">{program.ageRange}</span>
                  <span className="accordion-item__toggle">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </div>
              </div>

              {openIndex === index && (
                <div className="accordion-item__body">
                  <div className="accordion-item__content">
                    <div className="accordion-content__section">
                      <h4>Subjects Offered</h4>
                      <div className="accordion-content__subjects">
                        {program.subjects.map((subject, i) => (
                          <span key={i} className="subject-tag">{subject}</span>
                        ))}
                      </div>
                    </div>

                    <div className="accordion-content__section">
                      <h4>Program Highlights</h4>
                      <ul className="accordion-content__list">
                        {program.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsAccordion;
