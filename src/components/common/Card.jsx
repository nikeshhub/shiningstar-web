import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Divider } from '@mui/material';

/**
 * Reusable Card Component
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.subheader - Card subheader
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Card actions (buttons, etc.)
 * @param {boolean} props.elevation - Card elevation (0-24)
 * @param {object} props.sx - Additional styling
 */
const Card = ({
  title,
  subheader,
  children,
  actions,
  elevation = 1,
  sx = {},
  contentSx = {},
  ...otherProps
}) => {
  return (
    <MuiCard elevation={elevation} sx={sx} {...otherProps}>
      {(title || subheader) && (
        <>
          <CardHeader title={title} subheader={subheader} />
          <Divider />
        </>
      )}
      <CardContent sx={contentSx}>
        {children}
      </CardContent>
      {actions && (
        <>
          <Divider />
          <CardActions>
            {actions}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
};

export default Card;
