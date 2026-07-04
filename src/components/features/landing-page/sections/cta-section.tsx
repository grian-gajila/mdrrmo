import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="mb-20 md:rounded-lg lg:rounded-lg bg-orange-500 px-6 py-16 lg:mx-6 md:mx-6">
      <div className="mx-auto max-w-xl space-y-5 text-center">
        <h2 className="text-3xl font-extrabold text-white">
          Ready to make a difference?
        </h2>
        <p className="text-sm text-orange-100">
          Join over 200 volunteers already protecting lives in our municipality.
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
  );
};

export default CtaSection;
