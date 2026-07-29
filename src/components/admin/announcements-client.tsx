'use client';
import {
  PREDEFINED_TAGS,
  typeConfig,
} from '@/data/volunteer/announcements-type-config';
import { AnnouncementInput, announcementSchema } from '@/lib/validation/schema';
import { Announcement } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  ChevronDown,
  Clock,
  Edit2,
  Eye,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ShieldSpinLoader } from '../custom/loading';

export function AnnouncementsClient({
  announcements,
  openComposer: defaultOpen,
}: {
  announcements: Announcement[];
  openComposer: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showComposer, setShowComposer] = useState(defaultOpen);
  const [viewAnn, setViewAnn] = useState<Announcement | null>(null);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [repeatOn, setRepeatOn] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { type: 'info', tags: [], repeatBroadcast: false },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchType = watch('type') ?? 'info';
  const watchTitle = watch('title') ?? '';
  const watchBody = watch('body') ?? '';

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const onSubmit = async (data: AnnouncementInput) => {
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tags, repeatBroadcast: repeatOn }),
    });

    if (!res.ok) {
      toast.error('Failed to create announcement');
      return;
    }

    toast.success('Announcement published!');
    reset();
    setTags([]);
    setRepeatOn(false);
    setShowComposer(false);
    startTransition(() => router.refresh());
  };

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto w-full space-y-6 p-6 mb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Create and manage system-wide announcements
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="flex items-center hover:cursor-pointer gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600"
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
                        {((ann.tags as string[]) ?? [])
                          .slice(0, 2)
                          .map((tag: string) => (
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
                        <Calendar className="h-3 w-3" /> Posted{' '}
                        {ann.createdAt
                          ? new Date(ann.createdAt).toLocaleDateString(
                              'en-PH',
                              { dateStyle: 'medium' },
                            )
                          : '—'}
                      </span>
                      {ann.expiresAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires{' '}
                          {new Date(ann.expiresAt).toLocaleDateString('en-PH', {
                            dateStyle: 'medium',
                          })}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 ${ann.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {ann.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button
                      onClick={() => setViewAnn(ann)}
                      className="rounded-lg hover:cursor-pointer bg-blue-50 p-2 text-blue-500 transition-colors hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg hover:cursor-pointer bg-orange-50 p-2 text-orange-500 transition-colors hover:bg-orange-100">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg hover:cursor-pointer bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <Megaphone className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-gray-400">
              No announcements yet. Create your first one.
            </p>
          </div>
        )}
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
                className="rounded-lg p-2 hover:cursor-pointer text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-5">
                <div className="space-y-5 lg:col-span-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Announcement Title
                    </label>
                    <input
                      {...register('title')}
                      placeholder="Enter announcement title..."
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    {errors.title && (
                      <p className="text-xs text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Message Body
                    </label>
                    <textarea
                      {...register('body')}
                      rows={5}
                      placeholder="Write your announcement..."
                      className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                    {errors.body && (
                      <p className="text-xs text-red-600">
                        {errors.body.message}
                      </p>
                    )}
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
                            <label
                              key={type}
                              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${watchType === type ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'border-gray-200 bg-gray-50 text-gray-600'}`}
                            >
                              <input
                                type="radio"
                                {...register('type')}
                                value={type}
                                className="sr-only"
                              />
                              <Icon className="h-4 w-4" />
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
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
                          type="button"
                          className={`rounded-full border hover:cursor-pointer px-3 py-1.5 text-xs font-medium transition-all ${
                            tags.includes(tag)
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
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Add custom tag..."
                        className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customTag.trim()) {
                            toggleTag(customTag.trim());
                            setCustomTag('');
                          }
                        }}
                        className="rounded-lg hover:cursor-pointer bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-200"
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
                          {...register('expiresAt')}
                          type="date"
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
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
                        type="button"
                        onClick={() => setRepeatOn(!repeatOn)}
                        className={`relative h-6 w-11 hover:cursor-pointer rounded-full transition-colors ${repeatOn ? 'bg-orange-500' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${repeatOn ? 'translate-x-0' : '-translate-x-4'}`}
                        ></span>
                      </button>
                    </div>
                    {repeatOn && (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                          Frequency
                        </label>
                        <div className="relative">
                          <select
                            {...register('broadcastFrequency')}
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

                  {watchTitle && (
                    <div
                      className={`rounded-lg border p-4 ${typeConfig[watchType as keyof typeof typeConfig]?.border ?? 'border-gray-200'} ${typeConfig[watchType as keyof typeof typeConfig]?.bg ?? 'bg-gray-50'}`}
                    >
                      <div className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Preview
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {watchTitle}
                      </div>
                      {watchBody && (
                        <div className="mt-1 line-clamp-3 text-xs text-gray-600">
                          {watchBody}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="sticky bottom-0 flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="rounded-lg bg-gray-100 hover:cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-orange-50 hover:cursor-pointer px-4 py-2.5 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-100"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center  gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-200 transition-colors hover:cursor-pointer hover:bg-orange-300 disabled:opacity-70"
                  >
                    {isPending && (
                      <ShieldSpinLoader size={20} color="text-white" />
                    )}
                    <Megaphone className="h-4 w-4" />
                    Publish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const cfg =
                    typeConfig[viewAnn.type as keyof typeof typeConfig];
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
                onClick={() => setViewAnn(null)}
                className="rounded-lg p-2 hover:cursor-pointer text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {viewAnn.title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {viewAnn.body}
              </p>
              {((viewAnn.tags as string[]) ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(viewAnn.tags as string[]).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Posted</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-800">
                    {viewAnn.createdAt
                      ? new Date(viewAnn.createdAt).toLocaleDateString(
                          'en-PH',
                          { dateStyle: 'medium' },
                        )
                      : '—'}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-400">Expires</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-800">
                    {viewAnn.expiresAt
                      ? new Date(viewAnn.expiresAt).toLocaleDateString(
                          'en-PH',
                          { dateStyle: 'medium' },
                        )
                      : '—'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setViewAnn(null)}
                className="rounded-lg hover:cursor-pointer bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Close
              </button>
              <button className="flex hover:cursor-pointer items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100">
                <Edit2 className="h-4 w-4" /> Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
