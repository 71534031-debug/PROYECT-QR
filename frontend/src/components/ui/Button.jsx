import React from 'react';
import { cn } from '../../lib/utils.js';

const variants = {
  default: 'bg-[#8B1A1A] text-white hover:bg-[#6B1010] shadow-sm',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  link: 'text-[#8B1A1A] underline-offset-4 hover:underline',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-xs',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export function buttonVariants({ variant = 'default', size = 'default', className = '' } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B1A1A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  );
}

export function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button';
  return <Comp className={buttonVariants({ variant, size, className })} {...props} />;
}
