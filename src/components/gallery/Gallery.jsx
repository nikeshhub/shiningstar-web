import React from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';

const galleryImages = [
  {
    id: 1,
    title: 'Our Campus',
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
    title: 'Students in Classroom',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    category: 'Academics',
  },
  {
    id: 4,
    title: 'Sports Activities',
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
    title: 'Annual Function',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
    category: 'Events',
  },
  {
    id: 8,
    title: 'Art & Craft',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    category: 'Activities',
  },
];

export default function Gallery() {
  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        bgcolor: '#f5f5f5',
      }}
    >
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 1,
            fontWeight: 'bold',
            color: '#1976d2',
          }}
        >
          Gallery
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Glimpses of our vibrant school life
        </Typography>

        <Grid container spacing={3}>
          {galleryImages.map((image) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
              <Card
                sx={{
                  height: 250,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                  '&:hover .overlay': {
                    opacity: 1,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={image.image}
                  alt={image.title}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(25, 118, 210, 0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                    {image.title}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {image.category}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
