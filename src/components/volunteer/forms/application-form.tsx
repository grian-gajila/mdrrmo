'use client';

import { ShieldSpinLoader } from '@/components/custom/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, parse } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  documentTypes,
  statusConfig,
  steps,
} from '@/data/volunteer/application-details';
import useVolunteerApplicationPreview from '@/hooks/use-volunteer-application-preview';
import useVolunteerSubmitApplication from '@/hooks/use-volunteer-submit-application';
import { cn } from '@/lib/utils';
import { ApplicationFormClientProps, FullApplication } from '@/types';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Camera,
  Check,
  CheckCircle,
  ExternalLink,
  Eye,
  FileIcon,
  FileText,
  Heart,
  IdCard,
  LucideIcon,
  MapPinHouse,
  Phone,
  Stethoscope,
  Upload,
  User,
  Workflow,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

export function ApplicationFormClient({
  existingApplication,
  userData,
}: ApplicationFormClientProps) {
  const router = useRouter();
  const {
    openPreview,
    previewData,
    previewLoading,
    showPreview,
    setShowPreview,
  } = useVolunteerApplicationPreview();

  const {
    docs,
    step,
    setStep,
    step1Data,
    control,
    isSubmitting,
    uploadingKeys,
    certified,
    setCertified,
    register,
    handleSubmit,
    errors,
    handleFileChange,
    handleMultiFileChange,
    removeMultiFile,
    onStep1Submit,
    onFinalSubmit,
    MAX_MULTI_FILES,
    getMissingDocumentMessage,
  } = useVolunteerSubmitApplication({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
  });

  if (existingApplication) {
    const cfg = statusConfig[existingApplication.status];
    const Icon = cfg.icon;
    return (
      <div className="w-full pb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Application</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Track your volunteer application status
          </p>
        </div>
        <div className={`rounded-lg border p-6 mt-4 mb-2 ${cfg.bg}`}>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border  bg-white/60">
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
          className="flex w-full items-center justify-center gap-2 rounded-lg hover:cursor-pointer border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
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

  return (
    <div className="space-y-6 w-full py-10 md:py-0 md:pb-10 mx-auto overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Volunteer Application
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Disaster Relief Volunteer Registration Form
        </p>
      </div>
      <div className="py-10 flex items-start overflow-hidden justify-center mx-auto">
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
                className={`mx-1 mt-5 h-0.5 lg:w-40 md:w-35 sm:w-20 w-5 transition-colors ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`}
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

            <div className="space-y-6 p-6 mx-auto flex-wrap">
              <div className="flex items-center gap-5 rounded-lg border border-orange-100 bg-orange-50 p-4">
                <Label className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-orange-300 bg-white hover:bg-orange-50 transition-colors">
                  {docs.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={docs.photoUrl}
                      alt="Profile"
                      className="h-full w-full rounded-lg object-contain"
                    />
                  ) : uploadingKeys.has('photo') ? (
                    <ShieldSpinLoader size={26} color="text-orange-500" />
                  ) : (
                    <Camera className="h-6 w-6 text-orange-400" />
                  )}

                  <Input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(e, 'photoUrl', 'photo', 'Photo')
                    }
                  />
                </Label>
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Middle Name *
                  </Label>
                  <Input
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Gender *
                  </Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <SelectValue placeholder="Select your gender..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select your gender...</SelectLabel>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Prefer not to say">
                              Prefer not to say
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-xs text-red-600">
                      {errors.gender.message}
                    </p>
                  )}
                  {}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Age *
                  </Label>
                  <Input
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Date of Birth *
                  </Label>

                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'w-full justify-start rounded-lg border-gray-200 bg-gray-50 text-left font-normal hover:bg-gray-100',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />

                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value
                                ? parse(field.value, 'yyyy-MM-dd', new Date())
                                : undefined
                            }
                            onSelect={(date) => {
                              if (!date) {
                                field.onChange('');
                                return;
                              }

                              const year = date.getFullYear();
                              const month = String(
                                date.getMonth() + 1,
                              ).padStart(2, '0');
                              const day = String(date.getDate()).padStart(
                                2,
                                '0',
                              );

                              field.onChange(`${year}-${month}-${day}`);
                            }}
                            captionLayout="dropdown"
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-600">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Nationality *
                  </Label>
                  <Input
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Native Language *
                  </Label>
                  <Input
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
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Education Level *
                  </Label>
                  <Controller
                    control={control}
                    name="educationLevel"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <SelectValue placeholder="Select your degree..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select your degree...</SelectLabel>
                            <SelectItem value="Elementary degree">
                              Elementary degree
                            </SelectItem>
                            <SelectItem value="High School degree">
                              High School degree
                            </SelectItem>
                            <SelectItem value="Senior High School degree">
                              Senior High School degree
                            </SelectItem>
                            <SelectItem value="College degree">
                              College degree
                            </SelectItem>
                            <SelectItem value="Masters degree">
                              Masters degree
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.educationLevel && (
                    <p className="text-xs text-red-600">
                      {errors.educationLevel.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    Health Status *
                  </Label>
                  <Input
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
                  <Label className="text-sm font-medium text-gray-700">
                    Marital Status *
                  </Label>
                  <Controller
                    control={control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <SelectValue placeholder="Select your status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select your status...</SelectLabel>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                            <SelectItem value="Separated">Separated</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.maritalStatus && (
                    <p className="text-xs text-red-600">
                      {errors.maritalStatus.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    Political Status{' '}
                    <span className="text-orange-400"> (Optional)</span>
                  </Label>
                  <Input
                    {...register('politicalStatus')}
                    placeholder="e.g. Civilian"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="volunteerRole"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <SelectValue placeholder="Select your prepared role..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>
                              Select your prepared role...
                            </SelectLabel>
                            <SelectItem value="Rescue and Emergency Response">
                              Rescue and Emergency Response
                            </SelectItem>
                            <SelectItem value="Medical and First Aid">
                              Medical and First Aid
                            </SelectItem>
                            <SelectItem value="Communications and Early Warning">
                              Communications and Early Warning
                            </SelectItem>
                            <SelectItem value="Evacuation and Camp Management">
                              Evacuation and Camp Management
                            </SelectItem>
                            <SelectItem value="Relief and Logistics">
                              Relief and Logistics
                            </SelectItem>
                            <SelectItem value="Information Management and Documentation">
                              Information Management and Documentation
                            </SelectItem>
                            <SelectItem value="Damage Assessment">
                              Damage Assessment
                            </SelectItem>
                            <SelectItem value="Community Preparedness and Training">
                              Community Preparedness and Training
                            </SelectItem>
                            <SelectItem value="Psychosocial Support">
                              Psychosocial Support
                            </SelectItem>
                            <SelectItem value="Environmental Protection and Rehabilitation">
                              Environmental Protection and Rehabilitation
                            </SelectItem>
                            <SelectItem value="Administrative and EOC Support">
                              Administrative and EOC Support
                            </SelectItem>
                            <SelectItem value="Youth and Child Support">
                              Youth and Child Support
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.volunteerRole && (
                    <p className="text-xs text-red-600">
                      {errors.volunteerRole.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <IdCard className="h-4 w-4 text-orange-500" /> Identification
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    ID Number *
                  </Label>
                  <Input
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
                  <Label className="text-sm font-medium text-gray-700">
                    ID Card Type *
                  </Label>
                  <Controller
                    control={control}
                    name="idCardType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <SelectValue placeholder="Select card type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Card Type</SelectLabel>
                            <SelectItem value="National ID">
                              National ID
                            </SelectItem>
                            <SelectItem value="Voter's ID">
                              Voter&apos;s ID
                            </SelectItem>
                            <SelectItem value="Driver's License">
                              Driver&apos;s License
                            </SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="SSS ID">SSS ID</SelectItem>
                            <SelectItem value="PhilHealth ID">
                              PhilHealth ID
                            </SelectItem>
                            <SelectItem value="Postal ID">Postal ID</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

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
                  <Label className="text-sm font-medium text-gray-700">
                    Sitio *
                  </Label>
                  <Input
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
                  <Label className="text-sm font-medium text-gray-700">
                    Barangay *
                  </Label>
                  <Input
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
                  <Label className="text-sm font-medium text-gray-700">
                    Municipality *
                  </Label>
                  <Input
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
                  <Label className="text-sm font-medium text-gray-700">
                    Province *
                  </Label>
                  <Input
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
                  <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Phone className="h-3.5 w-3.5" /> Contact Number *
                  </Label>
                  <Input
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
                  <Label className="text-sm font-medium text-gray-700">
                    Home Phone{' '}
                    <span className="text-orange-400">(Optional)</span>
                  </Label>
                  <Input
                    {...register('homePhone')}
                    placeholder="(042) XXX-XXXX"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <Input
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
                      <Label className="text-sm font-medium text-gray-700">
                        {f.label}
                      </Label>
                      <Input
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
                <Label className="text-sm font-medium text-gray-700">
                  Volunteering Experience{' '}
                  <span className="text-orange-400"> (Optional)</span>
                </Label>
                <Textarea
                  {...register('volunteeringExperience')}
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

          <div className="space-y-4 sm:p-6 p-4">
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <p className="sm:text-sm text-xs text-blue-700">
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
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-orange-200 hover:shadow-sm sm:p-5"
                >
                  <div className="flex sm:hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 md:h-11 md:w-11 md:rounded-lg">
                    <doc.icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex min-w-0 flex-1 gap-3">
                      <div className="sm:flex hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 md:h-11 md:w-11 md:rounded-lg">
                        <doc.icon className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="sm:text-sm text-[12px] font-bold text-gray-900">
                            {doc.label}
                          </h3>

                          {doc.required && (
                            <p className="shrink-0 whitespace-nowrap rounded-full bg-red-50 px-2 py-0.5 text-[8px] sm:text-xs font-bold text-red-500 ">
                              Required
                            </p>
                          )}

                          {isComplete && (
                            <span className=" right-5 shrink-0 flex justify-end items-center gap-1 whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 sm:text-xs text-[8px] font-semibold text-green-600 sm:px-3">
                              <CheckCircle className="h-3.5 w-3.5" />
                              {completedLabel}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] md text-xs text-wrap leading-5 text-gray-500  sm:text-sm">
                          {doc.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-5">
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
                  { l: 'Volunteer Role', v: step1Data.volunteerRole },
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
                <ShieldSpinLoader size={20} color="text-white" />
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
        <div className="flex items-center mb-2 justify-center">
          <ShieldSpinLoader size={26} color="text-orange-500" />
        </div>
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
            className="inline-flex items-center gap-1 truncate sm:text-sm text-[10px] md font-medium text-green-700 hover:text-orange-600"
          >
            View document
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>

        <label className="shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-white  py-1 px-3 text-xs font-medium text-gray-600 transition hover:border-orange-300 hover:text-orange-600">
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
              className="flex items-center gap-2 overflow-hidden rounded-lg border border-green-100 bg-green-50 p-1"
            >
              <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate sm:text-sm text-[10px] font-medium text-green-700 hover:text-orange-600"
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
            <div className="flex items-center justify-center mb-1.5">
              <ShieldSpinLoader size={26} color="text-orange-500" />
            </div>
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
            { l: 'Volunteer Role', v: data.volunteerRole },
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
                {data.submittedAt ? (
                  <span className="text-xs text-gray-400">
                    Submitted{' '}
                    {new Date(data.submittedAt).toLocaleDateString('en-PH', {
                      dateStyle: 'long',
                    })}
                  </span>
                ) : null}
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
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-gray-900">
                  Documents
                </span>
              </div>
              <DocumentReview
                docs={{
                  photoUrl: data.photoUrl,
                  validIdFrontUrl: data.validIdFrontUrl,
                  validIdBackUrl: data.validIdBackUrl,
                  trainingCertUrls: data.trainingCertUrl,
                  barangayClearanceUrl: data.barangayClearanceUrl,
                  medicalCertUrls: data.medicalCertUrl,
                }}
              />
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

interface DocumentSet {
  photoUrl?: string | null;
  validIdFrontUrl?: string | null;
  validIdBackUrl?: string | null;
  trainingCertUrls?: string[] | null;
  barangayClearanceUrl?: string | null;
  medicalCertUrls?: string[] | null;
}

function isImageUrl(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp)(\?.*)?$/i.test(url);
}

type DocumentThumbProps = {
  url: string;
  label?: string;
};

function DocumentThumb({ url, label }: DocumentThumbProps) {
  const isImage = isImageUrl(url);
  return (
    <div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-orange-300"
      >
        <div className="relative aspect-4/3 w-full bg-gray-100">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={label} className="h-24 w-full object-cover" />
          ) : (
            <div className="flex h-24 flex-col items-center justify-center gap-1.5 bg-gray-50">
              <FileText className="h-6 w-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                PDF Document
              </span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-900">
              <ExternalLink className="h-3.5 w-3.5" /> View full size
            </span>
          </div>
        </div>
        {label && (
          <div className="border-t border-gray-100 px-2.5 py-1.5 text-center text-xs font-medium text-gray-600">
            {label}
          </div>
        )}
      </a>
    </div>
  );
}

interface CategoryProps {
  icon: LucideIcon;
  title: string;
  emptyText: string;
  documents: { url: string; label: string }[];
}

function DocumentCategory({
  icon: Icon,
  title,
  emptyText,
  documents,
}: CategoryProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-bold text-gray-900">{title}</span>
      </div>
      {documents.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {documents.map((doc) => (
            <DocumentThumb key={doc.url} url={doc.url} label={doc.label} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">{emptyText}</p>
      )}
    </div>
  );
}

export function DocumentReview({ docs }: { docs: DocumentSet }) {
  const trainingCerts = docs.trainingCertUrls ?? [];
  const medicalCerts = docs.medicalCertUrls ?? [];

  return (
    <div className="space-y-4">
      <DocumentCategory
        icon={Camera}
        title="Profile Photo"
        emptyText="No profile photo on file."
        documents={
          docs.photoUrl ? [{ url: docs.photoUrl, label: 'Profile Photo' }] : []
        }
      />

      <DocumentCategory
        icon={IdCard}
        title="Valid Government ID"
        emptyText="No ID on file."
        documents={[
          ...(docs.validIdFrontUrl
            ? [{ url: docs.validIdFrontUrl, label: 'Front' }]
            : []),
          ...(docs.validIdBackUrl
            ? [{ url: docs.validIdBackUrl, label: 'Back' }]
            : []),
        ]}
      />

      <DocumentCategory
        icon={FileText}
        title={`Training Certificate${trainingCerts.length === 1 ? '' : 's'} (${trainingCerts.length})`}
        emptyText="No training certificates on file."
        documents={trainingCerts.map((url, i) => ({
          url,
          label: `Certificate ${i + 1}`,
        }))}
      />

      <DocumentCategory
        icon={FileIcon}
        title="Barangay Clearance"
        emptyText="No barangay clearance on file."
        documents={
          docs.barangayClearanceUrl
            ? [{ url: docs.barangayClearanceUrl, label: 'Barangay Clearance' }]
            : []
        }
      />

      <DocumentCategory
        icon={Stethoscope}
        title={`Medical Certificate${medicalCerts.length === 1 ? '' : 's'} (${medicalCerts.length})`}
        emptyText="No medical certificates on file."
        documents={medicalCerts.map((url, i) => ({
          url,
          label: `Certificate ${i + 1}`,
        }))}
      />
    </div>
  );
}
