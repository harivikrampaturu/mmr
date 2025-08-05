'use client';

import { useState } from 'react';

export default function MigratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleMigration = async () => {
    if (
      !confirm(
        'Are you sure you want to migrate all residents to devotees for 2025?'
      )
    ) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/migrate-residents', {
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
        message: 'Migration failed: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Data Migration</h1>

      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Residents → Devotees (2025)
        </h2>
        <p className="text-gray-700 mb-4">
          This will copy all existing Resident data to create Devotee records
          for 2025. The migration will:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Copy all Resident data to Devotee collection</li>
          <li>Set year field to 2025</li>
          <li>
            Preserve all existing data (flatNo, gothram, familyMembers, etc.)
          </li>
          <li>Prevent duplicates if 2025 devotees already exist</li>
        </ul>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <p className="text-yellow-800">
          ⚠️ <strong>Warning:</strong> This action will create new records. Make
          sure you have a backup of your data.
        </p>
      </div>

      <button
        onClick={handleMigration}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg font-semibold ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {isLoading ? 'Migrating...' : 'Start Migration'}
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
            {result.success ? '✅ Migration Successful' : '❌ Migration Failed'}
          </h3>
          <p className={result.success ? 'text-green-700' : 'text-red-700'}>
            {result.message}
          </p>
          {result.data && (
            <div className="mt-3 text-sm">
              <p>
                <strong>Residents processed:</strong>{' '}
                {result.data.residentsProcessed}
              </p>
              <p>
                <strong>Devotees created:</strong> {result.data.devoteesCreated}
              </p>
              <p>
                <strong>Year:</strong> {result.data.year}
              </p>
            </div>
          )}
          {result.success && (
            <div className="mt-4">
              <a
                href="/2025/vinayaka-chavithi"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View 2025 Devotees →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
