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
export type ApplicantStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIRED';

export interface ApplyForm {
  name: string;
  gender: string;
  age: string;
  dob: string;
  nationality: string;
  nativePlace: string;
  educationLevel: string;
  politicalStatus: string;
  healthStatus: string;
  idNumber: string;
  idType: string;
  currentAddress: string;
  contactNumber: string;
  homePhone: string;
  maritalStatus: string;
  volunteerExperience: string;
  familyInfo: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyContact: string;
  emergencyAddress: string;
  validId: File | null;
  trainingCert: File | null;
  photo: File | null;
  agreed: boolean;
}
