import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import {
  LocalLibrary as LibraryIcon,
  Science as ScienceIcon,
  SportsSoccer as SportsIcon,
  Computer as ComputerIcon,
  Palette as ArtIcon,
  NaturePeople as NatureIcon,
  MusicNote as MusicIcon,
  Restaurant as CafeteriaIcon,
  EmojiPeople as FriendlyIcon,
} from '@mui/icons-material';

const facilities = [
  {
    icon: <LibraryIcon sx={{ fontSize: 50 }} />,
    title: 'Well-Stocked Library',
    description: 'Over 5000 books covering diverse subjects, novels, and digital resources for comprehensive learning.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 50 }} />,
    title: 'Advanced Science Labs',
    description: 'State-of-the-art physics, chemistry, and biology labs with modern equipment for hands-on experiments.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: <SportsIcon sx={{ fontSize: 50 }} />,
    title: 'Sports Complex',
    description: 'Multi-purpose sports ground, basketball court, and indoor facilities for various sports activities.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <ComputerIcon sx={{ fontSize: 50 }} />,
    title: 'Computer Laboratory',
    description: '50+ modern computers with high-speed internet, teaching coding and digital literacy.',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    icon: <ArtIcon sx={{ fontSize: 50 }} />,
    title: 'Art & Craft Studio',
    description: 'Dedicated space for creative expression through painting, sculpture, and various art forms.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: <NatureIcon sx={{ fontSize: 50 }} />,
    title: 'Outdoor Learning',
    description: 'Beautiful garden and outdoor classroom for nature-based education and environmental studies.',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  },
  {
    icon: <MusicIcon sx={{ fontSize: 50 }} />,
    title: 'Music & Dance Room',
    description: 'Soundproof music room with instruments for developing artistic talents and cultural programs.',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    icon: <CafeteriaIcon sx={{ fontSize: 50 }} />,
    title: 'Hygienic Cafeteria',
    description: 'Clean and spacious cafeteria serving nutritious meals and snacks in a pleasant environment.',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
  {
    icon: <FriendlyIcon sx={{ fontSize: 50 }} />,
    title: 'Safe Environment',
    description: 'CCTV monitored campus with friendly staff ensuring a secure and nurturing learning atmosphere.',
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  },
];

export default function ModernFacilities() {
  return (
    <Box
      id="facilities"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'white',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
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
            OUR FACILITIES
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
            World-Class
            <span style={{ color: '#667eea' }}> Infrastructure</span>
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
            Modern facilities designed to provide the best learning environment
            for our students
          </Typography>
        </Box>

        {/* Facilities Grid */}
        <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {facilities.map((facility, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={index} sx={{ display: 'flex' }}>
                <Card
                  elevation={0}
                  sx={{
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '400px', md: '420px' },
                    height: '360px',
                    borderRadius: '24px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 24px 48px rgba(102, 126, 234, 0.15)',
                      borderColor: 'transparent',
                      '& .facility-icon-box': {
                        background: facility.gradient,
                        transform: 'rotate(10deg) scale(1.1)',
                      },
                      '& .facility-icon': {
                        color: 'white',
                        transform: 'scale(1.2)',
                      },
                    },
                  }}
                >
                <Box
                  sx={{
                    height: '8px',
                    background: facility.gradient,
                  }}
                />
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Box
                    className="facility-icon-box"
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: '20px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      transition: 'all 0.4s ease',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      className="facility-icon"
                      sx={{
                        color: '#667eea',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {facility.icon}
                    </Box>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                      mb: 2,
                      fontSize: '1.4rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {facility.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      lineHeight: 1.7,
                      fontSize: '0.98rem',
                      flex: 1,
                    }}
                  >
                    {facility.description}
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
