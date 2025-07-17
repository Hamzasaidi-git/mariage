// Composant de chargement
import React from 'react';
import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = null,
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const SpinnerElement = (
    <div className={clsx(
      'flex flex-col items-center justify-center',
      overlay && 'min-h-screen',
      className
    )}>
      <div 
        className={clsx(
          'animate-spin rounded-full border-2 border-primary-200 border-t-primary-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-secondary-600">{text}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {SpinnerElement}
      </div>
    );
  }

  return SpinnerElement;
};

export default LoadingSpinner;