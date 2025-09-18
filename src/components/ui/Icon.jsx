import React from 'react';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name, className, ...props }) => {
  const IconComponent = LucideIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent className={className} {...props} />;
};

export default Icon;