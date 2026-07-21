'use client';

import { ShieldSpinLoader } from '@/components/custom/loading';
import {
  documentTypes,
  statusConfig,
  steps,
} from '@/data/volunteer/application-details';
import {
  applicationStep1Schema,
  type ApplicationStep1Input,
} from '@/lib/validation/schema';
import {
  ApplicationFormClientProps,
  FullApplication,
  SingleDocKey,
  UploadedDocs,
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle,
  ExternalLink,
  Eye,
  FileText,
  Heart,
  IdCard,
  MapPinHouse,
  Phone,
  Upload,
  User,
  Workflow,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const MAX_MULTI_FILES = 5;

export function ApplicationFormClient({
  existingApplication,
  userData,
}: ApplicationFormClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingKeys, setUploadingKeys] = useState<Set<string>>(new Set());
  const [docs, setDocs] = useState<UploadedDocs>({
    trainingCertUrls: [],
    medicalCertUrls: [],
  });
  const [step1Data, setStep1Data] = useState<ApplicationStep1Input | null>(
    null,
  );
  const [certified, setCertified] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<FullApplication | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationStep1Input>({
    resolver: zodResolver(applicationStep1Schema),
    defaultValues: {
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Filipino',
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
    },
  });

  const openPreview = async () => {
    setShowPreview(true);
    if (previewData) return;

    setPreviewLoading(true);
    try {
      const res = await fetch('/api/volunteer/application');
      const json = await res.json();

      if (!res.ok || !json.application) {
        toast.error(json.error ?? 'Could not load your application.');
        setShowPreview(false);
        return;
      }

      setPreviewData(json.application as FullApplication);
    } catch {
      toast.error('Could not load your application. Please try again.');
      setShowPreview(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  if (existingApplication) {
    const cfg = statusConfig[existingApplication.status];
    const Icon = cfg.icon;
    return (
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Application</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Track your volunteer application status
          </p>
        </div>
        <div className={`rounded-lg border p-6 ${cfg.bg}`}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/60">
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

        <button
          type="button"
          onClick={openPreview}
          className="flex w-full items-center justify-center gap-2 rounded-lg hover:cursor-pointer border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600"
        >
          <Eye className="h-4 w-4" />
          Preview Submitted Application
        </button>

        {showPreview && (
          <ApplicationPreviewModal
            data={previewData}
            loading={previewLoading}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    );
  }

  const uploadFile = async (
    file: File,
    type: string,
  ): Promise<string | null> => {
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
        toast.error(json.error ?? `Failed to upload ${file.name}`);
        return null;
      }

      return json.url as string;
    } catch {
      toast.error(`Failed to upload ${file.name}. Please try again.`);
      return null;
    }
  };

  const setUploading = (key: string, value: boolean) => {
    setUploadingKeys((prev) => {
      const next = new Set(prev);
      if (value) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docKey: SingleDocKey,
    uploadType: string,
    successLabel = 'Document',
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(uploadType, true);
    const url = await uploadFile(file, uploadType);
    setUploading(uploadType, false);

    if (url) {
      setDocs((prev) => ({ ...prev, [docKey]: url }));
      toast.success(`${successLabel} uploaded!`);
    }
  };

  const handleMultiFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docKey: 'trainingCertUrls' | 'medicalCertUrls',
    uploadType: string,
  ) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const remainingSlots = MAX_MULTI_FILES - docs[docKey].length;
    if (remainingSlots <= 0) {
      toast.error(`You can upload up to ${MAX_MULTI_FILES} files.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > filesToUpload.length) {
      toast.error(
        `Only ${remainingSlots} more file${remainingSlots > 1 ? 's' : ''} can be added (max ${MAX_MULTI_FILES}).`,
      );
    }

    setUploading(uploadType, true);
    const results = await Promise.all(
      filesToUpload.map((file) => uploadFile(file, uploadType)),
    );
    setUploading(uploadType, false);

    const newUrls = results.filter((u): u is string => Boolean(u));
    if (newUrls.length > 0) {
      setDocs((prev) => ({
        ...prev,
        [docKey]: [...prev[docKey], ...newUrls],
      }));
      toast.success(
        `${newUrls.length} file${newUrls.length > 1 ? 's' : ''} uploaded!`,
      );
    }
  };

  const removeMultiFile = (
    docKey: 'trainingCertUrls' | 'medicalCertUrls',
    url: string,
  ) => {
    setDocs((prev) => ({
      ...prev,
      [docKey]: prev[docKey].filter((u) => u !== url),
    }));
  };

  const getMissingDocumentMessage = (): string | null => {
    if (!docs.photoUrl) return 'Please upload your profile photo first.';
    if (!docs.validIdFrontUrl || !docs.validIdBackUrl)
      return 'Please upload both sides of your Valid ID first.';
    if (docs.trainingCertUrls.length === 0)
      return 'Please upload at least one training certificate first.';
    if (!docs.barangayClearanceUrl)
      return 'Please upload your Barangay Clearance first.';
    if (docs.medicalCertUrls.length === 0)
      return 'Please upload at least one medical certificate first.';
    return null;
  };

  const onStep1Submit = (data: ApplicationStep1Input) => {
    setStep1Data(data);
    console.log(data);
    setStep(2);
  };

  const onFinalSubmit = async () => {
    if (!step1Data) return;
    const missingDocMessage = getMissingDocumentMessage();
    if (missingDocMessage) {
      toast.error(missingDocMessage);
      setStep(2);
      return;
    }
    if (!certified) {
      toast.error('Please certify that your information is true and correct.');
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
    <div className="mx-auto pb-10 w-full ">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Volunteer Application
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Disaster Relief Volunteer Registration Form
        </p>
      </div>
      <div className="py-10 flex items-start justify-center mx-auto">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-start">
            <button className="flex lg:w-28 md:w-28 w-24 flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 md:h-9 lg:h-10 md:w-9 lg:w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step > s.id
                    ? 'cursor-pointer bg-green-500 text-white'
                    : step === s.id
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                      : 'cursor-not-allowed bg-gray-100 text-gray-400'
                }`}
              >
                {step > s.id ? <Check className="h-5 w-5" /> : s.id}
              </div>
              <span
                className={`text-center lg:text-xs text-[8px] md:text-xs sm:text-[10px] leading-tight font-semibold ${step === s.id ? 'text-orange-500' : 'text-gray-400'}`}
              >
                {s.title}
              </span>
            </button>

            {i < steps.length - 1 && (
              <div
                className={`mx-1 mt-5 h-0.5 lg:w-60 md:w-40 sm:w-20 w-5 transition-colors ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-0">
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
            <div className="bg-linear-to-r from-orange-500 to-red-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-white" />
                <h2 className="font-bold text-white">Personal Information</h2>
              </div>
              <p className="mt-1 text-xs text-orange-100">
                Fill in your personal details accurately
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-5 rounded-lg border border-orange-100 bg-orange-50 p-4">
                <label className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-orange-300 bg-white hover:bg-orange-50 transition-colors">
                  {docs.photoUrl ? (
                    <Image
                      width={0}
                      height={0}
                      src={docs.photoUrl}
                      alt="Profile"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : uploadingKeys.has('photo') ? (
                    <ShieldSpinLoader size={26} color="text-orange-500" />
                  ) : (
                    <Camera className="h-6 w-6 text-orange-400" />
                  )}

                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(e, 'photoUrl', 'photo', 'Photo')
                    }
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

              <div className=" pt-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <User className="h-4 w-4 text-orange-500" /> Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    {...register('firstName')}
                    placeholder="e.g. Juan"
                    defaultValue={userData?.firstName}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Middle Name *
                  </label>
                  <input
                    {...register('middleName')}
                    placeholder="e.g. Santos"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.middleName && (
                    <p className="text-xs text-red-600">
                      {errors.middleName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName')}
                    placeholder="e.g. Dela Cruz"
                    defaultValue={userData?.lastName}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Gender *
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-600">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Nationality *
                  </label>
                  <input
                    {...register('nationality')}
                    placeholder="Filipino"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.nationality && (
                    <p className="text-xs text-red-600">
                      {errors.nationality.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Native Language *
                  </label>
                  <input
                    {...register('nativePlace')}
                    placeholder="e.g. Tagalog"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.nativePlace && (
                    <p className="text-xs text-red-600">
                      {errors.nativePlace.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Education Level *
                  </label>
                  <select
                    {...register('educationLevel')}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Elementary degree</option>
                    <option>High School degree</option>
                    <option>Senior High School degree</option>
                    <option>College degree</option>
                    <option>Masters degree</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Health Status *
                  </label>
                  <input
                    {...register('healthStatus')}
                    placeholder="Good / Excellent"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <IdCard className="h-4 w-4 text-orange-500" /> Identification
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    ID Number *
                  </label>
                  <input
                    {...register('idNumber')}
                    placeholder="XXX-XXXX-XXX-XXX"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 font-mono text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <MapPinHouse className="h-4 w-4 text-orange-500" /> Contact &
                  Address
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Sitio *
                  </label>
                  <input
                    {...register('sitio')}
                    placeholder="e.g. Centro 2"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.sitio && (
                    <p className="text-xs text-red-600">
                      {errors.sitio.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Barangay *
                  </label>
                  <input
                    {...register('barangay')}
                    placeholder="e.g. Don Pedro"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.barangay && (
                    <p className="text-xs text-red-600">
                      {errors.barangay.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Municipality *
                  </label>
                  <input
                    {...register('municipality')}
                    placeholder="e.g. Mansalay"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.municipality && (
                    <p className="text-xs text-red-600">
                      {errors.municipality.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Province *
                  </label>
                  <input
                    {...register('province')}
                    placeholder="e.g. Oriental Mindoro"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.province && (
                    <p className="text-xs text-red-600">
                      {errors.province.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Phone className="h-3.5 w-3.5" /> Contact Number *
                  </label>
                  <input
                    {...register('contactNumber')}
                    placeholder="09XXXXXXXXX"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.contactNumber && (
                    <p className="text-xs text-red-600">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Home Phone{' '}
                    <span className="text-orange-400">(Optional)</span>
                  </label>
                  <input
                    {...register('homePhone')}
                    placeholder="(042) XXX-XXXX"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    defaultValue={userData?.email}
                    placeholder="e.g. you@gmail.com"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Heart className="h-4 w-4 text-orange-500" /> Emergency
                  Contact
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
                      placeholder: 'e.g. Centro 2, Don Pedro, Mansalay',
                    },
                  ].map((f) => (
                    <div key={f.field} className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        {f.label}
                      </label>
                      <input
                        {...register(f.field)}
                        placeholder={f.placeholder}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Workflow className="h-4 w-4 text-orange-500" /> Experience
                </h3>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Volunteering Experience{' '}
                  <span className="text-orange-400"> (Optional)</span>
                </label>
                <textarea
                  {...register('volunteeringExperience')}
                  rows={4}
                  placeholder="e.g. 2022 – BFP Auxiliary Firefighter, Municipality of XYZ\n2021 – Red Cross Youth Chapter, Barangay ABC"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="flex hover:cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="submit"
                className="flex hover:cursor-pointer items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          <div className="bg-linear-to-r from-orange-500 to-red-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-white" />
              <h2 className="font-bold text-white">Upload Documents</h2>
            </div>
            <p className="mt-1 text-xs text-orange-100">
              Upload required documents for verification
            </p>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <p className="text-sm text-blue-700">
                All documents must be clear and legible. Accepted formats: JPG
                and PNG. Maximum file size: 5 MB each.
              </p>
            </div>

            {documentTypes.map((doc) => {
              let isComplete: boolean;
              let completedLabel = 'Uploaded';

              if (doc.kind === 'single') {
                isComplete = Boolean(docs[doc.key]);
              } else if (doc.kind === 'sides') {
                isComplete = Boolean(docs[doc.front.key] && docs[doc.back.key]);
              } else {
                isComplete = docs[doc.key].length > 0;
                completedLabel = `${docs[doc.key].length} uploaded`;
              }

              return (
                <div
                  key={doc.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-orange-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                        <doc.icon className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">
                            {doc.label}
                          </h3>

                          {doc.required && (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500">
                              Required
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {doc.desc}
                        </p>
                      </div>
                    </div>

                    {isComplete && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {completedLabel}
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    {doc.kind === 'single' && (
                      <SingleUploadSlot
                        url={docs[doc.key]}
                        uploading={uploadingKeys.has(doc.uploadType)}
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            doc.key,
                            doc.uploadType,
                            doc.label,
                          )
                        }
                      />
                    )}

                    {doc.kind === 'sides' && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <SingleUploadSlot
                          label={doc.front.label}
                          compact
                          url={docs[doc.front.key]}
                          uploading={uploadingKeys.has(doc.front.uploadType)}
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              doc.front.key,
                              doc.front.uploadType,
                              `${doc.label} (${doc.front.label})`,
                            )
                          }
                        />
                        <SingleUploadSlot
                          label={doc.back.label}
                          compact
                          url={docs[doc.back.key]}
                          uploading={uploadingKeys.has(doc.back.uploadType)}
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              doc.back.key,
                              doc.back.uploadType,
                              `${doc.label} (${doc.back.label})`,
                            )
                          }
                        />
                      </div>
                    )}

                    {doc.kind === 'multiple' && (
                      <MultiUploadSlot
                        urls={docs[doc.key]}
                        uploading={uploadingKeys.has(doc.uploadType)}
                        max={MAX_MULTI_FILES}
                        itemLabel={doc.itemLabel}
                        onAdd={(e) =>
                          handleMultiFileChange(e, doc.key, doc.uploadType)
                        }
                        onRemove={(url) => removeMultiFile(doc.key, url)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center hover:cursor-pointer gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={() => {
                const missingDocMessage = getMissingDocumentMessage();
                if (missingDocMessage) {
                  toast.error(missingDocMessage);
                  return;
                }
                setStep(3);
              }}
              className="flex hover:cursor-pointer items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && step1Data && (
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          <div className="bg-linear-to-r from-green-500 to-emerald-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <h2 className="font-bold text-white">Review & Submit</h2>
            </div>
            <p className="mt-1 text-xs text-green-100">
              Please review your information before submitting
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
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
                title: 'Basic Information',
                icon: User,
                items: [
                  { l: 'First Name', v: step1Data.firstName },
                  { l: 'Middle Name', v: step1Data.middleName },
                  { l: 'Last Name', v: step1Data.lastName },
                  { l: 'Gender', v: step1Data.gender },
                  { l: 'Age', v: `${step1Data.age} years old` },
                  { l: 'Date of Birth', v: step1Data.dateOfBirth },
                  { l: 'Nationality', v: step1Data.nationality },
                  { l: 'Native Language', v: step1Data.nativePlace },
                  { l: 'Education', v: step1Data.educationLevel },
                  { l: 'Health Status', v: step1Data.healthStatus },
                  { l: 'Marital Status', v: step1Data.maritalStatus },
                  { l: 'Political Status', v: step1Data.politicalStatus },
                ],
              },
              {
                title: 'Identification',
                icon: IdCard,
                items: [
                  { l: 'ID Number', v: step1Data.idNumber },
                  { l: 'ID Type', v: step1Data.idCardType },
                ],
              },
              {
                title: 'Contact & Address',
                icon: MapPinHouse,
                items: [
                  { l: 'Sitio', v: step1Data.sitio },
                  { l: 'Barangay', v: step1Data.barangay },
                  { l: 'Municipality', v: step1Data.municipality },
                  { l: 'Province', v: step1Data.province },
                  { l: 'Contact Number', v: step1Data.contactNumber },
                  { l: 'Home Phone', v: step1Data.homePhone },
                  { l: 'Email Address', v: step1Data.email },
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
              {
                title: 'Experience',
                icon: Workflow,
                items: [
                  {
                    l: 'Volunteering Experience',
                    v: step1Data.volunteeringExperience,
                  },
                ],
              },
            ].map((section) => (
              <div key={section.title} className="rounded-lg bg-gray-50 p-4">
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

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-gray-900">
                  Submitted Documents
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  {
                    label: 'Valid ID (Front & Back)',
                    done: Boolean(docs.validIdFrontUrl && docs.validIdBackUrl),
                  },
                  {
                    label: docs.trainingCertUrls.length
                      ? `Training Cert (${docs.trainingCertUrls.length})`
                      : 'Training Cert',
                    done: docs.trainingCertUrls.length > 0,
                  },
                  {
                    label: 'Barangay Clearance',
                    done: Boolean(docs.barangayClearanceUrl),
                  },
                  {
                    label: docs.medicalCertUrls.length
                      ? `Medical Cert (${docs.medicalCertUrls.length})`
                      : 'Medical Cert',
                    done: docs.medicalCertUrls.length > 0,
                  },
                ].map((d) => (
                  <div
                    key={d.label}
                    className={`flex items-center gap-1.5 rounded-lg p-2.5 ${d.done ? 'bg-green-100' : 'bg-gray-100'}`}
                  >
                    <CheckCircle
                      className={`h-3.5 w-3.5 ${d.done ? 'text-green-600' : 'text-gray-400'}`}
                    />
                    <span
                      className={`text-xs font-medium ${d.done ? 'text-green-700' : 'text-gray-400'}`}
                    >
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
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
              className="flex items-center gap-2 hover:cursor-pointer rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={onFinalSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 hover:cursor-pointer rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-200 hover:bg-green-600 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? (
                <ShieldSpinLoader size={26} color="text-orange-500" />
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

type SingleUploadSlotProps = {
  url?: string;
  label?: string;
  compact?: boolean;
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SingleUploadSlot({
  url,
  label,
  compact,
  uploading,
  onChange,
}: SingleUploadSlotProps) {
  if (uploading) {
    return (
      <div
        className={`flex ${compact ? 'h-24' : 'h-32'} w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/50 text-center`}
      >
        <ShieldSpinLoader size={26} color="text-orange-500 mb-2" />
        <p className="text-sm font-medium text-orange-600">Uploading...</p>
      </div>
    );
  }

  if (url) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
        <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />

        <div className="flex-1 overflow-hidden">
          {label && (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-green-700/70">
              {label}
            </p>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 truncate text-sm font-medium text-green-700 hover:text-orange-600"
          >
            View document
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>

        <label className="shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-orange-300 hover:text-orange-600">
          Replace
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onChange}
          />
        </label>
      </div>
    );
  }

  return (
    <label
      className={`flex ${compact ? 'h-24' : 'h-32'} w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center transition-all hover:border-orange-300 hover:bg-orange-50`}
    >
      <Upload className="mb-2 h-6 w-6 text-gray-300" />
      {label && (
        <p className="mb-0.5 text-xs font-semibold text-gray-600">{label}</p>
      )}
      <p className="px-2 text-sm text-gray-500">
        Drag & drop or{' '}
        <span className="font-semibold text-orange-500">browse</span>
      </p>
      <p className="mt-1 text-xs text-gray-400">JPG, PNG • Max 5 MB</p>
      <input
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
      />
    </label>
  );
}

type MultiUploadSlotProps = {
  urls: string[];
  uploading: boolean;
  max: number;
  itemLabel: string;
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (url: string) => void;
};

function MultiUploadSlot({
  urls,
  uploading,
  max,
  itemLabel,
  onAdd,
  onRemove,
}: MultiUploadSlotProps) {
  const canAddMore = urls.length < max;

  return (
    <div className="space-y-3">
      {urls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {urls.map((url, i) => (
            <div
              key={url}
              className="flex items-center gap-2 overflow-hidden rounded-lg border border-green-100 bg-green-50 py-2.5 pl-3 pr-2"
            >
              <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-xs font-medium text-green-700 hover:text-orange-600"
              >
                {itemLabel} {i + 1}
              </a>
              <button
                type="button"
                onClick={() => onRemove(url)}
                aria-label={`Remove ${itemLabel.toLowerCase()} ${i + 1}`}
                className="shrink-0 rounded-full p-1 text-green-400 transition-colors hover:bg-green-100 hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {canAddMore &&
        (uploading ? (
          <div className="flex h-24 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/50 text-center">
            <ShieldSpinLoader size={26} color="text-orange-500 mb-1.5" />
            <p className="text-xs font-medium text-orange-600">Uploading...</p>
          </div>
        ) : (
          <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-center transition-all hover:border-orange-300 hover:bg-orange-50">
            <Upload className="mb-1.5 h-5 w-5 text-gray-300" />
            <p className="text-xs text-gray-500">
              {urls.length > 0 ? (
                <>
                  Add another{' '}
                  <span className="font-semibold text-orange-500">file</span>
                </>
              ) : (
                <>
                  Drag & drop or{' '}
                  <span className="font-semibold text-orange-500">
                    browse files
                  </span>
                </>
              )}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Up to {max} files • JPG, PNG
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onAdd}
            />
          </label>
        ))}
    </div>
  );
}

type ApplicationPreviewModalProps = {
  data: FullApplication | null;
  loading: boolean;
  onClose: () => void;
};

function ApplicationPreviewModal({
  data,
  loading,
  onClose,
}: ApplicationPreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sections = data
    ? [
        {
          title: 'Basic Information',
          icon: User,
          items: [
            { l: 'First Name', v: data.firstName },
            { l: 'Middle Name', v: data.middleName },
            { l: 'Last Name', v: data.lastName },
            { l: 'Gender', v: data.gender },
            { l: 'Age', v: `${data.age} years old` },
            { l: 'Date of Birth', v: data.dateOfBirth },
            { l: 'Nationality', v: data.nationality },
            { l: 'Native Language', v: data.nativePlace },
            { l: 'Education', v: data.educationLevel },
            { l: 'Health Status', v: data.healthStatus },
            { l: 'Marital Status', v: data.maritalStatus },
            { l: 'Political Status', v: data.politicalStatus },
          ],
        },
        {
          title: 'Identification',
          icon: IdCard,
          items: [
            { l: 'ID Number', v: data.idNumber },
            { l: 'ID Type', v: data.idCardType },
          ],
        },
        {
          title: 'Contact & Address',
          icon: MapPinHouse,
          items: [
            { l: 'Sitio', v: data.sitio },
            { l: 'Barangay', v: data.barangay },
            { l: 'Municipality', v: data.municipality },
            { l: 'Province', v: data.province },
            { l: 'Contact Number', v: data.contactNumber },
            { l: 'Home Phone', v: data.homePhone },
            { l: 'Email Address', v: data.email },
          ],
        },
        {
          title: 'Emergency Contact',
          icon: Heart,
          items: [
            { l: 'Name', v: data.emergencyContact?.name },
            { l: 'Relation', v: data.emergencyContact?.relation },
            { l: 'Contact', v: data.emergencyContact?.contactNumber },
            { l: 'Address', v: data.emergencyContact?.address },
          ],
        },
        {
          title: 'Experience',
          icon: Workflow,
          items: [
            {
              l: 'Volunteering Experience',
              v: data.volunteeringExperience,
            },
          ],
        },
      ]
    : [];

  const documents = data
    ? [
        data.photoUrl && { url: data.photoUrl, label: 'Profile Photo' },
        data.validIdFrontUrl && {
          url: data.validIdFrontUrl,
          label: 'Valid ID (Front)',
        },
        data.validIdBackUrl && {
          url: data.validIdBackUrl,
          label: 'Valid ID (Back)',
        },
        data.barangayClearanceUrl && {
          url: data.barangayClearanceUrl,
          label: 'Barangay Clearance',
        },
        ...(data.trainingCertUrl ?? []).map((url, i) => ({
          url,
          label: `Training Cert ${i + 1}`,
        })),
        ...(data.medicalCertUrl ?? []).map((url, i) => ({
          url,
          label: `Medical Cert ${i + 1}`,
        })),
      ].filter((d): d is { url: string; label: string } => Boolean(d))
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {data
                ? `${data.firstName} ${data.lastName}`
                : 'Application Preview'}
            </h2>
            {data && (
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusConfig[data.status].bg} ${statusConfig[data.status].color}`}
                >
                  {statusConfig[data.status].label}
                </span>
                <span className="text-xs text-gray-400">
                  Submitted{' '}
                  {new Date(data.submittedAt).toLocaleDateString('en-PH', {
                    dateStyle: 'long',
                  })}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="shrink-0 rounded-full p-1.5 hover:cursor-pointer text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {loading && !data ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <ShieldSpinLoader size={26} color="text-orange-500" />
              <p className="text-sm text-gray-500">
                Loading your application...
              </p>
            </div>
          ) : data ? (
            <div className="space-y-5">
              {sections.map((section) => (
                <div key={section.title} className="rounded-lg bg-gray-50 p-4">
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

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-bold text-gray-900">
                    Documents
                  </span>
                </div>
                {documents.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {documents.map((doc) => (
                      <DocumentThumb
                        key={doc.url}
                        url={doc.url}
                        label={doc.label}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No documents on file.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-gray-500">
              Couldn&apos;t load your application.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type DocumentThumbProps = {
  url: string;
  label: string;
};

function DocumentThumb({ url, label }: DocumentThumbProps) {
  const isPdf = /\.pdf($|\?)/i.test(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-orange-300"
    >
      {isPdf ? (
        <div className="flex h-24 flex-col items-center justify-center gap-1.5 bg-gray-50">
          <FileText className="h-6 w-6 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">View PDF</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={label} className="h-24 w-full object-cover" />
      )}
      <div className="flex items-center justify-between gap-1 border-t border-gray-100 bg-white px-2.5 py-1.5">
        <span className="truncate text-xs font-medium text-gray-600">
          {label}
        </span>
        <ExternalLink className="h-3 w-3 shrink-0 text-gray-400 transition-colors group-hover:text-orange-500" />
      </div>
    </a>
  );
}
