'use client';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="h-screen bg-white font-sans antialiased">
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold text-gray-900">MDRRMO</p>
              <p className="mt-px text-[10px] text-gray-400">
                Volunteer Portal
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 sm:flex">
            {['How It Works', 'Requirements', 'Contact'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-gray-500 transition-colors hover:text-orange-500"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      <section className="relative px-6 pt-20 pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-140 w-140 rounded-full border border-orange-100/70" />
          <div className="absolute -top-20 -right-20 h-90 w-90 rounded-full border border-orange-200/50" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5">
            <Shield className="h-3 w-3 text-orange-500" />
            <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">
              Municipality Disaster Risk Reduction & Management Office
            </span>
          </div>

          <h1 className="mx-auto max-w-3xl text-5xl leading-[1.08] font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Serve your community.{' '}
            <span className="text-orange-500">Become a volunteer.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
            Join MDRRMO&apos;s network of certified disaster responders. Apply
            online, submit your documents, and be ready when your community
            needs you most.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200/60 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Apply as Volunteer
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              Track My Application
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-20 rounded-md bg-orange-500 px-6 py-4">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 text-center text-white sm:grid-cols-4">
          {[
            { value: '200+', label: 'Active Volunteers' },
            { value: '50+', label: 'Partner Organizations' },
            { value: '80+', label: 'Deployments' },
            { value: '15+', label: 'Trainings Held' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black tabular-nums">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-orange-100">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold tracking-widest text-orange-500 uppercase">
              Process
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Three steps to join
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="absolute top-8 right-1/4 left-1/4 hidden h-px bg-gray-200 sm:block" />

            {[
              {
                step: '01',
                title: 'Create an account',
                desc: 'Register with your email or continue with Google. Takes under a minute.',
                icon: Users,
                bg: 'bg-blue-50',
                iconColor: 'text-blue-500',
              },
              {
                step: '02',
                title: 'Fill the application',
                desc: 'Complete your personal information and upload the required documents.',
                icon: FileText,
                bg: 'bg-orange-50',
                iconColor: 'text-orange-500',
              },
              {
                step: '03',
                title: 'Await approval',
                desc: 'Our staff reviews your submission and notifies you within 3–5 business days.',
                icon: CheckCircle,
                bg: 'bg-green-50',
                iconColor: 'text-green-600',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <div className="relative">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg}`}
                  >
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                    {item.step.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="requirements" className="rounded-md bg-gray-100 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold tracking-widest text-orange-500 uppercase">
              Documents
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              What you&apos;ll need
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Prepare these documents before filling out your application
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                icon: IdCard,
                title: 'Valid Government ID',
                desc: "National ID, Voter's ID, Driver's License, or Passport",
                required: true,
              },
              {
                icon: Award,
                title: 'Training Certificate',
                desc: 'Disaster response, first aid, or any relevant certification',
                required: true,
              },
              {
                icon: FileText,
                title: 'Barangay Clearance',
                desc: 'Issued within the last 3 months from your local barangay',
                required: false,
              },
              {
                icon: Heart,
                title: 'Medical Certificate',
                desc: 'Fit-to-work certificate from a licensed physician',
                required: false,
              },
            ].map((req) => (
              <div
                key={req.title}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-orange-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <req.icon className="h-5 w-5 text-orange-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">
                      {req.title}
                    </p>
                    {req.required ? (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-500">
                        Required
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-400">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {req.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs leading-relaxed text-amber-700">
              All documents must be clear and legible. Blurry or incomplete
              submissions will be returned for re-upload.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-bold tracking-widest text-orange-500 uppercase">
              Benefits
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why volunteer with MDRRMO?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                icon: Star,
                title: 'Official Accreditation',
                desc: 'Receive an MDRRMO volunteer ID and certificate recognized by the LGU.',
              },
              {
                icon: Clock,
                title: 'Flexible Commitment',
                desc: "Respond when you're available. We work around your schedule, not the other way around.",
              },
              {
                icon: Award,
                title: 'Free Training Programs',
                desc: 'Access disaster response, first aid, and leadership trainings at no cost.',
              },
            ].map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-gray-100 p-6 transition-all hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 transition-transform group-hover:scale-105">
                  <b.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 text-sm font-bold text-gray-900">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-20 rounded-md bg-orange-500 px-6 py-16">
        <div className="mx-auto max-w-xl space-y-5 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to make a difference?
          </h2>
          <p className="text-sm text-orange-100">
            Join over 200 volunteers already protecting lives in our
            municipality.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-extrabold text-orange-500 transition-all hover:bg-orange-50"
          >
            Start Your Application
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer id="contact" className="rounded-t-md bg-gray-100 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-8 w-8 text-orange-500" />
                <span className="text-lg font-extrabold text-orange-500">
                  MDRRMO
                </span>
              </div>
              <p className="max-w-55 text-xs leading-relaxed text-gray-500">
                Municipality Disaster Risk Reduction and Management Office
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-md mb-4 font-semibold tracking-wide text-gray-500 uppercase">
                Contact Us
              </p>
              {[
                { icon: Mail, text: 'mdrrmo@municipality.gov.ph' },
                { icon: Phone, text: '(042) 123-4567' },
                {
                  icon: MapPin,
                  text: 'Municipal Hall, Ground Floor, Main Office',
                },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0 text-orange-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} MDRRMO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
