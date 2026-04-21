import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

/**
 * Page Header Component
 * Page title with breadcrumbs and optional action button
 *
 * @param {string} title - Page title (supports <em> for italic blue words)
 * @param {Array} breadcrumbs - Array of breadcrumb objects: [{ label, href }]
 * @param {React.ReactNode} action - Action button/element
 */
const PageHeader = ({ title, breadcrumbs = [], action, ...props }) => {
  // Parse title to handle <em> tags for italic blue text
  const renderTitle = () => {
    if (typeof title === 'string' && title.includes('<em>')) {
      const parts = title.split(/<em>|<\/em>/);
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          // This is the content inside <em> tags
          return (
            <Box
              key={index}
              component="em"
              sx={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'primary.main',
              }}
            >
              {part}
            </Box>
          );
        }
        return part;
      });
    }
    return title;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}
      {...props}
    >
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{
              mb: 0.5,
              '& .MuiBreadcrumbs-separator': {
                mx: 0.5,
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                href={crumb.href}
                underline="hover"
                sx={{
                  fontSize: '12px',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Fraunces, serif',
            fontSize: '20px',
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          {renderTitle()}
        </Typography>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;
