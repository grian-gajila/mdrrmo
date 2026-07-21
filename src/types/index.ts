import { LucideIcon } from 'lucide-react';

export type {
  adminUsers,
  announcements,
  announcementTypeEnum,
  applicationStatusEnum,
  hiredVolunteers,
  volunteerApplications,
  volunteerProfiles,
  volunteerStatusEnum,
} from '@/lib/db/schema';

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string; fields?: Record<string, string[]> };

export type UserRole = 'VOLUNTEER' | 'ADMIN';

export type ExistingApp = {
  id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date | null;
} | null;

export type UploadedDocs = {
  validIdFrontUrl?: string;
  validIdBackUrl?: string;
  trainingCertUrls: string[];
  barangayClearanceUrl?: string;
  medicalCertUrls: string[];
  photoUrl?: string;
};

export type SingleDocKey =
  | 'photoUrl'
  | 'validIdFrontUrl'
  | 'validIdBackUrl'
  | 'barangayClearanceUrl';

export type ApplicationFormClientProps = {
  existingApplication: ExistingApp;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export type DocumentItem =
  | {
      kind: 'single';
      key: 'barangayClearanceUrl';
      uploadType: string;
      label: string;
      desc: string;
      icon: LucideIcon;
      required: boolean;
    }
  | {
      kind: 'sides';
      front: { key: 'validIdFrontUrl'; uploadType: string; label: string };
      back: { key: 'validIdBackUrl'; uploadType: string; label: string };
      label: string;
      desc: string;
      icon: LucideIcon;
      required: boolean;
    }
  | {
      kind: 'multiple';
      key: 'trainingCertUrls' | 'medicalCertUrls';
      uploadType: string;
      itemLabel: string;
      label: string;
      desc: string;
      icon: LucideIcon;
      required: boolean;
    };

export type FullApplication = {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  nationality: string;
  nativePlace: string;
  educationLevel: string;
  politicalStatus: string | null;
  healthStatus: string;
  maritalStatus: string;
  idNumber: string;
  idCardType: string;
  sitio: string;
  barangay: string;
  municipality: string;
  province: string;
  contactNumber: string;
  homePhone: string | null;
  email: string;
  emergencyContact: {
    name: string;
    relation: string;
    contactNumber: string;
    address: string;
  } | null;
  volunteeringExperience: string | null;
  validIdFrontUrl: string | null;
  validIdBackUrl: string | null;
  trainingCertUrl: string[] | null;
  barangayClearanceUrl: string | null;
  medicalCertUrl: string[] | null;
  photoUrl: string | null;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
};
