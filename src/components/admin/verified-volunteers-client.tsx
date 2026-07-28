'use client';
import { roleColors } from '@/data/admin/volunteer-role-palettes';
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
  Phone,
  Search,
  UserCheck,
  UserMinus,
  X,
} from 'lucide-react';
import { useState } from 'react';

type Volunteer = {
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

export function VerifiedVolunteersClient({
  volunteers,
}: {
  volunteers: Volunteer[];
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Volunteer | null>(null);

  const filtered = volunteers.filter((v) =>
    `${v.firstName} ${v.lastName} ${v.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const counts = {
    total: volunteers.length,
    active: volunteers.filter((v) => v.status === 'active').length,
    inactive: volunteers.filter((v) => v.status === 'inactive').length,
    totalDeployments: volunteers.reduce(
      (acc, v) => acc + (v.deploymentCount ?? 0),
      0,
    ),
  };

  return (
    <div className="mx-auto w-full space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hired Volunteers</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage deployed and active MDRRMO volunteers
          </p>
        </div>
        <button className="flex items-center gap-2 hover:cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: 'Total Hired',
            value: counts.total,
            icon: UserCheck,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
          },
          {
            label: 'Active',
            value: counts.active,
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Inactive',
            value: counts.inactive,
            icon: UserMinus,
            color: 'text-gray-600',
            bg: 'bg-gray-100',
          },
          {
            label: 'Total Deployments',
            value: counts.totalDeployments,
            icon: Award,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div
              className={`h-10 w-10 ${s.bg} flex shrink-0 items-center justify-center rounded-lg`}
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

      <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volunteers..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center hover:cursor-pointer gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filter by Role
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
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
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ">
                        {volunteer.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`${volunteer.avatar}`}
                            alt={`${volunteer.avatar}`}
                            className="rounded-full h-9 w-9 object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {volunteer.firstName}{' '}
                          {volunteer.middleName?.charAt(0)}.{' '}
                          {volunteer.lastName}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {volunteer.contactNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${volunteer.role ? roleColors[volunteer.role] : 'bg-gray-100 text-gray-600'}`}
                    >
                      {volunteer.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {volunteer.hiredAt
                        ? new Date(volunteer.hiredAt).toLocaleDateString(
                            'en-PH',
                            {
                              dateStyle: 'long',
                            },
                          )
                        : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold ${Number(volunteer.deploymentCount) > 0 ? 'text-orange-500' : 'text-gray-400'}`}
                      >
                        {volunteer.deploymentCount}
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
                        className="flex items-center gap-1.5 rounded-lg hover:cursor-pointer bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-500 transition-colors hover:bg-orange-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <span className="text-sm text-gray-500">
            Showing {filtered.length} of {volunteers.length} volunteers
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-gray-200 hover:cursor-pointer p-2 text-gray-500 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white">
              1
            </span>
            <button className="rounded-lg border border-gray-200 hover:cursor-pointer p-2 text-gray-500 hover:bg-gray-50">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg">
                  {selected.avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${selected.avatar}`}
                      alt={`${selected.avatar}`}
                      className="rounded-lg h-12 w-12 object-cover"
                    />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    {selected.firstName} {selected.middleName?.charAt(0)}.{' '}
                    {selected.lastName}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${selected.role ? roleColors[selected.role] : 'bg-gray-100 text-gray-500'}`}
                  >
                    {selected.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-gray-400 hover:cursor-pointer hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3">
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
                <div className="rounded-lg bg-orange-50 p-3">
                  <div className="mb-0.5 text-xs text-gray-400">
                    Deployments
                  </div>
                  <div className="text-sm font-bold text-orange-500">
                    {selected.deploymentCount} missions completed
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
                    value: `${selected.sitio}, ${selected.barangay}, ${selected.municipality}, ${selected.province}`,
                    icon: MapPin,
                  },
                  {
                    label: 'Hired Date',
                    value: selected.hiredAt
                      ? new Date(selected.hiredAt).toLocaleDateString('en-PH', {
                          dateStyle: 'long',
                        })
                      : '—',
                    icon: Calendar,
                  },
                ].map((field) => (
                  <div key={field.label} className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-400">
                      <field.icon className="h-3 w-3" /> {field.label}
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    Training Completed
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selected.trainings as string[]).map((t: string) => (
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
                className="rounded-lg bg-gray-100 px-4 hover:cursor-pointer py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Close
              </button>
              <button className="flex items-center gap-2 hover:cursor-pointer rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-100">
                <UserMinus className="h-4 w-4" /> Deactivate Volunteer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
