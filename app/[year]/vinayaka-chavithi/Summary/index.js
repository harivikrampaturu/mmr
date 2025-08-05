import React from 'react';

const DevoteesSummary = ({ devotees = [], expenses, isAdmin = false }) => {
  const totalExpenses =
    expenses && expenses.length
      ? expenses.reduce((acc, item) => acc + item.amount, 0)
      : 0;
  const totals = devotees.reduce(
    (acc, devotee) => {
      acc.totalContribution += devotee.contribution;
      acc.totalKids += devotee.kids;
      acc.totalAdults += devotee.adults;
      acc.wednesdayPooja = Boolean(devotee.pooja === 'Wednesday')
        ? acc.wednesdayPooja + 1
        : acc.wednesdayPooja;
      acc.thursdayPooja = Boolean(devotee.pooja === 'Thursday')
        ? acc.thursdayPooja + 1
        : acc.thursdayPooja;
      acc.fridayPooja = Boolean(devotee.pooja === 'Friday')
        ? acc.fridayPooja + 1
        : acc.fridayPooja;
      acc.saturdayPooja = Boolean(devotee.pooja === 'Saturday')
        ? acc.saturdayPooja + 1
        : acc.saturdayPooja;
      acc.sundayPooja = Boolean(devotee.pooja === 'Sunday')
        ? acc.sundayPooja + 1
        : acc.sundayPooja;
      return acc;
    },
    {
      totalContribution: 0,
      totalKids: 0,
      totalAdults: 0,
      wednesdayPooja: 0,
      thursdayPooja: 0,
      fridayPooja: 0,
      saturdayPooja: 0,
      sundayPooja: 0
    }
  );

  const netAmount = totals.totalContribution - totalExpenses;

  return (
    <div className="mt-8 mb-6">
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-orange-700">
            📊 Festival Summary
          </h2>
          <div className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            {devotees.length} Records
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Contribution
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totals.totalContribution}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{totalExpenses}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-lg">💸</span>
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-lg p-4 shadow-sm border ${
              netAmount >= 0 ? 'border-green-200' : 'border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ₹{netAmount}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <span
                  className={`text-lg ${
                    netAmount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {netAmount >= 0 ? '✅' : '⚠️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Link */}
        <div className="mb-6">
          <a
            href="/expenses"
            title="View detailed expenses"
            target="_blank"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            <span className="mr-2">📋</span>
            View Detailed Expenses
            <span className="ml-2">→</span>
          </a>
        </div>

        {/* Admin Details */}
        {isAdmin && (
          <div className="space-y-4">
            <div className="border-t border-orange-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                👥 Demographics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Kids
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {totals.totalKids}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">👶</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Adults
                      </p>
                      <p className="text-xl font-bold text-purple-600">
                        {totals.totalAdults}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">👨‍👩‍👧‍👦</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-orange-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🕉️ Pooja Schedule
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  {
                    day: 'Wednesday',
                    count: totals.wednesdayPooja,
                    color: 'bg-purple-100 text-purple-700'
                  },
                  {
                    day: 'Thursday',
                    count: totals.thursdayPooja,
                    color: 'bg-blue-100 text-blue-700'
                  },
                  {
                    day: 'Friday',
                    count: totals.fridayPooja,
                    color: 'bg-green-100 text-green-700'
                  },
                  {
                    day: 'Saturday',
                    count: totals.saturdayPooja,
                    color: 'bg-orange-100 text-orange-700'
                  },
                  {
                    day: 'Sunday',
                    count: totals.sundayPooja,
                    color: 'bg-red-100 text-red-700'
                  }
                ].map(({ day, count, color }) => (
                  <div
                    key={day}
                    className="bg-white rounded-lg p-3 shadow-sm text-center"
                  >
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {day}
                    </p>
                    <p className={`text-lg font-bold ${color}`}>{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevoteesSummary;
