'use client';
import {
  Bell,
  Building2,
  CheckCircle,
  Database,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Shield,
  Upload,
  User,
} from 'lucide-react';
import { useState } from 'react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'data', label: 'Data & Reports', icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@mdrrmo.gov.ph',
    phone: '09171234567',
    position: 'System Administrator',
  });

  const [notifications, setNotifications] = useState({
    newApplication: true,
    applicationApproved: true,
    applicationRejected: false,
    trainingSchedule: true,
    systemAlerts: true,
    weeklyReport: false,
    emailNotif: true,
    smsNotif: false,
  });

  const [org, setOrg] = useState({
    name: 'MDRRMO Mansalay',
    address: 'Municipal Hall, Mansalay, Oriental Mindoro',
    email: 'mdrrmo@mansalay.gov.ph',
    phone: '042-123-4567',
    website: 'www.mansalay.gov.ph',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Manage your account and system preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="shrink-0 lg:w-56">
          <nav className="space-y-0.5 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {activeTab === 'profile' && (
            <div>
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-bold text-gray-900">Profile Information</h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Update your personal account details
                </p>
              </div>
              <div className="space-y-6 p-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-300 to-orange-500 text-2xl font-bold text-white">
                    {profile.firstName.charAt(0)}
                  </div>
                  <div>
                    <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </button>
                    <p className="mt-1.5 text-xs text-gray-400">
                      JPG, PNG max 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Mail className="h-3.5 w-3.5" /> Email Address
                    </label>
                    <input
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Phone className="h-3.5 w-3.5" /> Phone Number
                    </label>
                    <input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Position / Role
                    </label>
                    <input
                      value={profile.position}
                      onChange={(e) =>
                        setProfile({ ...profile, position: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-bold text-gray-900">Security Settings</h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Manage your password and security preferences
                </p>
              </div>
              <div className="space-y-6 p-6">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Lock className="h-4 w-4 text-orange-500" /> Change Password
                  </h3>
                  {[
                    {
                      label: 'Current Password',
                      show: showOldPass,
                      toggle: () => setShowOldPass(!showOldPass),
                    },
                    {
                      label: 'New Password',
                      show: showNewPass,
                      toggle: () => setShowNewPass(!showNewPass),
                    },
                    {
                      label: 'Confirm New Password',
                      show: showNewPass,
                      toggle: () => setShowNewPass(!showNewPass),
                    },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={field.show ? 'text' : 'password'}
                          placeholder="••••••••••"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={field.toggle}
                          className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {field.show ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <Shield className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Enable 2FA for added security
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        Protect your account with an authenticator app
                      </div>
                    </div>
                    <button className="shrink-0 text-sm font-medium text-orange-400 hover:text-orange-500">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-bold text-gray-900">
                  Notification Preferences
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Choose what notifications you want to receive
                </p>
              </div>
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Application Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'newApplication',
                        label: 'New volunteer application received',
                      },
                      {
                        key: 'applicationApproved',
                        label: 'Application approved',
                      },
                      {
                        key: 'applicationRejected',
                        label: 'Application rejected',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-xl p-3 hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-700">
                          {item.label}
                        </span>
                        <button
                          onClick={() =>
                            setNotifications({
                              ...notifications,
                              [item.key]:
                                !notifications[
                                  item.key as keyof typeof notifications
                                ],
                            })
                          }
                          className={`relative h-6 w-11 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-orange-500' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}`}
                          ></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    System Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'trainingSchedule',
                        label: 'Training schedule reminders',
                      },
                      {
                        key: 'systemAlerts',
                        label: 'System alerts and maintenance',
                      },
                      { key: 'weeklyReport', label: 'Weekly summary reports' },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-xl p-3 hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-700">
                          {item.label}
                        </span>
                        <button
                          onClick={() =>
                            setNotifications({
                              ...notifications,
                              [item.key]:
                                !notifications[
                                  item.key as keyof typeof notifications
                                ],
                            })
                          }
                          className={`relative h-6 w-11 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-orange-500' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}`}
                          ></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Delivery Channels
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'emailNotif',
                        label: 'Email notifications',
                        desc: profile.email,
                      },
                      {
                        key: 'smsNotif',
                        label: 'SMS notifications',
                        desc: profile.phone,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-xl p-3 hover:bg-gray-50"
                      >
                        <div>
                          <div className="text-sm text-gray-700">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.desc}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications({
                              ...notifications,
                              [item.key]:
                                !notifications[
                                  item.key as keyof typeof notifications
                                ],
                            })
                          }
                          className={`relative h-6 w-11 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-orange-500' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}`}
                          ></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'organization' && (
            <div>
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-bold text-gray-900">
                  Organization Details
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Update MDRRMO organization information
                </p>
              </div>
              <div className="space-y-5 p-6">
                {[
                  { label: 'Organization Name', key: 'name', icon: Building2 },
                  { label: 'Address', key: 'address', icon: MapPin },
                  { label: 'Official Email', key: 'email', icon: Mail },
                  { label: 'Phone Number', key: 'phone', icon: Phone },
                  { label: 'Website', key: 'website', icon: Settings },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <field.icon className="h-3.5 w-3.5" /> {field.label}
                    </label>
                    <input
                      value={org[field.key as keyof typeof org]}
                      onChange={(e) =>
                        setOrg({ ...org, [field.key]: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-bold text-gray-900">Data & Reports</h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Export system data and generate reports
                </p>
              </div>
              <div className="space-y-4 p-6">
                {[
                  {
                    title: 'Export All Volunteers',
                    desc: 'Download complete list of volunteers in CSV or PDF',
                    btn: 'Export CSV',
                  },
                  {
                    title: 'Export Applicants Report',
                    desc: 'Download applicant statistics and status report',
                    btn: 'Export Report',
                  },
                  {
                    title: 'Accreditation Records',
                    desc: 'Export all organization accreditation records',
                    btn: 'Export PDF',
                  },
                  {
                    title: 'Training & Deployment Log',
                    desc: 'Complete history of trainings and deployments',
                    btn: 'Export Log',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {item.desc}
                      </div>
                    </div>
                    <button className="shrink-0 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-500 transition-colors hover:bg-orange-100">
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Settings saved successfully
              </div>
            )}
            {!saved && <div />}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:cursor-pointer hover:bg-orange-300"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
