import { DocumentItem } from '@/types';
import {
  CheckCircle,
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
