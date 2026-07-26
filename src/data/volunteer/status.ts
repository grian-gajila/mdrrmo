import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export const statusConfig = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    class: 'bg-amber-50 border-amber-200 text-amber-700',
    iconClass: 'text-amber-600',
  },
  under_review: {
    label: 'Under Review',
    icon: AlertCircle,
    class: 'bg-blue-50 border-blue-200 text-blue-700',
    iconClass: 'text-blue-600',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    class: 'bg-green-50 border-green-200 text-green-700',
    iconClass: 'text-green-600',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    class: 'bg-red-50 border-red-200 text-red-700',
    iconClass: 'text-red-600',
  },
};
