import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  description?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function ProgressBar({
  label,
  value,
  max = 100,
  description,
  showPercentage = true,
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'default';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  const currentVariant = getVariant();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {showPercentage && (
          <span className="text-sm font-semibold text-muted-foreground">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            variantClasses[currentVariant]
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
