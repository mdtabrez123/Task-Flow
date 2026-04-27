import React from 'react';
import { Button } from './ui/button.jsx';

/**
 * A reusable primary button
 */
const PrimaryButton = ({ type = 'submit', children, onClick, className = '', disabled }) => (
  <Button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full ${className}`}
  >
    {children}
  </Button>
);

export default PrimaryButton;