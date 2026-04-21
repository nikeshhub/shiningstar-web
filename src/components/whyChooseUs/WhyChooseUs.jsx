import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import {
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  SportsSoccer as SportsIcon,
  Computer as ComputerIcon,
  LocalLibrary as LibraryIcon,
} from "@mui/icons-material";

const features = [
  {
    icon: <StarIcon sx={{ fontSize: 40 }} />,
    title: "Excellence in Education",
    description:
      "Over 30 years of proven track record in delivering quality education and outstanding results.",
    color: "#667eea",
  },
  {
    icon: <TrophyIcon sx={{ fontSize: 40 }} />,
    title: "Award-Winning School",
    description:
      "Recognized nationally for academic excellence, sports achievements, and cultural programs.",
    color: "#f59e0b",
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    title: "Experienced Faculty",
    description:
      "Dedicated and highly qualified teachers committed to nurturing young minds.",
    color: "#10b981",
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: "Holistic Development",
    description:
      "Focus on academic, physical, emotional, and social development of every student.",
    color: "#3b82f6",
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 40 }} />,
    title: "Modern Facilities",
    description:
      "Well-equipped science labs, computer labs, library, and smart classrooms.",
    color: "#8b5cf6",
  },
  {
    icon: <SportsIcon sx={{ fontSize: 40 }} />,
    title: "Sports & Activities",
    description:
      "Comprehensive sports programs and extracurricular activities for all-round growth.",
    color: "#ef4444",
  },
  {
    icon: <ComputerIcon sx={{ fontSize: 40 }} />,
    title: "Digital Learning",
    description:
      "Integration of technology in education with modern teaching methodologies.",
    color: "#06b6d4",
  },
  {
    icon: <LibraryIcon sx={{ fontSize: 40 }} />,
    title: "Rich Resources",
    description:
      "Extensive library with thousands of books and digital learning resources.",
    color: "#ec4899",
  },
];

export default function WhyChooseUs() {
  return (
    <Box
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        minHeight: "auto",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(30deg, #667eea 12%, transparent 12.5%, transparent 87%, #667eea 87.5%, #667eea),
            linear-gradient(150deg, #667eea 12%, transparent 12.5%, transparent 87%, #667eea 87.5%, #667eea)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{
              color: "#667eea",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              letterSpacing: "2px",
            }}
          >
            WHY CHOOSE US
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
              fontWeight: 800,
              color: "#0f172a",
              mt: 1,
              mb: 2,
            }}
          >
            What Makes Us
            <span style={{ color: "#667eea" }}> Special</span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              maxWidth: "700px",
              margin: "0 auto",
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.25rem" },
              px: { xs: 2, sm: 0 },
            }}
          >
            Discover why parents and students trust Shining Star English School
            for their educational journey
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
          >
            {features.map((feature, index) => (
              <Grid
                size={{ xs: 4, sm: 6, md: 4, lg: 4 }}
                key={index}
                sx={{ display: "flex" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "400px", md: "420px" },
                    height: "340px",
                    bgcolor: "white",
                    borderRadius: "24px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    margin: "0 auto",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(102, 126, 234, 0.15)",
                      borderColor: feature.color,
                      "& .feature-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                        bgcolor: feature.color,
                      },
                    },
                  }}
                >
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "18px",
                      bgcolor: `${feature.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: feature.color,
                      mb: 3,
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      mb: 2,
                      fontSize: "1.35rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#64748b",
                      lineHeight: 1.7,
                      fontSize: "0.98rem",
                      flex: 1,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: { xs: "20px", md: "30px" },
            p: { xs: 3, sm: 4, md: 6 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              filter: "blur(60px)",
            }}
          />
          <Grid
            container
            spacing={{ xs: 3, sm: 4 }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: "white",
                    mb: { xs: 0.5, md: 1 },
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  30+
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  }}
                >
                  Years of Excellence
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: "white",
                    mb: { xs: 0.5, md: 1 },
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  1000+
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  }}
                >
                  Students Enrolled
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: "white",
                    mb: { xs: 0.5, md: 1 },
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  95%
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  }}
                >
                  SEE Success Rate
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: "white",
                    mb: { xs: 0.5, md: 1 },
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  50+
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                  }}
                >
                  Expert Teachers
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
