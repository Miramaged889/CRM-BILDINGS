import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  animate = true,
  ...props 
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-800 
    rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
    transition-all duration-200
    hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`${baseClasses} ${padding} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;