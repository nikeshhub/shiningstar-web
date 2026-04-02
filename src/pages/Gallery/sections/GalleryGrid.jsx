import React from 'react';
import './GalleryGrid.css';

const GalleryGrid = () => {
  const galleryImages = [
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685864808/school_jwqrdl.jpg',
      title: 'School Building',
      category: 'Campus'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685945866/75369298_952302571819235_3206045515682676736_n_hnneps.jpg',
      title: 'Annual Day Celebration',
      category: 'Events'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685864808/school_jwqrdl.jpg',
      title: 'Sports Day',
      category: 'Sports'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685945866/75369298_952302571819235_3206045515682676736_n_hnneps.jpg',
      title: 'Science Exhibition',
      category: 'Activities'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685864808/school_jwqrdl.jpg',
      title: 'Classroom Learning',
      category: 'Academics'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685945866/75369298_952302571819235_3206045515682676736_n_hnneps.jpg',
      title: 'Cultural Program',
      category: 'Events'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685864808/school_jwqrdl.jpg',
      title: 'Computer Lab',
      category: 'Facilities'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685945866/75369298_952302571819235_3206045515682676736_n_hnneps.jpg',
      title: 'Library',
      category: 'Facilities'
    },
    {
      src: 'https://res.cloudinary.com/duaz5kg1m/image/upload/v1685864808/school_jwqrdl.jpg',
      title: 'Student Activities',
      category: 'Activities'
    }
  ];

  return (
    <section className="gallery-grid-section">
      <div className="gallery-grid__container">
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div key={index} className="gallery-item">
              <div className="gallery-item__image-wrapper">
                <img
                  src={image.src}
                  alt={image.title}
                  className="gallery-item__image"
                />
                <div className="gallery-item__overlay">
                  <div className="gallery-item__category">{image.category}</div>
                  <div className="gallery-item__title">{image.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryGrid;
