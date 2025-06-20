import React from 'react';
import './Button.scss';

export default function Button({ onClick, children, className = '' }) {
  return (
    <button onClick={onClick} className={`control-button ${className}`}>
      {children}
    </button>
  );
}
