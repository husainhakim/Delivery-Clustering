import React from 'react';

export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-blue-900/50 text-blue-300 border-blue-700',
    success: 'bg-green-900/50 text-green-300 border-green-700',
    warning: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    danger: 'bg-red-900/50 text-red-300 border-red-700',
    outline: 'bg-transparent text-gray-300 border-gray-600',
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${selectedVariant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
