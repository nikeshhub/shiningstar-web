import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, Dialog, IconButton, Chip } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const galleryImages = [
  {
    id: 1,
    title: 'School Campus',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    category: 'Campus',
  },
  {
    id: 2,
    title: 'Science Laboratory',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    category: 'Facilities',
  },
  {
    id: 3,
    title: 'Classroom Learning',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    category: 'Academics',
  },
  {
    id: 4,
    title: 'Sports Day',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
    category: 'Sports',
  },
  {
    id: 5,
    title: 'Computer Lab',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800',
    category: 'Facilities',
  },
  {
    id: 6,
    title: 'Library',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
    category: 'Facilities',
  },
  {
    id: 7,
    title: 'Cultural Program',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
    category: 'Events',
  },
  {
    id: 8,
    title: 'Art Class',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    category: 'Activities',
  },
  {
    id: 9,
    title: 'Music Room',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    category: 'Activities',
  },
  {
    id: 10,
    title: 'Students Assembly',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    category: 'Events',
  },
  {
    id: 11,
    title: 'Playground',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
    category: 'Sports',
  },
  {
    id: 12,
    title: 'Achievement Ceremony',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    category: 'Events',
  },
];

const categories = ['All', 'Campus', 'Facilities', 'Academics', 'Sports', 'Events', 'Activities'];

export default function ModernGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <Box
      id="gallery"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(30deg, #667eea 12%, transparent 12.5%, transparent 87%, #667eea 87.5%, #667eea),
            linear-gradient(150deg, #667eea 12%, transparent 12.5%, transparent 87%, #667eea 87.5%, #667eea)
          `,
          backgroundSize: '80px 80px',
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
            GALLERY
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              color: 'white',
              mt: 1,
              mb: 2,
            }}
          >
            Life at
            <span style={{ color: '#667eea' }}> Shining Star</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '700px',
              margin: '0 auto',
              fontWeight: 400,
              mb: 4,
            }}
          >
            Explore moments of learning, growth, and celebration
          </Typography>

          {/* Category Filters */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  bgcolor: selectedCategory === category
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  py: 2.5,
                  fontSize: '0.95rem',
                  border: selectedCategory === category
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: selectedCategory === category
                      ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      : 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                  ...(selectedCategory === category && {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }),
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Gallery Grid */}
        <Grid container spacing={2}>
          {filteredImages.map((image, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={image.id}
              sx={{
                animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(30px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Card
                onClick={() => setSelectedImage(image)}
                sx={{
                  height: 300,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                    '& .image': {
                      transform: 'scale(1.2)',
                    },
                    '& .overlay': {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardMedia
                  className="image"
                  component="img"
                  height="300"
                  image={image.image}
                  alt={image.title}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    padding: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1, textAlign: 'center' }}>
                    {image.title}
                  </Typography>
                  <Chip
                    label={image.category}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Lightbox Dialog */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: -50,
              right: 0,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Box>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                style={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                }}
              />
              <Box
                sx={{
                  bgcolor: 'white',
                  p: 2,
                  borderRadius: '0 0 12px 12px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedImage.title}
                </Typography>
                <Chip label={selectedImage.category} size="small" sx={{ mt: 1 }} />
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
