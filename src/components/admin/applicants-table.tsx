'use client';
import { statusConfig } from '@/data/admin/status';
import { roleColors, roleIcons } from '@/data/admin/volunteer-role-palettes';
import { FullApplication } from '@/types';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileIcon,
  FileText,
  Filter,
  Heart,
  IdCard,
  LucideIcon,
  MapPin,
  MapPinHouse,
  Phone,
  Search,
  Stethoscope,
  User,
  Workflow,
  X,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldSpinLoader } from '../custom/loading';

export function ApplicantsTable({
  applicants,
  counts,
  currentStatus,
}: {
  applicants: FullApplication[];
  counts: Record<string, number>;
  currentStatus: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FullApplication | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [rejectModal, setRejectModal] = useState<FullApplication | null>(null);
  const [loadingAction, setLoadingAction] = useState<
    'approve' | 'reject' | 'under_review' | null
  >(null);

  const filtered = applicants.filter((a) =>
    `${a.firstName} ${a.lastName} ${a.email} ${a.status} ${statusConfig[a.status].label} `
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleAction = async (
    applicantId: string,
    action: 'approve' | 'reject' | 'under_review',
    notes?: string,
  ) => {
    if (action === 'reject' && rejectNotes.trim() == '') {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    setLoadingAction(action);
    try {
      const res = await fetch(`/api/admin/applicants/${applicantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes }),
      });

      if (!res.ok) {
        toast.error('Action failed. Please try again.');
        return;
      }

      toast.success(
        action === 'approve'
          ? 'Application approved & volunteer hired!'
          : action === 'reject'
            ? 'Application rejected.'
            : 'Marked as under review.',
      );
      setSelected(null);
      setRejectModal(null);
      setActionId(null);
      setLoadingAction(null);
      router.refresh();
    } catch (error) {
      toast.error(`${error}`);
      setLoadingAction(null);
    } finally {
      setLoadingAction(null);
    }
  };

  const Icon = selected?.volunteerRole
    ? roleIcons[selected.volunteerRole]
    : undefined;

  return (
    <div className="mx-auto w-full space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Review and manage volunteer applications
          </p>
        </div>
        <button className="flex items-center gap-2 hover:cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export List
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          ['all', 'pending', 'under_review', 'approved', 'rejected'] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() =>
              router.push(
                tab === 'all'
                  ? '/admin/dashboard/applicants'
                  : `/admin/dashboard/applicants?status=${tab}`,
              )
            }
            className={`flex items-center gap-2 hover:cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              currentStatus === tab
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab === 'all'
              ? 'All'
              : tab.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${currentStatus === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {counts[tab] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants by name..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {[
                  'Applicant',
                  'Contact',
                  'Applied Date',
                  'Status',
                  'Documents',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    No applicants found.
                  </td>
                </tr>
              ) : (
                filtered.map((applicant) => {
                  const cfg = statusConfig[applicant.status];
                  return (
                    <tr
                      key={applicant.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 object-contain items-center justify-center rounded-full">
                            {applicant.photoUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={`${applicant.photoUrl}`}
                                alt={`${applicant.photoUrl}`}
                                className="rounded-full h-9 w-9 object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {applicant.firstName}{' '}
                              {applicant.middleName.charAt(0)}.{' '}
                              {applicant.lastName}
                            </div>
                            <div className="mt-0.5 text-xs text-gray-400">
                              {applicant.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {applicant.contactNumber}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {applicant.barangay}, {applicant.municipality}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {applicant.submittedAt
                            ? new Date(
                                applicant.submittedAt,
                              ).toLocaleDateString('en-PH', {
                                dateStyle: 'long',
                              })
                            : null}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.class}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
                          ></span>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 max-w-60 py-4">
                        <div className="flex items-center gap-1 justify-center flex-wrap">
                          {[
                            {
                              tag: 'Valid Id',
                            },
                            {
                              tag: 'Barangay Clearance',
                            },
                            {
                              tag: 'Training Certificate',
                            },
                            {
                              tag: 'Medical Certificate',
                            },
                          ].map((docs) => (
                            <span
                              key={docs.tag}
                              className="bg-gray-100 text-gray-700 text-[8px] px-2 rounded-full"
                            >
                              {applicant.medicalCertUrl &&
                              applicant.validIdBackUrl &&
                              applicant.validIdFrontUrl &&
                              applicant.trainingCertUrl &&
                              applicant.barangayClearanceUrl
                                ? docs.tag
                                : 'No documents'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 justify-start flex py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelected(applicant)}
                            className="flex items-center gap-1.5 rounded-lg hover:cursor-pointer bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-500 transition-colors hover:bg-orange-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <span className="text-sm text-gray-500">
            Showing {filtered.length} of {applicants.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border hover:cursor-pointer border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg hover:cursor-pointer bg-orange-500 px-3 py-1.5 text-sm font-medium text-white">
              1
            </span>
            <button
              className="rounded-lg border hover:cursor-pointer border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full scrollbar-none max-w-3xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-100 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg ">
                  {selected.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${selected.photoUrl}`}
                      alt={`${selected.photoUrl}`}
                      className="rounded-lg h-12 w-12 object-cover"
                    />
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-xl text-gray-900">
                    {selected.firstName} {selected.middleName.charAt(0)}.{' '}
                    {selected.lastName}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Volunteer Application ·{' '}
                    {selected.submittedAt
                      ? new Date(selected.submittedAt).toLocaleDateString(
                          'en-PH',
                          {
                            dateStyle: 'long',
                          },
                        )
                      : null}
                  </p>
                </div>
              </div>
              <div className="flex items-center  gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[selected.status as keyof typeof statusConfig].class}`}
                >
                  {
                    statusConfig[selected.status as keyof typeof statusConfig]
                      .label
                  }
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-2 text-gray-400 hover:cursor-pointer transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100">
                      <User className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                      Personal Information
                    </h3>
                  </div>
                  <div
                    className={`px-4 py-1 rounded-full flex items-center gap-2 text-xs ${roleColors[selected.volunteerRole]}`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {selected.volunteerRole}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Gender', value: selected.gender },
                    {
                      label: 'Age',
                      value: `${selected.age} years old`,
                    },
                    { label: 'Date of Birth', value: selected.dateOfBirth },
                    {
                      label: 'Nationality',
                      value: selected.nationality,
                    },
                    {
                      label: 'Native Language',
                      value: selected.nativePlace,
                    },
                    {
                      label: 'Education Level',
                      value: selected.educationLevel,
                    },
                    {
                      label: 'Political Status',
                      value: selected.politicalStatus,
                    },
                    {
                      label: 'Health Status',
                      value: selected.healthStatus,
                    },
                    {
                      label: 'Marital Status',
                      value: selected.maritalStatus,
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="rounded-lg bg-gray-50 p-3"
                    >
                      <div className="mb-0.5 text-xs text-gray-400">
                        {field.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
                    <IdCard className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                    Identification
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-0.5 text-xs text-gray-400">
                      ID Number
                    </div>
                    <div className="font-mono text-sm font-semibold text-gray-800">
                      {selected.idNumber}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-0.5 text-xs text-gray-400">
                      ID Card Type
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {selected.idCardType}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
                    <MapPinHouse className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                    Contact & Address
                  </h3>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
                  <div className="mb-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" /> Current Address
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {selected.sitio}, {selected.barangay},{' '}
                    {selected.municipality}, {selected.province}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="mb-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                    <Phone className="h-3 w-3" /> Contact Number
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {selected.contactNumber}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-100">
                    <Heart className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                    Emergency Contact
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      label: 'Name',
                      value: selected.emergencyContact?.name,
                    },
                    {
                      label: 'Relation',
                      value: selected.emergencyContact?.relation,
                    },
                    {
                      label: 'Contact',
                      value: selected.emergencyContact?.contactNumber,
                    },
                    {
                      label: 'Address',
                      value: selected.emergencyContact?.address,
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="rounded-lg border border-red-100 bg-red-50/50 p-3"
                    >
                      <div className="mb-0.5 text-xs text-gray-400">
                        {field.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
                    <Workflow className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                    Experience
                  </h3>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
                  <div className="mb-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPinHouse className="h-3 w-3" /> Volunteering Experience
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {selected.volunteeringExperience}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100">
                    <FileText className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                    Submitted Documents
                  </h3>
                </div>

                <DocumentReview
                  docs={{
                    validIdFrontUrl: selected.validIdFrontUrl,
                    validIdBackUrl: selected.validIdBackUrl,
                    trainingCertUrls: selected.trainingCertUrl,
                    barangayClearanceUrl: selected.barangayClearanceUrl,
                    medicalCertUrls: selected.medicalCertUrl,
                  }}
                />
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-white px-6 py-4">
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg bg-gray-100 px-4 hover:cursor-pointer py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Close
              </button>
              {statusConfig[selected.status as keyof typeof statusConfig]
                .label !== 'Approved' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleAction(selected.id, 'under_review');
                      setActionId(null);
                    }}
                    disabled={loadingAction !== null}
                    className={`flex w-full hover:cursor-pointer rounded-lg transition-colors bg-blue-50 items-center gap-2 px-4 py-2 font-medium text-sm text-blue-500 hover:bg-blue-100 ${statusConfig[selected.status as keyof typeof statusConfig].label === 'Rejected' && 'hidden'}`}
                  >
                    {loadingAction === 'under_review' ? (
                      <ShieldSpinLoader size={20} color="text-blue-500" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    Under Review
                  </button>
                  <button
                    onClick={() => {
                      setRejectModal(selected);
                      setSelected(null);
                    }}
                    disabled={loadingAction !== null}
                    className={`flex items-center gap-2 hover:cursor-pointer rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100 ${statusConfig[selected.status as keyof typeof statusConfig].label === 'Rejected' && 'hidden'}`}
                  >
                    {loadingAction === 'reject' ? (
                      <ShieldSpinLoader size={20} color="text-red-500" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, 'approve')}
                    disabled={loadingAction !== null}
                    className={`flex items-center gap-2 hover:cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-green-200 transition-colors hover:bg-green-600 ${statusConfig[selected.status as keyof typeof statusConfig].label === 'Rejected' && 'hidden'}`}
                  >
                    {loadingAction === 'approve' ? (
                      <ShieldSpinLoader size={20} color="text-white" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="font-bold text-gray-900">Reject Application</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {rejectModal.firstName} {rejectModal.lastName}
              </p>
            </div>
            <div className="p-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Reason for rejection{' '}
                <span className="text-red-500">(required *)</span>
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={4}
                required
                placeholder="Explain why the application is being rejected. This will be included in the notification email."
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectNotes('');
                }}
                className="rounded-lg bg-gray-100 hover:cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleAction(rejectModal.id, 'reject', rejectNotes)
                }
                className="flex items-center gap-2 hover:cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-70 transition-colors"
              >
                {loadingAction === 'reject' ? (
                  <ShieldSpinLoader size={20} color="text-white" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {actionId && (
        <div className="fixed inset-0 z-10" onClick={() => setActionId(null)} />
      )}
    </div>
  );
}

interface DocumentSet {
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
