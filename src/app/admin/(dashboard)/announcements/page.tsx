'use client';
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Edit2,
  Eye,
  Info,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';

const announcements = [
  {
    id: 1,
    title: 'Upcoming Basic Life Support Training',
    body: 'All registered volunteers are required to attend the Basic Life Support Training on June 25, 2026. Please confirm your attendance by June 22.',
    category: 'Training',
    tags: ['Urgent', 'Training', 'Volunteer'],
    date: 'June 19, 2026',
    expiresAt: 'June 26, 2026',
    status: 'active',
    type: 'urgent',
    views: 45,
  },
  {
    id: 2,
    title: 'New Volunteer Application Portal Now Open',
    body: 'We are now accepting volunteer applications for the second quarter of 2026. Visit our public portal to register and submit your documents.',
    category: 'New Feature',
    tags: ['New Feature', 'Volunteer'],
    date: 'June 15, 2026',
    expiresAt: 'July 15, 2026',
    status: 'active',
    type: 'info',
    views: 128,
  },
  {
    id: 3,
    title: 'Updated Accreditation Requirements',
    body: 'Organizations applying for MDRRMO accreditation must now submit updated certificates of training for their officers. Deadline for submission is July 1, 2026.',
    category: 'Policy Update',
    tags: ['Policy Update', 'Accreditation'],
    date: 'June 10, 2026',
    expiresAt: 'July 5, 2026',
    status: 'active',
    type: 'warning',
    views: 76,
  },
  {
    id: 4,
    title: 'Flood Response Drill on July 2',
    body: 'MDRRMO Mansalay will conduct a flood response simulation drill. Participation is mandatory for all deployed volunteers.',
    category: 'Event',
    tags: ['Event', 'Internal News'],
    date: 'June 5, 2026',
    expiresAt: 'July 3, 2026',
    status: 'active',
    type: 'info',
    views: 92,
  },
];

const typeConfig = {
  urgent: {
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  warning: {
    icon: Bell,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
  },
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
  },
};

const PREDEFINED_TAGS = [
  'Urgent',
  'New Feature',
  'Technical',
  'Policy Update',
  'Internal News',
  'Event',
  'Training',
  'Volunteer',
  'Accreditation',
];

