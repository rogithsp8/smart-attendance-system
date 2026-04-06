import React from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  children,
  footer,
}: ChartCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="w-full overflow-auto">
        {children}
      </div>
      {footer && (
        <div className="mt-4 border-t border-border pt-4">
          {footer}
        </div>
      )}
    </div>
  );
}
