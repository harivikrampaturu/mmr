'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ClearDevoteesPage() {
  const params = useParams();
  const year = params.year;

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClear = async () => {
    if (
      !confirm(
        `Are you sure you want to clear contribution, pooja, and comments for all devotees in ${year}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/${year}/ganesh-devotees/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Clear operation failed: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Clear Devotees Data - {year}</h1>

      <div className="bg-red-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-red-800">
          ⚠️ Clear Contribution, Pooja & Comments
        </h2>
        <p className="text-red-700 mb-4">
          This operation will reset the following fields for all devotees in{' '}
          {year}:
        </p>
        <ul className="list-disc list-inside text-red-700 mb-4">
          <li>
            <strong>Contribution:</strong> Set to 0
          </li>
          <li>
            <strong>Pooja:</strong> Set to empty string
          </li>
          <li>
            <strong>Comments:</strong> Set to empty string
          </li>
        </ul>
        <p className="text-red-700">
          <strong>Note:</strong> This action cannot be undone. All other fields
          (flatNo, gothram, familyMembers, kids, adults, year, isApproved) will
          remain unchanged.
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <p className="text-yellow-800">
          🔄 <strong>Purpose:</strong> Use this to reset yearly data while
          keeping the basic devotee information intact.
        </p>
      </div>

      <button
        onClick={handleClear}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg font-semibold ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700'
        } text-white`}
      >
        {isLoading ? 'Clearing...' : 'Clear Data'}
      </button>

      {result && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <h3
            className={`font-semibold mb-2 ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {result.success ? '✅ Clear Successful' : '❌ Clear Failed'}
          </h3>
          <p className={result.success ? 'text-green-700' : 'text-red-700'}>
            {result.message}
          </p>
          {result.data && (
            <div className="mt-3 text-sm">
              <p>
                <strong>Year:</strong> {result.data.year}
              </p>
              <p>
                <strong>Devotees matched:</strong> {result.data.devoteesMatched}
              </p>
              <p>
                <strong>Devotees modified:</strong>{' '}
                {result.data.devoteesModified}
              </p>
            </div>
          )}
          {result.success && (
            <div className="mt-4">
              <a
                href={`/${year}/vinayaka-chavithi`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Updated Devotees →
              </a>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <a
          href={`/${year}/vinayaka-chavithi`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to {year} Devotees
        </a>
      </div>
    </div>
  );
}
