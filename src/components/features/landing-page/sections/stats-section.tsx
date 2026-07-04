const StatsSection = () => {
  return (
    <section className="mb-20 rounded-lg bg-orange-500 px-6 mx-6 py-4">
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
  );
};

export default StatsSection;
