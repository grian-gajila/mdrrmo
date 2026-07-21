import { DocumentItem } from '@/types';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileIcon,
  FileText,
  IdCard,
  Stethoscope,
  User,
} from 'lucide-react';

export const documentTypes: DocumentItem[] = [
  {
    kind: 'sides',
    front: {
      key: 'validIdFrontUrl',
      uploadType: 'validIdFront',
      label: 'Front',
    },
    back: {
      key: 'validIdBackUrl',
      uploadType: 'validIdBack',
      label: 'Back',
    },
    label: 'Valid Government ID',
    desc: "National ID, Voter's ID, Driver's License, or Passport — front and back",
    icon: IdCard,
    required: true,
  },
  {
    kind: 'multiple',
    key: 'trainingCertUrls',
    uploadType: 'trainingCert',
    itemLabel: 'Certificate',
    label: 'Training Certificate',
    desc: 'Disaster response, first aid, or relevant certifications — add as many as you have',
    icon: FileText,
    required: true,
  },
  {
    kind: 'single',
    key: 'barangayClearanceUrl',
    uploadType: 'barangayClearance',
    label: 'Barangay Clearance',
    desc: 'Issued within the last 3 months from your barangay',
    icon: FileIcon,
    required: true,
  },
  {
    kind: 'multiple',
    key: 'medicalCertUrls',
    uploadType: 'medicalCert',
    itemLabel: 'Certificate',
    label: 'Medical Certificate',
    desc: 'Fit-to-work certificate(s) from a licensed physician — add as many as you have',
    icon: Stethoscope,
    required: true,
  },
];

export const steps = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Documents', icon: FileText },
  { id: 3, title: 'Review & Submit', icon: CheckCircle },
];

export const statusConfig = {
  pending: {
    label: 'Pending Review',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: Clock,
  },
  under_review: {
    label: 'Under Review',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: AlertCircle,
  },
};
