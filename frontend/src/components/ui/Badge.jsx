import React from 'react';
import { cn } from '../../lib/utils.js';

const badgeVariants = {
  default: 'bg-[#8B1A1A]/10 text-[#8B1A1A] border-[#8B1A1A]/20',
  secondary: 'bg-gray-100 text-gray-700 border-gray-200',
  destructive: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  outline: 'bg-transparent text-gray-700 border-gray-300',
};

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
