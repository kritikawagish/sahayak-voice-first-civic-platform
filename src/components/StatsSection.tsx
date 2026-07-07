'use client';

const stats = [
  { label: 'Active Citizens', value: '50K+' },
  { label: 'Complaints Resolved', value: '10K+' },
  { label: 'Applications Processed', value: '25K+' },
  { label: 'Languages Supported', value: '15+' },
];

export default function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}