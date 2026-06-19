'use client';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Heart,
  IdCard,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const applicants = [
  {
    id: 1,
    name: 'Justine Rey L. Lagahit',
    email: 'justine@email.com',
    gender: 'Male',
    age: 21,
    nationality: 'Filipino',
    nativePlace: 'Tagalog',
    educationLevel: 'Further Education',
    politicalStatus: 'Governance',
    dob: 'April 28, 2005',
    healthStatus: 'Good',
    idNumber: '274-8264-094-245',
    idCardAddress: 'National ID',
    currentAddress: 'Sitio, Aplaya, DonPedro',
    contactNumber: '09150636943',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'John Rave L. Lagahit',
      relation: 'Older Brother',
      contact: '09123812523',
      address: 'Sitio, Aplaya, DonPedro',
    },
    status: 'pending',
    appliedDate: 'June 19, 2026',
    documents: ['Valid ID', 'Training Certificate'],
  },
  {
    id: 2,
    name: 'Laeren de Jesus',
    email: 'laeren@email.com',
    gender: 'Female',
    age: 24,
    nationality: 'Filipino',
    nativePlace: 'Batangas',
    educationLevel: 'College Graduate',
    politicalStatus: 'Civilian',
    dob: 'March 12, 2002',
    healthStatus: 'Good',
    idNumber: '112-4523-887-001',
    idCardAddress: 'National ID',
    currentAddress: 'Brgy. Poblacion, Mansalay',
    contactNumber: '09178234567',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Maria de Jesus',
      relation: 'Mother',
      contact: '09456789012',
      address: 'Brgy. Poblacion, Mansalay',
    },
    status: 'pending',
    appliedDate: 'June 18, 2026',
    documents: ['Valid ID', 'Training Certificate'],
  },
  {
    id: 3,
    name: 'Gina Mae Magango',
    email: 'gina@email.com',
    gender: 'Female',
    age: 27,
    nationality: 'Filipino',
    nativePlace: 'Cavite',
    educationLevel: 'College Graduate',
    politicalStatus: 'Civilian',
    dob: 'January 5, 1999',
    healthStatus: 'Excellent',
    idNumber: '334-1122-445-223',
    idCardAddress: 'National ID',
    currentAddress: 'Phase 1 Subdivision, Mansalay',
    contactNumber: '09991234567',
    maritalStatus: 'Married',
    emergencyContact: {
      name: 'Ben Magango',
      relation: 'Husband',
      contact: '09881234567',
      address: 'Phase 1 Subdivision, Mansalay',
    },
    status: 'approved',
    appliedDate: 'June 18, 2026',
    documents: ['Valid ID', 'Barangay Clearance'],
  },
  {
    id: 4,
    name: 'Jairus Fetalvero',
    email: 'jairus@email.com',
    gender: 'Male',
    age: 23,
    nationality: 'Filipino',
    nativePlace: 'Laguna',
    educationLevel: 'College Graduate',
    politicalStatus: 'Civilian',
    dob: 'September 8, 2003',
    healthStatus: 'Good',
    idNumber: '556-9987-332-445',
    idCardAddress: "Voter's ID",
    currentAddress: 'Sitio Pulo, Mansalay',
    contactNumber: '09171234567',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Ricardo Fetalvero',
      relation: 'Father',
      contact: '09161234567',
      address: 'Sitio Pulo, Mansalay',
    },
    status: 'pending',
    appliedDate: 'June 17, 2026',
    documents: ['Valid ID', 'Medical Certificate'],
  },
  {
    id: 5,
    name: 'Arjay Catoy',
    email: 'arjay@email.com',
    gender: 'Male',
    age: 30,
    nationality: 'Filipino',
    nativePlace: 'Quezon',
    educationLevel: 'Vocational',
    politicalStatus: 'Civilian',
    dob: 'May 14, 1996',
    healthStatus: 'Good',
    idNumber: '778-3344-991-667',
    idCardAddress: 'National ID',
    currentAddress: 'Brgy. San Juan, Mandalay',
    contactNumber: '09981234567',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Lina Catoy',
      relation: 'Mother',
      contact: '09351234567',
      address: 'Brgy. San Juan, Mansalay',
    },
    status: 'rejected',
    appliedDate: 'June 16, 2026',
    documents: ['Valid ID'],
  },
  {
    id: 6,
    name: 'Rio Faderanga',
    email: 'rio@email.com',
    gender: 'Male',
    age: 25,
    nationality: 'Filipino',
    nativePlace: 'Rizal',
    educationLevel: 'College Graduate',
    politicalStatus: 'Civilian',
    dob: 'August 22, 2001',
    healthStatus: 'Good',
    idNumber: '991-5566-123-889',
    idCardAddress: 'National ID',
    currentAddress: 'Zone 3, Mansalay',
    contactNumber: '09125679012',
    maritalStatus: 'Single',
    emergencyContact: {
      name: 'Cesar Faderanga',
      relation: 'Father',
      contact: '09275679012',
      address: 'Zone 3, Mansalay',
    },
    status: 'pending',
    appliedDate: 'June 15, 2026',
    documents: ['Valid ID', 'Training Certificate'],
  },
];

