import React from "react";
import SectionLabel from "../../../components/landing/ui/SectionLabel";
import "./OurStory.css";

const OurStory = () => {
  return (
    <section className="our-story">
      <div className="our-story__container">
        <div className="our-story__grid">
          <div className="our-story__image">
            <img
              src="https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402692/12_k29enz.jpg"
              alt="Shining Star English School"
            />
          </div>
          <div className="our-story__content">
            <SectionLabel>Our Journey</SectionLabel>
            <h2>
              Our <em>Story</em>
            </h2>
            <p>
              Welcome to Shining Star English School, a beacon of quality
              education in the picturesque region of Tharpu, located in
              Panchthar. For over 30 years since 2051 BS (1994 AD), our school
              has been dedicated to providing exceptional educational
              opportunities for students in this beautiful region.
            </p>
            <p>
              At Shining Star English School, we understand the importance of a
              strong foundation in education. That's why we focus on providing
              quality education from Pre-Primary to Lower Secondary level,
              ensuring that students receive the best possible start to their
              academic journey.
            </p>
            <p>
              We firmly believe that education is the key to unlocking the
              potential of every individual. Our dedicated team of highly
              qualified teachers is passionate about nurturing young minds and
              inspiring them to become lifelong learners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
