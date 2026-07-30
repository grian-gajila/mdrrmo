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

export type ExistingApp = {
  id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date | null;
} | null;

export type ApplicationFormClientProps = {
  existingApplication: ExistingApp;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export type AdminPayload = {
  id: number;
  username: string;
  displayName: string;
  role: string;
  lastLoginAt: Date | null;
};

export type AdminAsideProps = {
  admin: AdminPayload;
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
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  nationality: string;
  nativePlace: string;
  educationLevel: string;
  politicalStatus: string | null;
  healthStatus: string;
  maritalStatus: string;
  volunteerRole: string;
  idNumber: string;
  idCardType: string;
  sitio: string;
  barangay: string;
  municipality: string;
  province: string;
  contactNumber: string;
  homePhone: string | null;
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
  submittedAt: Date | null;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
};

export type SingleUploadSlotProps = {
  url?: string;
  label?: string;
  compact?: boolean;
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type MultiUploadSlotProps = {
  urls: string[];
  uploading: boolean;
  max: number;
  itemLabel: string;
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (url: string) => void;
};

export type ApplicationPreviewModalProps = {
  data: FullApplication | null;
  loading: boolean;
  onClose: () => void;
};

export interface DocumentSet {
  photoUrl?: string | null;
  validIdFrontUrl?: string | null;
  validIdBackUrl?: string | null;
  trainingCertUrls?: string[] | null;
  barangayClearanceUrl?: string | null;
  medicalCertUrls?: string[] | null;
}

export type DocumentThumbProps = {
  url: string;
  label?: string;
};

export interface CategoryProps {
  icon: LucideIcon;
  title: string;
  emptyText: string;
  documents: { url: string; label: string }[];
}

export type Volunteer = {
  id: string;
  avatar: string | null;
  role: string | null;
  status: 'active' | 'inactive' | 'suspended';
  hiredAt: Date | null;
  deploymentCount: number | null;
  trainings: string[] | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  contactNumber: string | null;
  sitio: string | null;
  barangay: string | null;
  municipality: string | null;
  province: string | null;
};

export type AdminUser = {
  id: number;
  username: string;
  displayName: string;
  email: string | null;
  role: string;
  lastLoginAt: Date | null;
  createdAt: Date | null;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  tags: string[] | null;
  isActive: boolean;
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt: Date | null;
  publishedAt: Date | null;
  expiresAt: Date | null;
  repeatBroadcast: boolean | null;
  broadcastFrequency: string | null;
  createdAt: Date | null;
};

export type AnnouncementType = 'info' | 'urgent' | 'warning' | 'success';

export type EffectiveStatus = 'draft' | 'scheduled' | 'published' | 'archived';
