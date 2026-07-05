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
