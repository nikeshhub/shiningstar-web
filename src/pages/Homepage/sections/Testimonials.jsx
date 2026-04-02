import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: 'Shining Star has transformed my daughter\'s academic journey. The teachers are caring and dedicated, and the school environment is truly nurturing.',
      author: 'Mrs. Sunita Sharma',
      relation: 'Parent of Class 8 Student'
    },
    {
      quote: 'The holistic approach to education here is remarkable. My son has excelled not just academically but also in sports and cultural activities.',
      author: 'Mr. Rajesh Limbu',
      relation: 'Parent of Class 6 Student'
    },
    {
      quote: 'Best decision we made for our children\'s education. The school balances traditional values with modern teaching methods perfectly.',
      author: 'Mrs. Deepa Rai',
      relation: 'Parent of Class 4 & 9 Students'
    }
  ];

  return (
    <section className="testimonials">
      <div className="testimonials__container">
        <div className="testimonials__header">
          <SectionLabel>Testimonials</SectionLabel>
          <h2>What <em>Parents</em> Say</h2>
          <p className="testimonials__intro">
            Hear from the families who trust us with their children's education
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-card__quote-mark">"</div>
              <blockquote className="testimonial-card__quote">
                {testimonial.quote}
              </blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__name">{testimonial.author}</div>
                <div className="testimonial-card__relation">{testimonial.relation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
