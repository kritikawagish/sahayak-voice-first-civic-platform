'use client';

export default function CTASection() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h2>
        <p className="text-xl text-gray-600 mb-8">Join thousands of citizens already using Sahayak to access government services</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg">
            Start Now
          </button>
          <button className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition font-semibold text-lg">
            Contact Us
          </button>
        </div>

        <div className="mt-12 pt-12 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Questions? We're here to help</p>
          <p className="text-lg text-gray-900 font-semibold">support@sahayak.gov.in</p>
        </div>
      </div>
    </section>
  );
}