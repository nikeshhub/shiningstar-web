import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './NoticesEvents.css';

const NoticesEvents = () => {
  const notices = [
    {
      date: { day: '15', month: 'Apr' },
      title: 'Annual Sports Day Registration Open',
      description: 'Register your child for the upcoming annual sports day. Multiple events and competitions planned.'
    },
    {
      date: { day: '22', month: 'Apr' },
      title: 'Parent-Teacher Meeting',
      description: 'Quarterly parent-teacher meeting to discuss student progress and academic development.'
    },
    {
      date: { day: '01', month: 'May' },
      title: 'Summer Camp Enrollment',
      description: 'Enroll now for our exciting summer camp with activities, workshops, and educational trips.'
    },
    {
      date: { day: '10', month: 'May' },
      title: 'Mid-Term Examination Schedule',
      description: 'Mid-term examinations for all classes. Detailed schedule available on notice board.'
    }
  ];

  const events = [
    { date: 'April 25, 2026', title: 'Science Exhibition' },
    { date: 'May 5, 2026', title: 'Annual Day Celebration' },
    { date: 'May 18, 2026', title: 'Inter-School Debate' },
    { date: 'June 1, 2026', title: 'Summer Break Begins' }
  ];

  return (
    <section className="notices-events">
      <div className="notices-events__container">
        <div className="notices-events__grid">
          {/* Notices Column */}
          <div className="notices">
            <div className="notices__header">
              <SectionLabel>Latest Updates</SectionLabel>
              <h2>Notice <em>Board</em></h2>
            </div>

            <div className="notices__list">
              {notices.map((notice, index) => (
                <div key={index} className="notice-item">
                  <div className="notice-item__date">
                    <div className="notice-item__day">{notice.date.day}</div>
                    <div className="notice-item__month">{notice.date.month}</div>
                  </div>
                  <div className="notice-item__content">
                    <h4 className="notice-item__title">{notice.title}</h4>
                    <p className="notice-item__description">{notice.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Column */}
          <div className="events">
            <div className="events__card">
              <h3 className="events__title">Upcoming <em>Events</em></h3>
              <div className="events__list">
                {events.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-item__date">{event.date}</div>
                    <div className="event-item__title">{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticesEvents;
