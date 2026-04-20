import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Rating } from '@mui/material';
import { FormatQuote as QuoteIcon } from '@mui/icons-material';

const testimonials = [
  {
    id: 1,
    name: 'Ramesh Thapa',
    role: 'Parent of Class 8 Student',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'Shining Star has been instrumental in shaping my daughter\'s academic and personal growth. The teachers are dedicated and the infrastructure is excellent. Highly recommended!',
  },
  {
    id: 2,
    name: 'Anita Sharma',
    role: 'Parent of Class 5 Student',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: 'The school provides a perfect balance of academics and extracurricular activities. My son loves going to school every day. The staff is caring and professional.',
  },
  {
    id: 3,
    name: 'Bikash Rai',
    role: 'Former Student (SEE Graduate)',
    image: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    text: 'I spent 10 wonderful years at Shining Star. The quality of education and values I learned here have been invaluable. Secured 95% in SEE thanks to excellent guidance!',
  },
  {
    id: 4,
    name: 'Sita Gurung',
    role: 'Parent of Pre-Primary Student',
    image: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    text: 'As a parent of a nursery student, I am impressed with how the teachers handle young children with care and patience. The play-based learning approach is fantastic.',
  },
  {
    id: 5,
    name: 'Krishna Limbu',
    role: 'Parent of Class 10 Student',
    image: 'https://i.pravatar.cc/150?img=13',
    rating: 5,
    text: 'Excellent SEE preparation with regular mock tests and personalized attention. The career counseling sessions have been very helpful for my son\'s future planning.',
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

export default function ModernTestimonials() {
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
        <Box sx={{ textAlign: 'center', mb: 8 }}>
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
            Hear from parents and students about their experiences at Shining Star
          </Typography>
        </Box>

        {/* Testimonials Grid */}
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={testimonial.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: '24px',
                  bgcolor: 'white',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                  },
                }}
              >
                {/* Quote Icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: 30,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <QuoteIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>

                <CardContent sx={{ p: 4 }}>
                  {/* Rating */}
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />

                  {/* Testimonial Text */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#334155',
                      lineHeight: 1.8,
                      mb: 3,
                      fontStyle: 'italic',
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>

                  {/* Author Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                    <Avatar
                      src={testimonial.image}
                      sx={{
                        width: 60,
                        height: 60,
                        border: '3px solid #e0e7ff',
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#0f172a',
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Trust Indicators */}
        <Box
          sx={{
            mt: 10,
            textAlign: 'center',
            p: 4,
            bgcolor: 'white',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
            Trusted by 1000+ Happy Families
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#667eea' }}>
                98%
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Parent Satisfaction
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#10b981' }}>
                4.9/5
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Average Rating
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#f59e0b' }}>
                30+
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Years of Trust
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
