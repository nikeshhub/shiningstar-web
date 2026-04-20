import React from 'react';
import { Box, Typography, Container, Grid, IconButton, Divider, Link } from '@mui/material';
import {
  School as SchoolIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowUpward as ArrowUpIcon,
} from '@mui/icons-material';
import { getCurrentBSDateParts } from '../../utils/nepaliDate';

const currentBSYear = getCurrentBSDateParts()?.year || '';

export default function ModernFooter() {
  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  const programs = [
    'Pre-Primary Education',
    'Primary Education',
    'Secondary Education',
    'SEE Preparation',
    'Sports Program',
    'Arts & Music',
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        bgcolor: '#0f172a',
        color: 'white',
        pt: 8,
        pb: 4,
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
          opacity: 0.03,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <SchoolIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    Shining Star
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    ENGLISH SCHOOL
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                Providing quality education for over 30 years, nurturing young minds to become
                tomorrow's leaders. Excellence in academics, character, and innovation.
              </Typography>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[FacebookIcon, TwitterIcon, InstagramIcon, YouTubeIcon].map((Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 1)',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '3px',
                },
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#667eea',
                      pl: 1,
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Programs */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '3px',
                },
              }}
            >
              Programs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {programs.map((program, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  {program}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '3px',
                },
              }}
            >
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <LocationIcon sx={{ color: '#667eea', fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Yangwarak-4, Tharpu<br />
                  Panchthar, Nepal
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <PhoneIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +977 9815989236
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <EmailIcon sx={{ color: '#667eea', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  info@shiningstar.edu.np
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            © {currentBSYear} Shining Star English School. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#667eea',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#667eea',
                },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Scroll to Top Button */}
      <IconButton
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          width: 50,
          height: 50,
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
          },
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
      >
        <ArrowUpIcon />
      </IconButton>
    </Box>
  );
}
