import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  href,
  onClick,
  className = '',
  ...props
}) => {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      className={`btn btn--${variant} btn--${size} ${className}`}
      href={href}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
