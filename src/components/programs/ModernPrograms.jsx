import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Tabs, Tab, Chip } from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  SportsSoccer as SportsIcon,
  MusicNote as MusicIcon,
  Computer as ComputerIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

const programs = [
  {
    category: 'Pre-Primary',
    icon: <SchoolIcon sx={{ fontSize: 50 }} />,
    levels: 'Nursery, LKG, UKG',
    ageGroup: '3-5 years',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Laying the foundation for lifelong learning through play-based education and creative activities.',
    highlights: [
      'Play-based Learning',
      'Motor Skills Development',
      'Social & Emotional Growth',
      'Creative Expression',
      'Basic Numeracy & Literacy',
      'Music & Movement',
    ],
  },
  {
    category: 'Primary',
    icon: <BookIcon sx={{ fontSize: 50 }} />,
    levels: 'Class 1-5',
    ageGroup: '6-10 years',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'Building strong academic foundation with focus on core subjects and character development.',
    highlights: [
      'English & Nepali Language',
      'Mathematics & Science',
      'Social Studies',
      'Computer Education',
      'Moral Education',
      'Physical Education',
    ],
  },
  {
    category: 'Secondary',
    icon: <ScienceIcon sx={{ fontSize: 50 }} />,
    levels: 'Class 6-10',
    ageGroup: '11-15 years',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: 'Comprehensive education preparing students for SEE and higher academic pursuits.',
    highlights: [
      'SEE Board Preparation',
      'Advanced Mathematics',
      'Physics, Chemistry, Biology',
      'Optional Mathematics',
      'Account & Economics',
      'Career Counseling',
    ],
  },
  {
    category: 'Sports',
    icon: <SportsIcon sx={{ fontSize: 50 }} />,
    levels: 'All Levels',
    ageGroup: 'All Ages',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    description: 'Comprehensive sports training developing physical fitness, teamwork, and sportsmanship.',
    highlights: [
      'Football & Basketball',
      'Cricket & Volleyball',
      'Athletics & Track Events',
      'Yoga & Fitness',
      'Inter-School Competitions',
      'Annual Sports Day',
    ],
  },
  {
    category: 'Arts & Music',
    icon: <MusicIcon sx={{ fontSize: 50 }} />,
    levels: 'All Levels',
    ageGroup: 'All Ages',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    description: 'Nurturing creativity and artistic expression through music, dance, and visual arts.',
    highlights: [
      'Classical & Modern Music',
      'Traditional Dance Forms',
      'Painting & Drawing',
      'Sculpture & Crafts',
      'Drama & Theatre',
      'Annual Cultural Program',
    ],
  },
  {
    category: 'Technology',
    icon: <ComputerIcon sx={{ fontSize: 50 }} />,
    levels: 'All Levels',
    ageGroup: 'All Ages',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    description: 'Modern technology education preparing students for the digital age.',
    highlights: [
      'MS Office Suite',
      'Programming Basics',
      'Web Development Intro',
      'Digital Literacy',
      'Internet Safety',
      'Multimedia Creation',
    ],
  },
];

export default function ModernPrograms() {
  const [selectedTab, setSelectedTab] = useState(0);

  const categories = ['All', 'Academic', 'Co-Curricular'];

  const getFilteredPrograms = () => {
    if (selectedTab === 0) return programs;
    if (selectedTab === 1) return programs.filter((p, i) => i < 3);
    return programs.filter((p, i) => i >= 3);
  };

  return (
    <Box
      id="programs"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          filter: 'blur(60px)',
        }}
      />

      <Container maxWidth="lg">
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
            OUR PROGRAMS
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
            Comprehensive
            <span style={{ color: '#667eea' }}> Education</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#64748b',
              maxWidth: '700px',
              margin: '0 auto',
              fontWeight: 400,
              mb: 4,
            }}
          >
            From academics to arts, sports to technology - we offer a complete
            educational experience
          </Typography>

          {/* Category Tabs */}
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 120,
              },
              '& .Mui-selected': {
                color: '#667eea !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea',
                height: 3,
                borderRadius: '3px',
              },
            }}
          >
            {categories.map((category, index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>
        </Box>

        {/* Programs Grid */}
        <Grid container spacing={4}>
          {getFilteredPrograms().map((program, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: '24px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    borderColor: 'transparent',
                    '& .program-header': {
                      background: program.gradient,
                    },
                    '& .program-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  },
                }}
              >
                {/* Header with Gradient */}
                <Box
                  className="program-header"
                  sx={{
                    background: `${program.gradient.split(',')[0]}, ${program.gradient.split(',')[1]})20`,
                    p: 4,
                    transition: 'all 0.4s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box
                      className="program-icon"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#667eea',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {program.icon}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={program.levels}
                        sx={{
                          bgcolor: 'white',
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                        {program.ageGroup}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: '#0f172a',
                      mt: 3,
                    }}
                  >
                    {program.category}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      lineHeight: 1.8,
                      mb: 3,
                    }}
                  >
                    {program.description}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                      mb: 2,
                    }}
                  >
                    Program Highlights:
                  </Typography>

                  <Grid container spacing={1.5}>
                    {program.highlights.map((highlight, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckIcon sx={{ fontSize: 18, color: '#10b981' }} />
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {highlight}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
