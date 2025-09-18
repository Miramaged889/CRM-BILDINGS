import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`${iconSizes[size]} text-gray-400 dark:text-gray-600`} />
      )}
    </div>
  );
};

export default Avatar;