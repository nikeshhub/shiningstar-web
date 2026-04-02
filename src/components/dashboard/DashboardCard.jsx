import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

/**
 * Dashboard Card Component
 * A reusable card with optional header and hover effects
 *
 * @param {string} title - Card title
 * @param {React.ReactNode} action - Action element (button/link) in header
 * @param {React.ReactNode} children - Card content
 * @param {boolean} hover - Enable hover effect (default: true)
 * @param {boolean} noPadding - Remove padding from content (for tables)
 * @param {string} className - Additional CSS classes
 */
const DashboardCard = ({
  title,
  action,
  children,
  hover = true,
  noPadding = false,
  className = '',
  ...props
}) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-150 ${
        hover ? 'hover:-translate-y-0.5 hover:shadow-card-hover' : ''
      } ${className}`}
      sx={{
        '&::before': hover ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgcolor: 'primary.main',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease',
        } : {},
        '&:hover::before': hover ? {
          transform: 'scaleX(1)',
        } : {},
      }}
      {...props}
    >
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          {action && (
            <Box
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              {action}
            </Box>
          )}
        </Box>
      )}
      <CardContent
        sx={{
          p: noPadding ? 0 : 2.5,
          '&:last-child': {
            pb: noPadding ? 0 : 2.5,
          },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