const statusConfig = {
  pending: {
    label: 'Pending',
    class: 'bg-amber-100 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  approved: {
    label: 'Approved',
    class: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    class: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
};

export default function ApplicantsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState<
    (typeof applicants)[0] | null
  >(null);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);

  const filtered = applicants.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: applicants.length,
    pending: applicants.filter((a) => a.status === 'pending').length,
    approved: applicants.filter((a) => a.status === 'approved').length,
    rejected: applicants.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Review and manage volunteer applications
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export List
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filterStatus === tab
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${filterStatus === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants by name..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Applicant
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Applied Date
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Documents
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-300 to-orange-500 text-sm font-semibold text-white">
                        {applicant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {applicant.name}
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
                      {applicant.currentAddress.split(',')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {applicant.appliedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[applicant.status as keyof typeof statusConfig].class}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusConfig[applicant.status as keyof typeof statusConfig].dot}`}
                      ></span>
                      {
                        statusConfig[
                          applicant.status as keyof typeof statusConfig
                        ].label
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {applicant.documents.map((doc) => (
                        <span
                          key={doc}
                          className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedApplicant(applicant)}
                        className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-500 transition-colors hover:bg-orange-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === applicant.id
                                ? null
                                : applicant.id,
                            )
                          }
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {actionMenuId === applicant.id && (
                          <div className="absolute top-full right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-green-500 transition-colors hover:bg-green-50">
                              <CheckCircle className="h-4 w-4" /> Approve
                            </button>
                            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50">
                              <XCircle className="h-4 w-4" /> Reject
                            </button>
                            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-amber-500 transition-colors hover:bg-amber-50">
                              <Clock className="h-4 w-4" /> Set Pending
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <span className="text-sm text-gray-500">
            Showing {filtered.length} of {applicants.length} applicants
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white">
              1
            </span>
            <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-300 to-orange-500 font-bold text-white">
                  {selectedApplicant.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    {selectedApplicant.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Volunteer Application · {selectedApplicant.appliedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[selectedApplicant.status as keyof typeof statusConfig].class}`}
                >
                  {
                    statusConfig[
                      selectedApplicant.status as keyof typeof statusConfig
                    ].label
                  }
                </span>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100">
                    <User className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Gender', value: selectedApplicant.gender },
                    {
                      label: 'Age',
                      value: `${selectedApplicant.age} years old`,
                    },
                    { label: 'Date of Birth', value: selectedApplicant.dob },
                    {
                      label: 'Nationality',
                      value: selectedApplicant.nationality,
                    },
                    {
                      label: 'Native Place',
                      value: selectedApplicant.nativePlace,
                    },
                    {
                      label: 'Education Level',
                      value: selectedApplicant.educationLevel,
                    },
                    {
                      label: 'Political Status',
                      value: selectedApplicant.politicalStatus,
                    },
                    {
                      label: 'Health Status',
                      value: selectedApplicant.healthStatus,
                    },
                    {
                      label: 'Marital Status',
                      value: selectedApplicant.maritalStatus,
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="rounded-xl bg-gray-50 p-3"
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
                    Identification & Address
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="mb-0.5 text-xs text-gray-400">
                      ID Number
                    </div>
                    <div className="font-mono text-sm font-semibold text-gray-800">
                      {selectedApplicant.idNumber}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="mb-0.5 text-xs text-gray-400">
                      ID Card Type
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {selectedApplicant.idCardAddress}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                    <div className="mb-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" /> Current Address
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {selectedApplicant.currentAddress}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <div className="mb-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                      <Phone className="h-3 w-3" /> Contact Number
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {selectedApplicant.contactNumber}
                    </div>
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
                      value: selectedApplicant.emergencyContact.name,
                    },
                    {
                      label: 'Relation',
                      value: selectedApplicant.emergencyContact.relation,
                    },
                    {
                      label: 'Contact',
                      value: selectedApplicant.emergencyContact.contact,
                    },
                    {
                      label: 'Address',
                      value: selectedApplicant.emergencyContact.address,
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="rounded-xl border border-red-100 bg-red-50/50 p-3"
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
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100">
                    <FileText className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-bold tracking-wide text-gray-900 uppercase">
                    Submitted Documents
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selectedApplicant.documents.map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {doc}
                        </div>
                        <div className="text-xs text-green-600">Submitted</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between rounded-b-2xl border-t border-gray-100 bg-white px-6 py-4">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Close
              </button>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100">
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-green-200 transition-colors hover:bg-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {actionMenuId !== null && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActionMenuId(null)}
        />
      )}
    </div>
  );
}
