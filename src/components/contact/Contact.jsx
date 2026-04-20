import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, Paper } from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Button } from '../common';

const contactInfo = [
  {
    icon: <LocationIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Address',
    details: ['Yangwarak-4, Tharpu', 'Panchthar, Nepal'],
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Phone',
    details: ['+977 9815989236', '+977 9841234567'],
  },
  {
    icon: <EmailIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Email',
    details: ['info@shiningstar.edu.np', 'admin@shiningstar.edu.np'],
  },
  {
    icon: <ScheduleIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Office Hours',
    details: ['Sunday - Friday: 7:00 AM - 4:00 PM', 'Saturday: Closed'],
  },
];

export default function Contact() {
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

    // Simulate form submission
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
          Contact Us
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Get in touch with us for admissions and inquiries
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Information */}
          {contactInfo.map((info, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {info.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {info.title}
                </Typography>
                {info.details.map((detail, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary">
                    {detail}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          ))}

          {/* Contact Form */}
          <Grid size={12}>
            <Paper sx={{ p: 4, mt: 2 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Send us a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
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
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      rows={5}
                      required
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={loading}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Google Maps Embed */}
          <Grid size={12}>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Find Us on Map
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <iframe
                  title="School Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.52339194427!2d87.82934705!3d27.0167395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e8a4d10f8b5c93%3A0x6c8a9c8f5c8a9c8f!2sPanchthar!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
