import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './PrincipalMessage.css';

const PrincipalMessage = () => {
  return (
    <section className="principal-message">
      <div className="principal-message__container">
        <div className="principal-message__grid">
          <div className="principal-message__image">
            <img
              src="https://res.cloudinary.com/duaz5kg1m/image/upload/v1685945866/75369298_952302571819235_3206045515682676736_n_hnneps.jpg"
              alt="Principal Ishwori Prasad Sapkota"
            />
          </div>
          <div className="principal-message__content">
            <SectionLabel>Leadership</SectionLabel>
            <h2>A Word from the <em>Principal</em></h2>

            <div className="principal-message__quote">
              <p>
                It gives me great pleasure to welcome you to Shining Star English School. Our school is dedicated to providing a nurturing and stimulating environment where students can grow, learn, and excel.
              </p>
              <p>
                We believe that every student has unique talents and abilities, and it is our mission to help them discover and develop their full potential. We strive to create a well-rounded education that focuses not only on academic excellence but also on character building, critical thinking, and social skills.
              </p>
              <p>
                As the principal, I am committed to fostering a positive and inclusive school culture that values diversity, respect, and teamwork. I encourage open communication between students, teachers, and parents to ensure a strong partnership in the education process.
              </p>
              <p>
                Together, let us embark on this educational journey, where we can inspire and empower our students to become responsible global citizens who make a positive impact on the world.
              </p>
            </div>

            <div className="principal-message__signature">
              <div className="principal-message__name">Ishwori Prasad Sapkota</div>
              <div className="principal-message__title">Principal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalMessage;
