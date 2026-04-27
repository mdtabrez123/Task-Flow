import React from 'react';
import { Input } from './ui/input.jsx';

/**
 * A reusable input field component
 */
const FormInput = ({ id, label, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="eyebrow block pb-2">
      {label}
    </label>
    <Input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
    />
  </div>
);

export default FormInput;