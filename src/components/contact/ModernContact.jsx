import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, TextField, InputAdornment } from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';
import { Button } from '../common';

const contactInfo = [
  {
    icon: <LocationIcon />,
    title: 'Visit Us',
    details: ['Yangwarak-4, Tharpu', 'Panchthar, Nepal'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: <PhoneIcon />,
    title: 'Call Us',
    details: ['+977 9815989236', '+977 9841234567'],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: <EmailIcon />,
    title: 'Email Us',
    details: ['info@shiningstar.edu.np', 'admin@shiningstar.edu.np'],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <ScheduleIcon />,
    title: 'Office Hours',
    details: ['Sun - Fri: 7:00 AM - 4:00 PM', 'Saturday: Closed'],
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
];

export default function ModernContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{
              color: '#667eea',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '2px',
            }}
          >
            GET IN TOUCH
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
            Contact
            <span style={{ color: '#667eea' }}> Us</span>
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
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    borderColor: 'transparent',
                    '& .contact-icon': {
                      background: info.gradient,
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  },
                }}
              >
                <Box
                  className="contact-icon"
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '16px',
                    background: `${info.gradient.split(',')[0]}, ${info.gradient.split(',')[1]})20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#667eea',
                    margin: '0 auto',
                    mb: 2,
                    fontSize: 35,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {info.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700, color: '#0f172a' }}>
                  {info.title}
                </Typography>
                {info.details.map((detail, idx) => (
                  <Typography key={idx} variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                    {detail}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          ))}

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              }}
            >
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, color: '#0f172a' }}>
                Send us a Message
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: '#64748b' }}>
                Fill out the form below and we'll get back to you within 24 hours
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SubjectIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      rows={5}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                            <MessageIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      type="submit"
                      size="large"
                      fullWidth
                      loading={loading}
                      endIcon={<SendIcon />}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Map */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                minHeight: 400,
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
              }}
            >
              <iframe
                title="School Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.52339194427!2d87.82934705!3d27.0167395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e8a4d10f8b5c93%3A0x6c8a9c8f5c8a9c8f!2sPanchthar!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen=""
                loading="lazy"
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
