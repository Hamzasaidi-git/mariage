import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({
  rating = 0,
  maxStars = 5,
  interactive = false,
  size = 'md',
  onChange = () => {},
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleClick = (value) => {
    if (interactive) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getStarClasses = (index) => {
    const starValue = index + 1;
    const currentRating = interactive && hoverRating > 0 ? hoverRating : rating;
    
    let classes = `${sizeClasses[size]} transition-all duration-200`;
    
    if (starValue <= currentRating) {
      classes += ' text-yellow-400 fill-current';
    } else {
      classes += ' text-gray-300';
    }

    if (interactive) {
      classes += ' cursor-pointer hover:scale-110';
    }

    return classes;
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(maxStars)].map((_, index) => (
        <FiStar
          key={index}
          className={getStarClasses(index)}
          onClick={() => handleClick(index + 1)}
          onMouseEnter={() => handleMouseEnter(index + 1)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      {!interactive && (
        <span className="ml-2 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;