// src/components/volunteer/ApplicationFormClient.tsx
'use client';

import {
  applicationStep1Schema,
  type ApplicationStep1Input,
} from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Heart,
  Loader2,
  MapPin,
  Phone,
  Upload,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type ExistingApp = {
  id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date | null;
} | null;

const steps = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Documents', icon: FileText },
  { id: 3, title: 'Review & Submit', icon: CheckCircle },
];

const statusConfig = {
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

type UploadedDocs = {
  validIdUrl?: string;
  trainingCertUrl?: string;
  barangayClearanceUrl?: string;
  medicalCertUrl?: string;
  photoUrl?: string;
};

export function ApplicationFormClient({
  existingApplication,
}: {
  existingApplication: ExistingApp;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [docs, setDocs] = useState<UploadedDocs>({});
  const [step1Data, setStep1Data] = useState<ApplicationStep1Input | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationStep1Input>({
    resolver: zodResolver(applicationStep1Schema),
    defaultValues: {
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Filipino',
    },
  });

  // ─── Already submitted — show status ─────────────────────
  if (existingApplication) {
    const cfg = statusConfig[existingApplication.status];
    const Icon = cfg.icon;
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Application</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Track your volunteer application status
          </p>
        </div>
        <div className={`rounded-2xl border p-6 ${cfg.bg}`}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/60">
              <Icon className={`h-6 w-6 ${cfg.color}`} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${cfg.color}`}>
                Status: {cfg.label}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {existingApplication.status === 'pending' &&
                  'Your application is in the queue. MDRRMO staff will review it within 3–5 business days.'}
                {existingApplication.status === 'under_review' &&
                  "Our team is currently reviewing your application. You'll hear from us soon."}
                {existingApplication.status === 'approved' &&
                  'Congratulations! Your application has been approved. You will be contacted for orientation and next steps.'}
                {existingApplication.status === 'rejected' &&
                  'We were unable to approve your application at this time. You may contact MDRRMO for more details or re-apply later.'}
              </p>
              {existingApplication.submittedAt && (
                <p className="mt-2 text-xs text-gray-400">
                  Submitted on{' '}
                  {new Date(existingApplication.submittedAt).toLocaleDateString(
                    'en-PH',
                    { dateStyle: 'long' },
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/profile')}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // ─── File upload helper ───────────────────────────────────
  const uploadFile = async (
    file: File,
    type: string,
  ): Promise<string | null> => {
    setUploadingKey(type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? 'Upload failed');
        return null;
      }

      return json.url as string;
    } catch {
      toast.error('Upload failed. Please try again.');
      return null;
    } finally {
      setUploadingKey(null);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docKey: keyof UploadedDocs,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, docKey.replace('Url', ''));
    if (url) {
      setDocs((prev) => ({ ...prev, [docKey]: url }));
      toast.success(
        `${docKey.replace('Url', '').replace(/([A-Z])/g, ' $1')} uploaded!`,
      );
    }
  };

  // ─── Step 1 submit ────────────────────────────────────────
  const onStep1Submit = (data: ApplicationStep1Input) => {
    setStep1Data(data);
    setStep(2);
  };

  // ─── Final submit ─────────────────────────────────────────
  const onFinalSubmit = async () => {
    if (!step1Data) return;
    if (!docs.validIdUrl) {
      toast.error('Valid ID is required. Please upload it first.');
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/volunteer/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...step1Data, ...docs }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Submission failed');
        return;
      }

      toast.success('Application submitted successfully!');
      router.push('/profile');
      router.refresh();
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Volunteer Application
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Disaster Relief Volunteer Registration Form
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm transition-all ${
                  step > s.id
                    ? 'bg-green-500 text-white'
                    : step === s.id
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s.id ? <Check className="h-5 w-5" /> : s.id}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium ${
                  step === s.id ? 'text-orange-600' : 'text-gray-400'
                }`}
              >
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-3 mb-5 h-0.5 w-16 transition-colors sm:w-24 ${
                  step > s.id ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Personal Details ──────────────────────── */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-0">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Section header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-white" />
                <h2 className="font-bold text-white">Personal Information</h2>
              </div>
              <p className="mt-1 text-xs text-orange-100">
                Fill in your personal details accurately
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* Photo upload */}
              <div className="flex items-center gap-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
                <label className="flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-orange-300 bg-white hover:bg-orange-50 transition-colors">
                  {docs.photoUrl ? (
                    <img
                      src={docs.photoUrl}
                      alt="Profile"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : uploadingKey === 'photo' ? (
                    <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
                  ) : (
                    <Camera className="h-6 w-6 text-orange-400" />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, 'photoUrl')}
                  />
                </label>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Profile Photo
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    JPG or PNG, max 2 MB. Clear face photo required.
                  </p>
                  {docs.photoUrl && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" /> Uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Row: Gender, Age, DOB */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Gender *
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Age *
                  </label>
                  <input
                    {...register('age', { valueAsNumber: true })}
                    type="number"
                    placeholder="21"
                    min={18}
                    max={70}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.age && (
                    <p className="text-xs text-red-600">{errors.age.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Date of Birth *
                  </label>
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-600">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row: Nationality, Native Place, Education */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    label: 'Nationality *',
                    field: 'nationality' as const,
                    placeholder: 'Filipino',
                  },
                  {
                    label: 'Native Place *',
                    field: 'nativePlace' as const,
                    placeholder: 'e.g. Tagalog',
                  },
                  {
                    label: 'Education Level *',
                    field: 'educationLevel' as const,
                    placeholder: 'e.g. College Graduate',
                  },
                ].map((f) => (
                  <div key={f.field} className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      {f.label}
                    </label>
                    <input
                      {...register(f.field)}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors[f.field] && (
                      <p className="text-xs text-red-600">
                        {errors[f.field]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Row: Health, Marital, Political */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Health Status *
                  </label>
                  <input
                    {...register('healthStatus')}
                    placeholder="Good / Excellent"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.healthStatus && (
                    <p className="text-xs text-red-600">
                      {errors.healthStatus.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Marital Status *
                  </label>
                  <select
                    {...register('maritalStatus')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Single</option>
                    <option>Married</option>
                    <option>Widowed</option>
                    <option>Separated</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Political Status
                  </label>
                  <input
                    {...register('politicalStatus')}
                    placeholder="e.g. Civilian"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* ID */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    ID Number *
                  </label>
                  <input
                    {...register('idNumber')}
                    placeholder="XXX-XXXX-XXX-XXX"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.idNumber && (
                    <p className="text-xs text-red-600">
                      {errors.idNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    ID Card Type *
                  </label>
                  <select
                    {...register('idCardType')}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>National ID</option>
                    <option>Voter&apos;s ID</option>
                    <option>Driver&apos;s License</option>
                    <option>Passport</option>
                    <option>SSS ID</option>
                    <option>PhilHealth ID</option>
                    <option>Postal ID</option>
                  </select>
                  {errors.idCardType && (
                    <p className="text-xs text-red-600">
                      {errors.idCardType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address & Contact */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <MapPin className="h-3.5 w-3.5" /> Current Address *
                </label>
                <input
                  {...register('currentAddress')}
                  placeholder="Sitio, Barangay, Municipality, Province"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.currentAddress && (
                  <p className="text-xs text-red-600">
                    {errors.currentAddress.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Phone className="h-3.5 w-3.5" /> Contact Number *
                  </label>
                  <input
                    {...register('contactNumber')}
                    placeholder="09XXXXXXXXX"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.contactNumber && (
                    <p className="text-xs text-red-600">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Home Phone
                  </label>
                  <input
                    {...register('homePhone')}
                    placeholder="(042) XXX-XXXX"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Heart className="h-4 w-4 text-red-500" /> Emergency Contact
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: 'Full Name *',
                      field: 'emergencyName' as const,
                      placeholder: 'Contact person name',
                    },
                    {
                      label: 'Relation *',
                      field: 'emergencyRelation' as const,
                      placeholder: 'e.g. Parent, Sibling',
                    },
                    {
                      label: 'Contact Number *',
                      field: 'emergencyContact' as const,
                      placeholder: '09XXXXXXXXX',
                    },
                    {
                      label: 'Address *',
                      field: 'emergencyAddress' as const,
                      placeholder: 'Address',
                    },
                  ].map((f) => (
                    <div key={f.field} className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        {f.label}
                      </label>
                      <input
                        {...register(f.field)}
                        placeholder={f.placeholder}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      {errors[f.field] && (
                        <p className="text-xs text-red-600">
                          {errors[f.field]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── STEP 2: Documents ─────────────────────────────── */}
      {step === 2 && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-white" />
              <h2 className="font-bold text-white">Upload Documents</h2>
            </div>
            <p className="mt-1 text-xs text-orange-100">
              Upload required documents for verification
            </p>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <p className="text-sm text-blue-700">
                All documents must be clear and legible. Accepted formats: JPG,
                PNG, PDF. Maximum file size: 5 MB each.
              </p>
            </div>

            {[
              {
                key: 'validIdUrl' as const,
                label: 'Valid Government ID',
                desc: "National ID, Voter's ID, Driver's License, or Passport",
                required: true,
              },
              {
                key: 'trainingCertUrl' as const,
                label: 'Training Certificate',
                desc: 'Any relevant disaster response or first aid training certificate',
                required: false,
              },
              {
                key: 'barangayClearanceUrl' as const,
                label: 'Barangay Clearance',
                desc: 'Issued within the last 3 months from your barangay',
                required: false,
              },
              {
                key: 'medicalCertUrl' as const,
                label: 'Medical Certificate',
                desc: 'Fit-to-work certificate from a licensed physician',
                required: false,
              },
            ].map((doc) => (
              <div
                key={doc.key}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {doc.label}
                      </span>
                      {doc.required && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{doc.desc}</p>
                  </div>
                  {docs[doc.key] && (
                    <a
                      href={docs[doc.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-shrink-0 items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> View{' '}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-6 hover:border-orange-300 hover:bg-orange-50 transition-all">
                  {uploadingKey === doc.key.replace('Url', '') ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                      <span className="text-sm text-orange-600">
                        Uploading...
                      </span>
                    </>
                  ) : docs[doc.key] ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-700">
                        Uploaded — click to replace
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Drag & drop or click to browse
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, doc.key)}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={() => {
                if (!docs.validIdUrl) {
                  toast.error('Please upload your Valid ID to continue.');
                  return;
                }
                setStep(3);
              }}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Submit ───────────────────────── */}
      {step === 3 && step1Data && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <h2 className="font-bold text-white">Review & Submit</h2>
            </div>
            <p className="mt-1 text-xs text-green-100">
              Please review your information before submitting
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Your application is ready to submit
                </p>
                <p className="mt-0.5 text-xs text-green-600">
                  MDRRMO staff will review within 3–5 business days. You will be
                  notified by email.
                </p>
              </div>
            </div>

            {/* Summary */}
            {[
              {
                title: 'Personal Details',
                icon: User,
                items: [
                  { l: 'Gender', v: step1Data.gender },
                  { l: 'Age', v: `${step1Data.age} years old` },
                  { l: 'Date of Birth', v: step1Data.dateOfBirth },
                  { l: 'Nationality', v: step1Data.nationality },
                  { l: 'Native Place', v: step1Data.nativePlace },
                  { l: 'Education', v: step1Data.educationLevel },
                ],
              },
              {
                title: 'Contact & Address',
                icon: MapPin,
                items: [
                  { l: 'Address', v: step1Data.currentAddress },
                  { l: 'Contact', v: step1Data.contactNumber },
                  { l: 'ID Number', v: step1Data.idNumber },
                  { l: 'ID Type', v: step1Data.idCardType },
                ],
              },
              {
                title: 'Emergency Contact',
                icon: Heart,
                items: [
                  { l: 'Name', v: step1Data.emergencyName },
                  { l: 'Relation', v: step1Data.emergencyRelation },
                  { l: 'Contact', v: step1Data.emergencyContact },
                  { l: 'Address', v: step1Data.emergencyAddress },
                ],
              },
            ].map((section) => (
              <div key={section.title} className="rounded-xl bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-bold text-gray-900">
                    {section.title}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {section.items.map((item) => (
                    <div key={item.l}>
                      <p className="text-xs text-gray-400">{item.l}</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {item.v || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Docs summary */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-gray-900">
                  Submitted Documents
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Valid ID', key: 'validIdUrl' as const },
                  { label: 'Training Cert', key: 'trainingCertUrl' as const },
                  {
                    label: 'Barangay Clearance',
                    key: 'barangayClearanceUrl' as const,
                  },
                  { label: 'Medical Cert', key: 'medicalCertUrl' as const },
                ].map((d) => (
                  <div
                    key={d.key}
                    className={`flex items-center gap-1.5 rounded-lg p-2.5 ${docs[d.key] ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <CheckCircle
                      className={`h-3.5 w-3.5 ${docs[d.key] ? 'text-green-600' : 'text-gray-400'}`}
                    />
                    <span
                      className={`text-xs font-medium ${docs[d.key] ? 'text-green-700' : 'text-gray-400'}`}
                    >
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification */}
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600">
                I certify that all information provided is true and correct. I
                understand that providing false information may result in the
                rejection or cancellation of my application.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={onFinalSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-200 hover:bg-green-600 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
