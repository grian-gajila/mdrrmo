'use client';
import {
  Activity,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  UserCheck,
  UserMinus,
  X,
} from 'lucide-react';
import { useState } from 'react';

const hiredVolunteers = [
  {
    id: 1,
    name: 'Juan DelaCruz',
    email: 'juan@email.com',
    gender: 'Male',
    age: 28,
    currentAddress: 'Brgy. Lumban, Mandalay',
    contactNumber: '09151234567',
    hiredDate: 'June 1, 2026',
    training: 'Basic Life Support, Flood Response',
    deployments: 3,
    status: 'active',
    role: 'Field Responder',
  },
  {
    id: 2,
    name: 'Fitz Andres',
    email: 'fitz@email.com',
    gender: 'Male',
    age: 32,
    currentAddress: 'Zone 2, Mandalay',
    contactNumber: '09271234567',
    hiredDate: 'May 28, 2026',
    training: 'Search and Rescue, First Aid',
    deployments: 5,
    status: 'active',
    role: 'Search & Rescue',
  },
  {
    id: 3,
    name: 'Justin Neypes',
    email: 'justin@email.com',
    gender: 'Male',
    age: 26,
    currentAddress: 'Sitio Pulo, Mandalay',
    contactNumber: '09171256789',
    hiredDate: 'May 20, 2026',
    training: 'Basic Life Support',
    deployments: 1,
    status: 'active',
    role: 'Medical Support',
  },
  {
    id: 4,
    name: 'Dyna Magbago',
    email: 'dyna@email.com',
    gender: 'Female',
    age: 29,
    currentAddress: 'Brgy. Aplaya, Mandalay',
    contactNumber: '09451234567',
    hiredDate: 'May 15, 2026',
    training: 'Psychosocial Support, First Aid',
    deployments: 2,
    status: 'inactive',
    role: 'Psychosocial Support',
  },
  {
    id: 5,
    name: 'Laeren de Jesus',
    email: 'laeren@email.com',
    gender: 'Female',
    age: 24,
    currentAddress: 'Brgy. Poblacion, Mandalay',
    contactNumber: '09178234567',
    hiredDate: 'June 10, 2026',
    training: 'Flood Response, Logistics',
    deployments: 0,
    status: 'active',
    role: 'Logistics',
  },
];

const roleColors: Record<string, string> = {
  'Field Responder': 'bg-blue-100 text-blue-500',
  'Search & Rescue': 'bg-red-100 text-red-500',
  'Medical Support': 'bg-green-100 text-green-500',
  'Psychosocial Support': 'bg-purple-100 text-purple-500',
  'Logistics': 'bg-amber-100 text-amber-500',
};

export default function VolunteersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<(typeof hiredVolunteers)[0] | null>(
    null,
  );
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);

  const filtered = hiredVolunteers.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hired Volunteers</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage deployed and active MDRRMO volunteers
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: 'Total Hired',
            value: hiredVolunteers.length,
            icon: UserCheck,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
          },
          {
            label: 'Active',
            value: hiredVolunteers.filter((v) => v.status === 'active').length,
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Inactive',
            value: hiredVolunteers.filter((v) => v.status === 'inactive')
              .length,
            icon: UserMinus,
            color: 'text-gray-600',
            bg: 'bg-gray-100',
          },
          {
            label: 'Total Deployments',
            value: hiredVolunteers.reduce((acc, v) => acc + v.deployments, 0),
            icon: Award,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div
              className={`h-10 w-10 ${s.bg} flex shrink-0 items-center justify-center rounded-xl`}
            >
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volunteers..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filter by Role
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Volunteer
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Hired Date
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Deployments
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((volunteer) => (
                <tr
                  key={volunteer.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-300 to-orange-500 text-sm font-semibold text-white">
                        {volunteer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {volunteer.name}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {volunteer.contactNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleColors[volunteer.role] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {volunteer.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {volunteer.hiredDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${volunteer.deployments > 0 ? 'text-orange-500' : 'text-gray-400'}`}
                      >
                        {volunteer.deployments}
                      </span>
                      <span className="text-xs text-gray-400">missions</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        volunteer.status === 'active'
                          ? 'bg-green-100 text-green-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${volunteer.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}
                      ></span>
                      {volunteer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelected(volunteer)}
                        className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-500 transition-colors hover:bg-orange-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === volunteer.id
                                ? null
                                : volunteer.id,
                            )
                          }
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {actionMenuId === volunteer.id && (
                          <div className="absolute top-full right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                              <Activity className="h-4 w-4" />
                              View Record
                            </button>
                            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                              <UserMinus className="h-4 w-4" />
                              Deactivate
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
            Showing {filtered.length} of {hiredVolunteers.length} volunteers
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
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

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-300 to-orange-500 text-lg font-bold text-white">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{selected.name}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[selected.role] || 'bg-gray-100 text-gray-500'}`}
                  >
                    {selected.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="mb-0.5 text-xs text-gray-400">Status</div>
                  <div
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${selected.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${selected.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}
                    ></span>
                    {selected.status === 'active'
                      ? 'Active Volunteer'
                      : 'Inactive'}
                  </div>
                </div>
                <div className="rounded-xl bg-orange-50 p-3">
                  <div className="mb-0.5 text-xs text-gray-400">
                    Deployments
                  </div>
                  <div className="text-sm font-bold text-orange-500">
                    {selected.deployments} missions completed
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { label: 'Email', value: selected.email, icon: UserCheck },
                  {
                    label: 'Contact',
                    value: selected.contactNumber,
                    icon: Phone,
                  },
                  {
                    label: 'Address',
                    value: selected.currentAddress,
                    icon: MapPin,
                  },
                  {
                    label: 'Hired Date',
                    value: selected.hiredDate,
                    icon: Calendar,
                  },
                ].map((field) => (
                  <div key={field.label} className="rounded-xl bg-gray-50 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-400">
                      <field.icon className="h-3 w-3" /> {field.label}
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    Training Completed
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.training.split(', ').map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Close
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100">
                <UserMinus className="h-4 w-4" /> Deactivate Volunteer
              </button>
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
