import React from "react";
import { Image } from "antd";
import "./GalleryGrid.css";

const GalleryGrid = () => {
  const galleryImages = [
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402680/1_fqf4ho.jpg",
      title: "School External Activities",
      category: "Activities",
    },

    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402684/7_xtp4h5.jpg",
      title: "Vaccination Program",
      category: "Activities",
    },
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402685/8_ylgvko.jpg",
      title: "Educational Activities",
      category: "Academics",
    },

    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402688/10_xwhbpw.jpg",
      title: "Educational Activities",
      category: "Academics",
    },
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402691/11_cjj66w.jpg",
      title: "Happy Students",
      category: "School Life",
    },
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402692/12_k29enz.jpg",
      title: "School",
      category: "School Life",
    },
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402686/13_widqlw.jpg",
      title: "School Picnic",
      category: "Events",
    },
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402680/14_uw304h.jpg",
      title: "School Picnic",
      category: "Events",
    },
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402679/15_d15u8i.jpg",
      title: "Happy Students",
      category: "School Life",
    },
    {
      src: "https://res.cloudinary.com/duaz5kg1m/image/upload/v1775402694/16_vhhhyu.jpg",
      title: "School Programs",
      category: "Events",
    },
  ];

  return (
    <section className="gallery-grid-section">
      <div className="gallery-grid__container">
        <Image.PreviewGroup>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div key={index} className="gallery-item">
                <Image
                  src={image.src}
                  alt={image.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  preview={{
                    mask: (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(10, 15, 30, 0.9) 0%, transparent 100%)',
                        padding: '24px',
                        color: 'white',
                      }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: '#C7D6FC',
                          marginBottom: '4px',
                        }}>{image.category}</div>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '17px',
                        }}>{image.title}</div>
                      </div>
                    ),
                  }}
                />
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      </div>
    </section>
  );
};

export default GalleryGrid;
