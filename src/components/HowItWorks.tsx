'use client';

const steps = [
  {
    number: '01',
    title: 'Speak Your Request',
    description: 'Use your voice to express your needs in any language',
  },
  {
    number: '02',
    title: 'Instant Processing',
    description: 'Our AI understands and processes your request immediately',
  },
  {
    number: '03',
    title: 'Get Connected',
    description: 'Connected with the right government service or official',
  },
  {
    number: '04',
    title: 'Track Progress',
    description: 'Monitor your application or complaint in real-time',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">4 Simple Steps to Get Help</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
              )}

              {/* Card */}
              <div className="relative bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}