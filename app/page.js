/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GdWYqFo4TA7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

export default function Component() {
  const currentYear = new Date().getFullYear();
  const futureYears = [currentYear, currentYear + 1, currentYear + 2];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full h-[90vh] bg-[url('/mmr_bg.png')] bg-cover bg-center relative">
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

          <div className="relative h-full w-full flex flex-col items-center justify-center text-white">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
                Matri Mirra Residency
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience luxurious living in the heart of the city. Where
                comfort, convenience, and community come together to create the
                perfect living experience.
              </p>

              {/* Current Year Navigation */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  🎉 Current Festival Management
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/2025/vinayaka-chavithi"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl transform hover:scale-105"
                  >
                    <span className="mr-3 text-2xl">🕉️</span>
                    <div className="text-left">
                      <div className="text-lg">Vinayaka Chavithi</div>
                      <div className="text-sm opacity-90">2025 Festival</div>
                    </div>
                    <span className="ml-4 text-xl">→</span>
                  </a>

                  <a
                    href="/2025/expenses"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-xl transform hover:scale-105"
                  >
                    <span className="mr-3 text-2xl">💰</span>
                    <div className="text-left">
                      <div className="text-lg">Festival Expenses</div>
                      <div className="text-sm opacity-90">2025 Management</div>
                    </div>
                    <span className="ml-4 text-xl">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Events Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                📅 Future Festival Planning
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Plan and manage upcoming festivals with our comprehensive
                management system. Stay organized and ensure successful
                celebrations for years to come.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureYears.map((year) => (
                <div
                  key={year}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">🎊</div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {year}
                      </h3>
                      <p className="text-gray-600">Festival Season</p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={`/${year}/vinayaka-chavithi`}
                        className="block w-full text-center py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                      >
                        <span className="mr-2">🕉️</span>
                        Vinayaka Chavithi
                      </a>

                      <a
                        href={`/${year}/expenses`}
                        className="block w-full text-center py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                      >
                        <span className="mr-2">💰</span>
                        Festival Expenses
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                ✨ Management Features
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive tools for successful festival management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">
                  Resident Management
                </h3>
                <p className="text-gray-600">
                  Track devotees, families, and contributions
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                <p className="text-gray-600">
                  Monitor all festival expenses and budgets
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">
                  Analytics & Reports
                </h3>
                <p className="text-gray-600">Detailed summaries and insights</p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-4">🖨️</div>
                <h3 className="text-xl font-semibold mb-2">Print & Export</h3>
                <p className="text-gray-600">
                  Generate reports and print lists
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">
                &copy; 2024 Matri Mirra Residency. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="/2025/vinayaka-chavithi"
                className="hover:text-orange-400 transition-colors"
              >
                Current Festival
              </a>
              <a
                href="/2025/expenses"
                className="hover:text-green-400 transition-colors"
              >
                Expenses
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
