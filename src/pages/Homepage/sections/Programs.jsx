import React from "react";
import SectionLabel from "../../../components/landing/ui/SectionLabel";
import Button from "../../../components/landing/ui/Button";
import "./Programs.css";

const Programs = () => {
  const programs = [
    {
      number: "01",
      title: "Pre-Primary",
      subtitle: "Nursery - UKG",
      description:
        "Foundation years focused on play-based learning, social skills, and early literacy development in a nurturing environment.",
      gradient: "linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%)",
    },
    {
      number: "02",
      title: "Primary",
      subtitle: "Class 1-5",
      description:
        "Building strong academic fundamentals with emphasis on English, Math, Science, and creative expression through interactive learning.",
      gradient: "linear-gradient(135deg, #E5F3FF 0%, #F0F8FF 100%)",
    },
    {
      number: "03",
      title: "Lower Secondary",
      subtitle: "Class 6-8",
      description:
        "Advanced curriculum building critical thinking, research skills, and subject specialization to prepare students for their academic future.",
      gradient: "linear-gradient(135deg, #E5FFE5 0%, #F0FFF0 100%)",
    },
  ];

  return (
    <section className="programs">
      <div className="programs__container">
        <div className="programs__header">
          <SectionLabel>Our Programs</SectionLabel>
          <h2>
            Academic <em>Programs</em>
          </h2>
          <p className="programs__intro">
            Comprehensive educational journey from early childhood to lower
            secondary level
          </p>
        </div>

        <div className="programs__grid">
          {programs.map((program, index) => (
            <div key={index} className="program-card">
              <div
                className="program-card__header"
                style={{ background: program.gradient }}
              >
                <div className="program-card__number">{program.number}</div>
              </div>
              <div className="program-card__body">
                <h3 className="program-card__title">{program.title}</h3>
                <div className="program-card__subtitle">{program.subtitle}</div>
                <p className="program-card__description">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
