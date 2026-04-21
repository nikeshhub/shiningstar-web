import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

/**
 * Stat Card Component
 * Display key metrics with icon, value, and change indicator
 *
 * @param {string} label - Stat label (e.g., "Total Students")
 * @param {string|number} value - Main value to display
 * @param {React.ReactNode} icon - Icon component
 * @param {string} iconBg - Icon background color (default: 'primary.light')
 * @param {string} iconColor - Icon color (default: 'primary.main')
 * @param {number} change - Percentage change (positive/negative)
 * @param {string} emoji - Decorative emoji watermark (optional)
 */
const StatCard = ({
  label,
  value,
  icon,
  iconBg = 'primary.light',
  iconColor = 'primary.main',
  change,
  emoji,
  ...props
}) => {
  const isPositive = change >= 0;

  return (
    <Card
      className="relative overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card"
      {...props}
    >
      <CardContent sx={{ p: 2.5, position: 'relative' }}>
        {/* Emoji Watermark */}
        {emoji && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 12,
              fontSize: '64px',
              opacity: 0.08,
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            {emoji}
          </Box>
        )}

        {/* Label and Icon Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text.secondary',
            }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '7px',
              bgcolor: iconBg,
              color: iconColor,
              fontSize: '16px',
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Value */}
        <Typography
          sx={{
            fontFamily: 'Fraunces, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1,
            mb: 1,
          }}
        >
          {value}
        </Typography>

        {/* Change Indicator */}
        {change !== undefined && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '12px',
              fontWeight: 500,
              color: isPositive ? 'success.main' : 'error.main',
            }}
          >
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16 }} />
            )}
            <span>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <Typography
              component="span"
              sx={{
                fontSize: '11px',
                color: 'text.secondary',
                ml: 0.5,
              }}
            >
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
