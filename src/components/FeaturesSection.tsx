'use client';

const features = [
  {
    icon: '🗣️',
    title: 'Voice Interface',
    description: 'Speak your needs in your language and get instant assistance',
  },
  {
    icon: '📋',
    title: 'Easy Applications',
    description: 'Apply for government schemes without complex paperwork',
  },
  {
    icon: '🚨',
    title: 'Quick Complaints',
    description: 'File and track civic complaints in real-time',
  },
  {
    icon: '🏆',
    title: 'Fair Allocation',
    description: 'AI ensures unbiased distribution of tasks to officials',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need to engage with civic governance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}