'use client';
import { LandingPage } from '@/components/features/landing-page';
import { Award, ChevronRight, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="h-screen bg-white font-sans antialiased">
      <LandingPage.NavBar />
      <LandingPage.HeroSection />
      <section className="mb-20 rounded-lg bg-orange-500 px-6 py-4">
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
      <LandingPage.ProcessSection />
      <LandingPage.RequirementsSection />
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
                className="group rounded-lg border border-gray-100 p-6 transition-all hover:border-orange-200 hover:shadow-md"
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

      <section className="mb-20 rounded-lg bg-orange-500 px-6 py-16">
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
            className="inline-flex items-center gap-2 rounded-lg  bg-white px-7 py-3.5 text-sm font-extrabold text-orange-500 transition-all hover:bg-orange-50"
          >
            Start Your Application
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <LandingPage.Footer />
    </div>
  );
}
