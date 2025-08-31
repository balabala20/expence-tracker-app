import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const buttonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: 'var(--text-color)',
    padding: 0
  };

  return (
    <button onClick={toggleTheme} style={buttonStyle} aria-label="Toggle theme">
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggleButton;