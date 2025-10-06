import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = "", 
  showLabel = true,
  size = 'md'
}) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className={`theme-toggle ${className} theme-toggle--${size}`}>
      {showLabel && (
        <span className="theme-toggle__label">
          {isDark ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      )}
      
      <button
        onClick={toggleTheme}
        className={`theme-toggle__button ${isDark ? 'theme-toggle__button--dark' : 'theme-toggle__button--light'}`}
        title={`Cambiar a ${isDark ? 'modo claro' : 'modo oscuro'}`}
        aria-label={`Cambiar a ${isDark ? 'modo claro' : 'modo oscuro'}`}
      >
        <div className="theme-toggle__track">
          <div className="theme-toggle__thumb">
            <span className="theme-toggle__icon">
              {isDark ? '🌙' : '☀️'}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;
