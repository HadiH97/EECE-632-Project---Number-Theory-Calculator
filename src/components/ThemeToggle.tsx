import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center justify-center rounded-full transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-900"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`absolute inset-0 flex items-center px-2 transition-transform duration-200 ease-in-out
                   ${theme === 'dark' ? 'justify-end' : 'justify-start'}`}
      >
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-indigo-200" />
        ) : (
          <Sun className="h-5 w-5 text-indigo-600" />
        )}
      </span>
    </button>
  );
};