import React from 'react';
import Card from '../../../components/landing/ui/Card';
import { TrackChanges, Visibility, Diamond } from '@mui/icons-material';
import './Mission.css';

const Mission = () => {
  return (
    <section className="mission">
      <div className="mission__container">
        <div className="mission__grid">
          <Card className="mission__card" hover={false}>
            <div className="mission__icon"><TrackChanges sx={{ fontSize: 48 }} /></div>
            <h3>Our <em>Mission</em></h3>
            <p>
              To provide quality education that nurtures academic excellence, character development, and critical thinking skills, empowering students to become responsible global citizens who contribute positively to society.
            </p>
          </Card>

          <Card className="mission__card" hover={false}>
            <div className="mission__icon"><Visibility sx={{ fontSize: 48 }} /></div>
            <h3>Our <em>Vision</em></h3>
            <p>
              To be the leading educational institution in Panchthar, recognized for excellence in teaching, holistic development, and preparing students to excel in an ever-changing world.
            </p>
          </Card>

          <Card className="mission__card" hover={false}>
            <div className="mission__icon"><Diamond sx={{ fontSize: 48 }} /></div>
            <h3>Core <em>Values</em></h3>
            <ul className="mission__values-list">
              <li>Excellence in Education</li>
              <li>Integrity and Honesty</li>
              <li>Respect and Compassion</li>
              <li>Innovation and Creativity</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Mission;
