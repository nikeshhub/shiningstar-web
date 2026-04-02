import React, { useState } from 'react';
import { Box, Typography, Container, Avatar, Rating, IconButton, Card, CardContent } from '@mui/material';
import {
  FormatQuote as QuoteIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@mui/icons-material';

const testimonials = [
  {
    id: 1,
    name: 'Ramesh Thapa',
    role: 'Parent of Class 8 Student',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'Shining Star has been instrumental in shaping my daughter\'s academic and personal growth. The teachers are dedicated and the infrastructure is excellent. My daughter loves going to school every day!',
  },
  {
    id: 2,
    name: 'Anita Sharma',
    role: 'Parent of Class 5 Student',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: 'The school provides a perfect balance of academics and extracurricular activities. My son has developed confidence and leadership skills. The staff is caring and professional.',
  },
  {
    id: 3,
    name: 'Bikash Rai',
    role: 'Former Student (SEE Graduate)',
    image: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    text: 'I spent 10 wonderful years at Shining Star. The quality of education and values I learned here have been invaluable. Secured 95% in SEE thanks to excellent guidance from teachers!',
  },
  {
    id: 4,
    name: 'Sita Gurung',
    role: 'Parent of Pre-Primary Student',
    image: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    text: 'As a parent of a nursery student, I am impressed with how the teachers handle young children with care and patience. The play-based learning approach is fantastic and my child loves it!',
  },
  {
    id: 5,
    name: 'Krishna Limbu',
    role: 'Parent of Class 10 Student',
    image: 'https://i.pravatar.cc/150?img=13',
    rating: 5,
    text: 'Excellent SEE preparation with regular mock tests and personalized attention. The career counseling sessions have been very helpful for my son\'s future planning. Highly recommend!',
  },
  {
    id: 6,
    name: 'Meena Tamang',
    role: 'Former Student',
    image: 'https://i.pravatar.cc/150?img=10',
    rating: 5,
    text: 'The sports and cultural programs at Shining Star helped me discover my talents. Now pursuing my dreams in performing arts, thanks to the encouragement I received here.',
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#667eea',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '2px',
            }}
          >
            TESTIMONIALS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              color: '#0f172a',
              mt: 1,
              mb: 2,
            }}
          >
            What People
            <span style={{ color: '#667eea' }}> Say About Us</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#64748b',
              maxWidth: '700px',
              margin: '0 auto',
              fontWeight: 400,
            }}
          >
            Hear from parents and students about their experiences
          </Typography>
        </Box>

        {/* Carousel */}
        <Box sx={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          {/* Main Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: '30px',
              bgcolor: 'white',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'visible',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15)',
            }}
          >
            {/* Quote Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: { xs: '50%', sm: 60 },
                transform: { xs: 'translateX(50%)', sm: 'none' },
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}
            >
              <QuoteIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>

            <CardContent sx={{ p: { xs: 4, sm: 6, md: 8 } }}>
              {/* Rating */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Rating value={currentTestimonial.rating} readOnly size="large" />
              </Box>

              {/* Testimonial Text */}
              <Typography
                variant="h6"
                sx={{
                  color: '#334155',
                  lineHeight: 1.8,
                  mb: 4,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 400,
                }}
              >
                "{currentTestimonial.text}"
              </Typography>

              {/* Author Info */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  mt: 4,
                }}
              >
                <Avatar
                  src={currentTestimonial.image}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '4px solid #e0e7ff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {currentTestimonial.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      mt: 0.5,
                    }}
                  >
                    {currentTestimonial.role}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                bgcolor: 'white',
                border: '2px solid #e2e8f0',
                width: 50,
                height: 50,
                '&:hover': {
                  bgcolor: '#667eea',
                  borderColor: '#667eea',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: 'white',
                border: '2px solid #e2e8f0',
                width: 50,
                height: 50,
                '&:hover': {
                  bgcolor: '#667eea',
                  borderColor: '#667eea',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Dots Indicator */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
              mt: 3,
            }}
          >
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: currentIndex === index ? 40 : 10,
                  height: 10,
                  borderRadius: '5px',
                  bgcolor: currentIndex === index ? '#667eea' : '#e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: currentIndex === index ? '#667eea' : '#cbd5e1',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Trust Indicators */}
        <Box
          sx={{
            mt: 10,
            textAlign: 'center',
            p: { xs: 3, md: 4 },
            bgcolor: 'white',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 3 }}>
            Trusted by 1000+ Happy Families
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 3, md: 6 },
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#667eea' }}>
                98%
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                Parent Satisfaction
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#10b981' }}>
                4.9/5
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                Average Rating
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#f59e0b' }}>
                30+
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                Years of Trust
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
