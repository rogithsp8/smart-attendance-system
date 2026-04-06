import React from 'react';

type StatusVariant =
  | 'present'
  | 'absent'
  | 'late'
  | 'active'
  | 'passive'
  | 'normal'
  | 'at-risk'
  | 'pending'
  | 'completed';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
}

const statusConfig: Record<StatusVariant, { bg: string; text: string; label: string }> = {
  present: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Present',
  },
  absent: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'Absent',
  },
  late: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    label: 'Late',
  },
  active: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'Active',
  },
  passive: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: 'Passive',
  },
  normal: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Normal',
  },
  'at-risk': {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'At Risk',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    label: 'Pending',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Completed',
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  // Normalize the status value to ensure it matches a valid key
  const normalizedStatus = (status as string)?.toLowerCase() as StatusVariant;
  const config = statusConfig[normalizedStatus];

  // Fallback if status is not recognized
  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700">
        {label || 'Unknown'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {label || config.label}
    </span>
  );
}
