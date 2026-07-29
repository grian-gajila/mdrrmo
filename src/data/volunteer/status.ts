import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const statusConfig = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    class: 'bg-amber-100 text-amber-700 border border-amber-200',

    iconClass: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  under_review: {
    label: 'Under Review',
    icon: AlertCircle,
    class: 'bg-blue-100 text-blue-700 border border-blue-200',
    iconClass: 'text-blue-600',
    dot: 'bg-blue-500',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    class: 'bg-green-100 text-green-700 border border-green-200',
    iconClass: 'text-green-600',
    dot: 'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    class: 'bg-red-100 text-red-700 border border-red-200',
    iconClass: 'text-red-600',
    dot: 'bg-red-500',
  },
};
