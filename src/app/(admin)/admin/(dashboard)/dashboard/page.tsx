'use client';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  MoreHorizontal,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const stats = [
  {
    label: 'Accredited Organizations',
    value: '12',
    change: '+2 this month',
    positive: true,
    icon: Building2,
    color: 'bg-blue-500',
    light: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    label: 'Active Volunteers',
    value: '5',
    change: '+1 this week',
    positive: true,
    icon: UserCheck,
    color: 'bg-green-500',
    light: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    label: 'Pending Applications',
    value: '11',
    change: 'Needs review',
    positive: false,
    icon: Clock,
    color: 'bg-amber-500',
    light: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    label: 'Total Applicants',
    value: '28',
    change: '+5 this month',
    positive: true,
    icon: Users,
    color: 'bg-purple-500',
    light: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
];

const recentApplicants = [
  {
    name: 'Justine Rey L. Lagahit',
    date: 'June 19, 2026',
    status: 'pending',
    type: 'Volunteer',
  },
  {
    name: 'Laeren de Jesus',
    date: 'June 18, 2026',
    status: 'pending',
    type: 'Volunteer',
  },
  {
    name: 'Gina Mae Magango',
    date: 'June 18, 2026',
    status: 'approved',
    type: 'Volunteer',
  },
  {
    name: 'Jairus Fetalvero',
    date: 'June 17, 2026',
    status: 'pending',
    type: 'Volunteer',
  },
  {
    name: 'Arjay Catoy',
    date: 'June 16, 2026',
    status: 'rejected',
    type: 'Volunteer',
  },
];

const upcomingEvents = [
  {
    title: 'Basic Life Support Training',
    date: 'June 25, 2026',
    participants: 12,
    type: 'Training',
  },
  {
    title: 'Flood Response Drill',
    date: 'July 2, 2026',
    participants: 20,
    type: 'Drill',
  },
  {
    title: 'Volunteer Orientation',
    date: 'July 8, 2026',
    participants: 8,
    type: 'Orientation',
  },
];

const statusConfig = {
  pending: { label: 'Pending', class: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Approved', class: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700' },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'events'>('recent');

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Friday, June 19, 2026 — Welcome back, Admin
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <FileText className="h-4 w-4" />
            Export Report
          </button>
          <Link
            href="/admin/applicants"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-300"
          >
            <Users className="h-4 w-4" />
            View All Applicants
          </Link>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">
            11 applications awaiting review
          </p>
          <p className="mt-0.5 text-xs text-amber-600">
            Review and process pending volunteer applications to keep the system
            up to date.
          </p>
        </div>
        <Link
          href="/admin/applicants"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
        >
          Review now <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`h-11 w-11 ${stat.light} flex items-center justify-center rounded-xl`}
              >
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-amber-600'}`}
              >
                {stat.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <Activity className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div className="flex gap-1">
              {(['recent', 'events'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'recent' ? 'Recent Applicants' : 'Upcoming Events'}
                </button>
              ))}
            </div>
            <Link
              href="/admin/applicants"
              className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-300"
            >
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {activeTab === 'recent' ? (
            <div className="divide-y divide-gray-50">
              {recentApplicants.map((applicant, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-300 to-orange-500 text-sm font-semibold text-white">
                    {applicant.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {applicant.name}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {applicant.date} · {applicant.type}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[applicant.status as keyof typeof statusConfig].class}`}
                  >
                    {
                      statusConfig[
                        applicant.status as keyof typeof statusConfig
                      ].label
                    }
                  </span>
                  <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-orange-50">
                    <Calendar className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {event.title}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {event.date}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-medium text-gray-700">
                      {event.participants} participants
                    </div>
                    <div className="mt-0.5 text-xs text-orange-500">
                      {event.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: 'Review Pending Applications',
                  href: '/admin/applicants',
                  icon: Clock,
                  badge: '11',
                },
                {
                  label: 'Create Announcement',
                  href: '/admin/announcements',
                  icon: TrendingUp,
                },
                {
                  label: 'View Hired Volunteers',
                  href: '/admin/volunteers',
                  icon: UserCheck,
                },
                {
                  label: 'System Settings',
                  href: '/admin/settings',
                  icon: Building2,
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-orange-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-orange-500">
                    <action.icon className="h-4 w-4 text-orange-500 transition-colors group-hover:text-white" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                  {action.badge && (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                      {action.badge}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-orange-500" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-orange-300 to-orange-500 p-5 text-white">
            <h3 className="mb-1 text-sm font-semibold">Monthly Summary</h3>
            <p className="mb-4 text-xs text-orange-100">
              June 2026 performance overview
            </p>
            <div className="space-y-3">
              {[
                { label: 'Applications received', value: '28' },
                { label: 'Applications approved', value: '5' },
                { label: 'Trainings conducted', value: '3' },
                { label: 'Deployments', value: '2' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-orange-100">{item.label}</span>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
