

import React from 'react';

interface IconButtonProps {
  /** Function to call when the button is clicked. */
  onClick: () => void;
  /** The content of the button, typically an SVG icon. */
  children: React.ReactNode;
  /** A descriptive label for accessibility (aria-label) and tooltips (title). */
  label: string;
}

/**
 * A reusable, accessible icon button component with consistent styling.
 * It provides a tooltip and an ARIA label for screen readers.
 */
const IconButton: React.FC<IconButtonProps> = ({ onClick, children, label }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-10 h-10 rounded-md bg-space-light hover:bg-space-mid transition-colors duration-200 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan flex items-center justify-center"
    >
      {children}
    </button>
  );
};

export default IconButton;