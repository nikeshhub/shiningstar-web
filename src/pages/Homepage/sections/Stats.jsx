import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    { value: '220+', label: 'Happy Students' },
    { value: '12+', label: 'Dedicated Teachers' },
    { value: '95%', label: 'Pass Rate' },
    { value: '30+', label: 'Years of Excellence' }
  ];

  return (
    <section className="stats">
      <div className="stats__container">
        <div className="stats__grid">
          {stats.map((stat, index) => (
            <div key={index} className="stats__item">
              <div className="stats__value">{stat.value}</div>
              <div className="stats__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
