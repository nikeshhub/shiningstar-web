import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  School as SchoolIcon,
  Science as ScienceIcon,
  Sports as SportsIcon,
  MusicNote as MusicIcon,
  Palette as ArtIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';

const programs = [
  {
    id: 1,
    title: 'Pre-Primary (Nursery to KG)',
    icon: <SchoolIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
    description: 'Play-based learning with focus on motor skills, social development, and basic concepts.',
    highlights: ['Creative Play', 'Basic Literacy', 'Social Skills', 'Physical Development'],
  },
  {
    id: 2,
    title: 'Primary (Class 1-5)',
    icon: <SchoolIcon sx={{ fontSize: 50, color: '#2e7d32' }} />,
    description: 'Comprehensive curriculum covering all fundamental subjects with interactive teaching methods.',
    highlights: ['English & Nepali', 'Mathematics', 'Science & Social', 'Moral Education'],
  },
  {
    id: 3,
    title: 'Secondary (Class 6-10)',
    icon: <ScienceIcon sx={{ fontSize: 50, color: '#ed6c02' }} />,
    description: 'Advanced learning with practical approach, preparing students for higher education.',
    highlights: ['SEE Preparation', 'Laboratory Work', 'Project-Based Learning', 'Career Guidance'],
  },
  {
    id: 4,
    title: 'Sports Program',
    icon: <SportsIcon sx={{ fontSize: 50, color: '#d32f2f' }} />,
    description: 'Comprehensive sports training including football, basketball, volleyball, and athletics.',
    highlights: ['Daily PT', 'Inter-School Competitions', 'Sports Day', 'Yoga & Fitness'],
  },
  {
    id: 5,
    title: 'Arts & Music',
    icon: <MusicIcon sx={{ fontSize: 50, color: '#9c27b0' }} />,
    description: 'Nurturing creativity through music, dance, and visual arts education.',
    highlights: ['Classical Music', 'Traditional Dance', 'Painting & Drawing', 'Annual Cultural Show'],
  },
  {
    id: 6,
    title: 'Computer Education',
    icon: <ComputerIcon sx={{ fontSize: 50, color: '#0288d1' }} />,
    description: 'Modern computer lab with hands-on training in basic to advanced computer skills.',
    highlights: ['MS Office', 'Programming Basics', 'Internet Safety', 'Digital Literacy'],
  },
];

export default function Programs() {
  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        bgcolor: 'white',
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
          Our Programs
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Comprehensive education for holistic development
        </Typography>

        <Grid container spacing={4}>
          {programs.map((program) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={program.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {program.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 'bold' }}
                  >
                    {program.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {program.description}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      justifyContent: 'center',
                      mt: 2,
                    }}
                  >
                    {program.highlights.map((highlight, index) => (
                      <Box
                        key={index}
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: '#e3f2fd',
                          borderRadius: '16px',
                          fontSize: '0.875rem',
                          color: '#1976d2',
                        }}
                      >
                        {highlight}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
