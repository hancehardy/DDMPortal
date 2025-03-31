import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-6">Welcome to DDM Cabinet Door Portal</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your one-stop solution for ordering custom cabinet doors
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">Why Choose DDM Cabinet Doors?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-600 mb-2">Quality Materials</h3>
                  <p className="text-gray-600">
                    We use only the finest materials to ensure your cabinet doors last for years to come.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-600 mb-2">Custom Designs</h3>
                  <p className="text-gray-600">
                    Choose from a variety of styles, finishes, and options to match your unique design needs.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-medium text-blue-600 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">
                    Quick turnaround times and reliable shipping to get your project completed on schedule.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <Link 
                href="/order" 
                className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Start New Order
              </Link>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Need Help?</h2>
              <p className="text-gray-700 mb-4">
                Our customer service team is ready to assist you with any questions about your order.
              </p>
              <p className="text-blue-600 font-medium">
                Contact us at: support@ddmcabinetdoors.com
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