export default function AnnouncementPage() {
  const [showComposer, setShowComposer] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<
    (typeof announcements)[0] | null
  >(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'Info',
    tags: [] as string[],
    customTag: '',
    expiresAt: '',
    expiresTime: '05:00 PM',
    repeatBroadcast: false,
    frequency: 'Weekly',
    type: 'info',
  });

  const toggleTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  };

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Create and manage system-wide announcements
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search announcements..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((ann) => {
          const cfg = typeConfig[ann.type as keyof typeof typeConfig];
          const Icon = cfg.icon;
          return (
            <div
              key={ann.id}
              className={`rounded-lg border bg-white ${cfg.border} overflow-hidden shadow-sm transition-shadow hover:shadow-md`}
            >
              <div
                className={`h-1 ${ann.type === 'urgent' ? 'bg-red-500' : ann.type === 'warning' ? 'bg-amber-500' : ann.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
              ></div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-10 w-10 ${cfg.bg} flex shrink-0 items-center justify-center rounded-xl`}
                  >
                    <Icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <h3 className="text-base font-bold text-gray-900">
                        {ann.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {ann.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {ann.body}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Posted {ann.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Expires {ann.expiresAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {ann.views} views
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button
                      onClick={() => setSelectedAnnouncement(ann)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-500 transition-colors hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-orange-50 p-2 text-orange-500 transition-colors hover:bg-orange-100">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl scrollbar-none overflow-y-auto scroll rounded-2xl bg-white shadow-lg">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-gray-100 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
                  <Megaphone className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">
                    Announcement Composer
                  </h2>
                  <p className="text-xs text-gray-500">
                    Create a new system-wide announcement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComposer(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-5">
              <div className="space-y-5 lg:col-span-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Announcement Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Enter announcement title..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Message Body
                  </label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder="Write your announcement here..."
                    rows={5}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Announcement Type
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(['info', 'urgent', 'warning', 'success'] as const).map(
                      (type) => {
                        const cfg = typeConfig[type];
                        const Icon = cfg.icon;
                        return (
                          <button
                            key={type}
                            onClick={() => setForm({ ...form, type })}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                              form.type === type
                                ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                                : 'border-gray-200 bg-gray-50 text-gray-600'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Tag className="h-3.5 w-3.5" /> Tags
                  </label>
                  <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {PREDEFINED_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          form.tags.includes(tag)
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-orange-500'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={form.customTag}
                      onChange={(e) =>
                        setForm({ ...form, customTag: e.target.value })
                      }
                      placeholder="Add custom tag..."
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (form.customTag.trim()) {
                          toggleTag(form.customTag.trim());
                          setForm({ ...form, customTag: '' });
                        }
                      }}
                      className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-5 lg:col-span-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    Scheduling / Expiry
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Auto-Archive (Expiry Date)
                      </label>
                      <input
                        type="date"
                        value={form.expiresAt}
                        onChange={(e) =>
                          setForm({ ...form, expiresAt: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Expiry Time
                      </label>
                      <div className="relative">
                        <select
                          value={form.expiresTime}
                          onChange={(e) =>
                            setForm({ ...form, expiresTime: e.target.value })
                          }
                          className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                          {[
                            '08:00 AM',
                            '09:00 AM',
                            '10:00 AM',
                            '12:00 PM',
                            '01:00 PM',
                            '03:00 PM',
                            '05:00 PM',
                            '06:00 PM',
                            '08:00 PM',
                          ].map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        Repeat Broadcast
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setForm({
                          ...form,
                          repeatBroadcast: !form.repeatBroadcast,
                        })
                      }
                      className={`relative h-6 w-11 rounded-full transition-colors ${form.repeatBroadcast ? 'bg-orange-500' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.repeatBroadcast ? 'translate-x-6' : 'translate-x-1'}`}
                      ></span>
                    </button>
                  </div>
                  {form.repeatBroadcast && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Frequency
                      </label>
                      <div className="relative">
                        <select
                          value={form.frequency}
                          onChange={(e) =>
                            setForm({ ...form, frequency: e.target.value })
                          }
                          className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                          {['Daily', 'Weekly', 'Bi-weekly', 'Monthly'].map(
                            (f) => (
                              <option key={f}>{f}</option>
                            ),
                          )}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                {form.title && (
                  <div
                    className={`rounded-lg border p-4 ${typeConfig[form.type as keyof typeof typeConfig].border} ${typeConfig[form.type as keyof typeof typeConfig].bg}`}
                  >
                    <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Preview
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {form.title}
                    </div>
                    {form.body && (
                      <div className="mt-1 line-clamp-3 text-xs text-gray-600">
                        {form.body}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-white px-6 py-4">
              <button
                onClick={() => setShowComposer(false)}
                className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button className="rounded-lg bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100">
                  Save Draft
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:cursor-pointer hover:bg-orange-300">
                  <Megaphone className="h-4 w-4" />
                  Schedule Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const cfg =
                    typeConfig[
                      selectedAnnouncement.type as keyof typeof typeConfig
                    ];
                  const Icon = cfg.icon;
                  return (
                    <div
                      className={`h-9 w-9 ${cfg.bg} flex items-center justify-center rounded-xl`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 ${cfg.color}`}
                        style={{ width: '18px', height: '18px' }}
                      />
                    </div>
                  );
                })()}
                <span className="font-bold text-gray-900">
                  Announcement Details
                </span>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedAnnouncement.title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {selectedAnnouncement.body}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedAnnouncement.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Posted</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-800">
                    {selectedAnnouncement.date}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Expires</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-800">
                    {selectedAnnouncement.expiresAt}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Close
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100">
                <Edit2 className="h-4 w-4" /> Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
