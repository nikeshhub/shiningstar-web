import { Box, Typography, Button, Container, Grid } from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  PlayCircle as PlayCircleIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

export default function ModernHero() {
  const stats = [
    { icon: <SchoolIcon />, number: "30+", label: "Years of Excellence" },
    { icon: <PeopleIcon />, number: "1000+", label: "Happy Students" },
    { icon: <TrophyIcon />, number: "50+", label: "Awards Won" },
  ];

  return (
    <Box
      id="home"
      sx={{
        minHeight: "100vh",
        position: "relative",
        background:
          "linear-gradient(135deg, #0a1929 0%, #1a237e 50%, #0d47a1 100%)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        pt: { xs: 12, md: 10 },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.1,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.3) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating Circles */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
          filter: "blur(60px)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-30px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(118, 75, 162, 0.2) 0%, rgba(102, 126, 234, 0.2) 100%)",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 1 }}>
            {/* Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                px: 3,
                py: 1,
                borderRadius: "50px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#4ade80",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: "white", fontWeight: 600 }}
              >
                Admissions Open for 2082
              </Typography>
            </Box>

            {/* Main Heading */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                mb: 2,
                background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Shaping
              <br />
              Tomorrow's
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Leaders
              </span>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 4,
                maxWidth: "600px",
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              Providing world-class education for over 30 years in the heart of
              Panchthar. Excellence in academics, character, and innovation.
            </Typography>

            {/* CTA Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 6 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: "50px",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    boxShadow: "0 15px 40px rgba(102, 126, 234, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Apply Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayCircleIcon />}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: "50px",
                  backdropFilter: "blur(10px)",
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Watch Video
              </Button>
            </Box>

            {/* Stats */}
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {stats.map((stat, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#667eea",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "white", fontWeight: 800 }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 2 }}>
            {/* Hero Image/Illustration */}
            <Box
              sx={{
                position: "relative",
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "500px",
                  borderRadius: "30px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                  border: "3px solid rgba(255, 255, 255, 0.1)",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
                    zIndex: 1,
                  },
                }}
              >
                <img
                  src="https://res.cloudinary.com/duaz5kg1m/image/upload/v1685864808/school_jwqrdl.jpg"
                  alt="Shining Star School"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Floating Card */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  bgcolor: "white",
                  p: 3,
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                  minWidth: 200,
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#1976d2", mb: 0.5 }}
                >
                  95%
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Success Rate in SEE
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Animated Wave Divider */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        {/* Wave 1 - Main Wave */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            height: 80,
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
          sx={{
            animation: "wave 8s linear infinite",
            "@keyframes wave": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
          }}
        >
          <defs>
            <pattern
              id="wave-pattern"
              x="0"
              y="0"
              width="2400"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 T1500,60 T1800,60 T2100,60 T2400,60 V120 H0 V60 Z"
                fill="rgba(255, 255, 255, 0.15)"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="2400"
            height="120"
            fill="url(#wave-pattern)"
            style={{
              animation: "wave 15s linear infinite",
            }}
          />
        </svg>

        {/* Wave 2 - Secondary Wave */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            height: 80,
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        >
          <defs>
            <pattern
              id="wave-pattern-2"
              x="0"
              y="0"
              width="2400"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,70 Q200,30 400,70 T800,70 T1200,70 T1600,70 T2000,70 T2400,70 V120 H0 V70 Z"
                fill="rgba(255, 255, 255, 0.1)"
              />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="2400"
            height="120"
            fill="url(#wave-pattern-2)"
            style={{
              animation: "wave-reverse 12s linear infinite",
            }}
          />
        </svg>

        {/* Wave 3 - Solid Wave */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            height: 80,
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#ffffff"
            style={{
              animation: "wave-subtle 10s ease-in-out infinite",
            }}
          />
        </svg>
      </Box>

      {/* CSS Keyframes for Wave Animations */}
      <style>
        {`
          @keyframes wave {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes wave-reverse {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }

          @keyframes wave-subtle {
            0%, 100% {
              transform: translateY(0) scaleY(1);
            }
            50% {
              transform: translateY(-5px) scaleY(1.05);
            }
          }
        `}
      </style>
    </Box>
  );
}
