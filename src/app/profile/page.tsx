'use client';
import { images } from '@/constant/images';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  FileText,
  Heart,
  IdCard,
  Loader2,
  LogOut,
  MapPin,
  Phone,
  Upload,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Step = 1 | 2 | 3;

interface ApplyForm {
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

const STEPS = [
  { id: 1 as Step, title: 'Personal Details', icon: User },
  { id: 2 as Step, title: 'Documents', icon: FileText },
  { id: 3 as Step, title: 'Review & Submit', icon: Check },
];

const mockUser = {
  name: 'Juan dela Cruz',
  email: 'juan@email.com',
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState<ApplyForm>({
    name: mockUser.name,
    gender: 'Male',
    age: '',
    dob: '',
    nationality: 'Filipino',
    nativePlace: '',
    educationLevel: '',
    politicalStatus: '',
    healthStatus: '',
    idNumber: '',
    idType: 'National ID',
    currentAddress: '',
    contactNumber: '',
    homePhone: '',
    maritalStatus: 'Single',
    volunteerExperience: '',
    familyInfo: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyContact: '',
    emergencyAddress: '',
    validId: null,
    trainingCert: null,
    photo: null,
    agreed: false,
  });

  const set = (k: keyof ApplyForm, v: ApplyForm[keyof ApplyForm]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.agreed) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg text-center border shadow-md rounded-lg border-gray-100 bg-white px-6 py-10 sm:px-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="mb-3 text-2xl font-extrabold text-gray-900">
            Application Submitted!
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-gray-500">
            Thank you,{' '}
            <strong className="text-gray-800">{mockUser.name}</strong>. Your
            volunteer application has been received. MDRRMO staff will review it
            within <strong className="text-gray-800">3–5 business days</strong>{' '}
            and notify you at{' '}
            <strong className="text-gray-800">{mockUser.email}</strong>.
          </p>
          <div className="mb-7 space-y-3 rounded-lg border border-orange-100 bg-orange-50 p-5 text-left">
            <p className="text-xs font-bold tracking-widest text-orange-600 uppercase">
              What&apos;s next?
            </p>
            {[
              'Check your email for a confirmation message.',
              'An MDRRMO officer may call you for verification.',
              'Once approved, collect your volunteer ID at the office.',
            ].map((s) => (
              <div key={s} className="flex items-start gap-2.5">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <p className="text-sm text-orange-800">{s}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
            }}
            className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition-colors hover:bg-orange-600"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full ">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <Image src={images.logo} alt="LOGO" className="h-10 w-10" />
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold text-orange-500">MDRRMO</p>
              <p className="mt-px text-[10px] text-gray-400">
                Volunteer Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-gray-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-red-500 text-xs font-bold text-white">
                  {mockUser.name.charAt(0)}
                </div>
                <span className="hidden text-sm font-semibold text-gray-700 sm:block">
                  {mockUser.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {menuOpen && (
                <div className="absolute top-11 right-0 z-50 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  <div className="border-b border-gray-50 px-4 py-3">
                    <p className="truncate text-xs font-bold text-gray-900">
                      {mockUser.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {mockUser.email}
                    </p>
                  </div>
                  <button className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Volunteer Application
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Disaster Relief Volunteer Registration Form
          </p>
        </div>

        <div className="mb-10 flex items-start justify-center">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-start">
              <button
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                className="flex w-28 flex-col items-center gap-2"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    currentStep > step.id
                      ? 'cursor-pointer bg-green-500 text-white'
                      : currentStep === step.id
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                        : 'cursor-not-allowed bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-center text-xs leading-tight font-semibold ${currentStep === step.id ? 'text-orange-500' : 'text-gray-400'}`}
                >
                  {step.title}
                </span>
              </button>

              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 mt-5 h-0.5 w-20 transition-colors ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          {currentStep === 1 && (
            <>
              <StepHeader
                icon={User}
                color="orange"
                title="Personal Information"
                sub="Fill in your details accurately — all fields are used for verification."
              />

              <div className="space-y-7 p-6 sm:p-8">
                <div className="flex items-center gap-5 rounded-lg border border-orange-100 bg-orange-50 p-5">
                  <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-orange-200 bg-white transition-colors hover:border-orange-400">
                    {form.photo ? (
                      <Image
                        src={URL.createObjectURL(form.photo)}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="h-6 w-6 text-orange-300" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        set('photo', e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Profile Photo
                    </p>
                    <p className="mt-0.5 mb-2 text-xs text-gray-400">
                      Clear face photo, JPG or PNG, max 2 MB
                    </p>
                    {form.photo ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {form.photo.name}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-orange-500">
                        Click photo box to upload
                      </span>
                    )}
                  </div>
                </div>

                <FormSection title="Basic Information">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Gender">
                      <select
                        value={form.gender}
                        onChange={(e) => set('gender', e.target.value)}
                        className={selCls}
                      >
                        {['Male', 'Female', 'Prefer not to say'].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Age">
                      <input
                        type="number"
                        min={18}
                        placeholder="21"
                        value={form.age}
                        onChange={(e) => set('age', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                    <Field label="Date of Birth">
                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) => set('dob', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Nationality">
                      <input
                        placeholder="Filipino"
                        value={form.nationality}
                        onChange={(e) => set('nationality', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                    <Field label="Native Place">
                      <input
                        placeholder="e.g. Tagalog"
                        value={form.nativePlace}
                        onChange={(e) => set('nativePlace', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                    <Field label="Education Level">
                      <select
                        value={form.educationLevel}
                        onChange={(e) => set('educationLevel', e.target.value)}
                        className={selCls}
                      >
                        <option value="">Select…</option>
                        {[
                          'Elementary',
                          'High School',
                          'Vocational / Tech',
                          'College Graduate',
                          'Post-Graduate',
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Political Status">
                      <input
                        placeholder="e.g. Civilian"
                        value={form.politicalStatus}
                        onChange={(e) => set('politicalStatus', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                    <Field label="Health Status">
                      <input
                        placeholder="e.g. Good, Excellent"
                        value={form.healthStatus}
                        onChange={(e) => set('healthStatus', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                  </div>
                </FormSection>

                <FormSection title="Identification">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="ID Card Type">
                      <select
                        value={form.idType}
                        onChange={(e) => set('idType', e.target.value)}
                        className={selCls}
                      >
                        {[
                          'National ID',
                          "Voter's ID",
                          "Driver's License",
                          'Passport',
                          'SSS ID',
                          'PhilHealth ID',
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="ID Number">
                      <input
                        placeholder="XXX-XXXX-XXX-XXX"
                        value={form.idNumber}
                        onChange={(e) => set('idNumber', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                  </div>
                </FormSection>

                <FormSection title="Contact & Address">
                  <Field
                    label={
                      <>
                        <MapPin className="h-3.5 w-3.5 text-gray-400" /> Current
                        Address
                      </>
                    }
                  >
                    <input
                      placeholder="Sitio, Barangay, Municipality, Province"
                      value={form.currentAddress}
                      onChange={(e) => set('currentAddress', e.target.value)}
                      className={inCls}
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field
                      label={
                        <>
                          <Phone className="h-3.5 w-3.5 text-gray-400" /> Mobile
                          Number
                        </>
                      }
                    >
                      <input
                        placeholder="09XXXXXXXXX"
                        value={form.contactNumber}
                        onChange={(e) => set('contactNumber', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                    <Field label="Home Phone">
                      <input
                        placeholder="(042) XXX-XXXX"
                        value={form.homePhone}
                        onChange={(e) => set('homePhone', e.target.value)}
                        className={inCls}
                      />
                    </Field>
                    <Field label="Marital Status">
                      <select
                        value={form.maritalStatus}
                        onChange={(e) => set('maritalStatus', e.target.value)}
                        className={selCls}
                      >
                        {[
                          'Single',
                          'Married',
                          'Widowed',
                          'Separated',
                          'Live-in',
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </FormSection>

                <FormSection title="Volunteering Experience">
                  <p className="-mt-1 mb-1 text-xs text-gray-400">
                    List previous volunteer roles, organizations, and dates
                  </p>
                  <textarea
                    rows={4}
                    placeholder={
                      'e.g. 2022 – BFP Auxiliary Firefighter, Municipality of XYZ\n2021 – Red Cross Youth Chapter, Barangay ABC'
                    }
                    value={form.volunteerExperience}
                    onChange={(e) => set('volunteerExperience', e.target.value)}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder-gray-300 transition focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </FormSection>

                <FormSection title="Family Member Information">
                  <p className="-mt-1 mb-1 text-xs text-gray-400">
                    Name, age, position/title, employer, contact number
                  </p>
                  <textarea
                    rows={3}
                    placeholder="e.g. Maria dela Cruz, 45, Teacher, DepEd XYZ, 09XXXXXXXXX"
                    value={form.familyInfo}
                    onChange={(e) => set('familyInfo', e.target.value)}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder-gray-300 transition focus:border-transparent focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </FormSection>

                <FormSection
                  title={
                    <>
                      <Heart className="h-4 w-4 text-red-400" /> Emergency
                      Contact
                    </>
                  }
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(
                      [
                        {
                          label: 'Name',
                          key: 'emergencyName',
                          ph: 'Full name',
                        },
                        {
                          label: 'Relation',
                          key: 'emergencyRelation',
                          ph: 'e.g. Parent, Sibling',
                        },
                        {
                          label: 'Contact Number',
                          key: 'emergencyContact',
                          ph: '09XXXXXXXXX',
                        },
                        {
                          label: 'Address',
                          key: 'emergencyAddress',
                          ph: 'Street, Barangay',
                        },
                      ] as const
                    ).map((f) => (
                      <Field key={f.key} label={f.label}>
                        <input
                          placeholder={f.ph}
                          value={form[f.key]}
                          onChange={(e) => set(f.key, e.target.value)}
                          className={inCls}
                        />
                      </Field>
                    ))}
                  </div>
                </FormSection>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <StepHeader
                icon={FileText}
                color="orange"
                title="Upload Documents"
                sub="Upload clear copies of the required files — max 5 MB each."
              />

              <div className="space-y-5 p-6 sm:p-8">
                <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3.5">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <p className="text-sm text-blue-600">
                    Accepted formats: PDF, JPG, PNG. All submissions are
                    reviewed by MDRRMO staff.
                  </p>
                </div>

                {(
                  [
                    {
                      label: 'Valid Government ID',
                      desc: "National ID, Voter's ID, Driver's License, or Passport",
                      key: 'validId' as const,
                      icon: IdCard,
                      required: true,
                    },
                    {
                      label: 'Training Certificate',
                      desc: 'Disaster response, first aid, or relevant certification',
                      key: 'trainingCert' as const,
                      icon: FileText,
                      required: true,
                    },
                  ] as const
                ).map((doc) => (
                  <div
                    key={doc.key}
                    className="space-y-4 rounded-lg border border-gray-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                          <doc.icon className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <div className="mb-0.5 flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">
                              {doc.label}
                            </p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${doc.required ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}
                            >
                              {doc.required ? 'Required' : 'Optional'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{doc.desc}</p>
                        </div>
                      </div>
                      {form[doc.key] && (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Uploaded
                        </span>
                      )}
                    </div>

                    {form[doc.key] ? (
                      <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-50 px-4 py-3">
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                        <span className="flex-1 truncate text-xs font-medium text-green-700">
                          {(form[doc.key] as File).name}
                        </span>
                        <button
                          type="button"
                          onClick={() => set(doc.key, null)}
                          className="text-gray-500 transition-colors hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 transition-all hover:border-orange-300 hover:bg-orange-50">
                        <Upload className="h-5 w-5 text-gray-300" />
                        <p className="text-sm text-gray-400">
                          Drag & drop or{' '}
                          <span className="font-semibold text-orange-500">
                            browse files
                          </span>
                        </p>
                        <p className="text-xs text-gray-300">
                          PDF, JPG, PNG — up to 5 MB
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            set(doc.key, e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <StepHeader
                icon={CheckCircle}
                color="green"
                title="Review & Submit"
                sub="Check your information carefully before submitting."
              />

              <div className="space-y-5 p-6 sm:p-8">
                <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3.5">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      Application ready to submit
                    </p>
                    <p className="mt-0.5 text-xs text-green-500">
                      MDRRMO staff will review within 3–5 business days.
                    </p>
                  </div>
                </div>

                {[
                  {
                    label: 'Personal Details',
                    icon: User,
                    rows: [
                      ['Full Name', form.name],
                      ['Gender', form.gender],
                      ['Age', form.age || '—'],
                      ['Date of Birth', form.dob || '—'],
                      ['Nationality', form.nationality],
                      ['Education', form.educationLevel || '—'],
                      ['Marital Status', form.maritalStatus],
                      ['Health Status', form.healthStatus || '—'],
                    ],
                  },
                  {
                    label: 'ID & Contact',
                    icon: IdCard,
                    rows: [
                      ['ID Type', form.idType],
                      ['ID Number', form.idNumber || '—'],
                      ['Address', form.currentAddress || '—'],
                      ['Mobile', form.contactNumber || '—'],
                    ],
                  },
                  {
                    label: 'Emergency Contact',
                    icon: Heart,
                    rows: [
                      ['Name', form.emergencyName || '—'],
                      ['Relation', form.emergencyRelation || '—'],
                      ['Contact #', form.emergencyContact || '—'],
                    ],
                  },
                  {
                    label: 'Documents',
                    icon: FileText,
                    rows: [
                      [
                        'Valid ID',
                        form.validId ? form.validId.name : 'Not uploaded',
                      ],
                      [
                        'Training Cert',
                        form.trainingCert
                          ? form.trainingCert.name
                          : 'Not uploaded',
                      ],
                    ],
                  },
                ].map((sec) => (
                  <div
                    key={sec.label}
                    className="space-y-3 rounded-lg bg-gray-50 p-5"
                  >
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <sec.icon className="h-4 w-4 text-orange-500" />
                      <p className="text-sm font-bold text-gray-800">
                        {sec.label}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                      {sec.rows.map(([l, v]) => (
                        <div key={l}>
                          <p className="text-[11px] font-medium tracking-wide text-gray-400 uppercase">
                            {l}
                          </p>
                          <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                            {v}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-100 pt-6">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.agreed}
                      onChange={(e) => set('agreed', e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-lg border-gray-300 accent-orange-500"
                    />
                    <span className="text-sm leading-relaxed text-gray-600">
                      I certify that all information provided is{' '}
                      <strong className="text-gray-900">
                        true and correct
                      </strong>
                      . I understand that providing false information may result
                      in rejection or cancellation of my application.
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-5 sm:px-8">
            <button
              onClick={() =>
                currentStep > 1 && setCurrentStep((currentStep - 1) as Step)
              }
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep((currentStep + 1) as Step)}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-100 transition-colors hover:bg-orange-600"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.agreed || submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-green-100 transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({
  icon: Icon,
  color,
  title,
  sub,
}: {
  icon: React.ElementType;
  color: 'orange' | 'green';
  title: string;
  sub: string;
}) {
  const bg =
    color === 'green'
      ? 'from-green-500 to-emerald-600'
      : 'from-orange-500 to-red-600';
  return (
    <div className={`bg-linear-to-r ${bg} px-6 py-6 sm:px-8`}>
      <div className="mb-1 flex items-center gap-3">
        <Icon className="h-5 w-5 text-white" />
        <h2 className="text-base font-extrabold text-white">{title}</h2>
      </div>
      <p
        className={`text-xs ${color === 'green' ? 'text-green-100' : 'text-orange-100'}`}
      >
        {sub}
      </p>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {typeof title === 'string' ? (
          <p className="text-sm font-bold text-gray-700">{title}</p>
        ) : (
          <p className="flex items-center gap-2 text-sm font-bold text-gray-700">
            {title}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}

const inCls =
  'w-full h-11 px-4 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition';
const selCls =
  'w-full h-11 px-4 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition appearance-none cursor-pointer';
