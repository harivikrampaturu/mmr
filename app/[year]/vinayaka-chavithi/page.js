'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useParams } from 'next/navigation';
import Loader from '@/app/common/components/Loader';
import DevoteesTable from './View';
import PrintList from './Print';
import DevoteesSummary from './Summary';
import ConfirmationAlert from '@/app/common/components/ConfirmationAlert';

const isAdmin = true; // This should come from user authentication context

// Year validation function
const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);

  // Allow years from 2020 to current year + 5
  return yearNum >= 2020 && yearNum <= currentYear + 5 && !isNaN(yearNum);
};

export default function VinayakaChavithiPage() {
  const params = useParams();
  const year = params.year;

  const [devotees, setDevotees] = useState([]);
  const [editingDevotee, setEditingDevotee] = useState(null);
  const [newDevotee, setNewDevotee] = useState({
    flatNo: '',
    gothram: '',
    familyMembers: '',
    kids: 1,
    adults: 1,
    pooja: 'Saturday',
    contribution: 1116,
    comments: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [yearError, setYearError] = useState(null);

  // Confirmation alert states
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [devoteeToDelete, setDevoteeToDelete] = useState(null);

  // Validate year on component mount
  useEffect(() => {
    if (!isValidYear(year)) {
      setYearError(
        `Invalid year: ${year}. Please use a year between 2020 and ${
          new Date().getFullYear() + 5
        }.`
      );
      return;
    }
    setYearError(null);
  }, [year]);

  useEffect(() => {
    if (yearError) return; // Don't fetch data if year is invalid

    setLoading(true);
    // Fetch both devotees and expenses
    Promise.all([
      fetch(`/api/${year}/ganesh-devotees`).then((res) => res.json()),
      fetch(`/api/${year}/expenses`).then((res) => res.json())
    ])
      .then(([devoteesData, expensesData]) => {
        setLoading(false);
        setDevotees(devoteesData.data);
        setExpenses(expensesData.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching data:', error);
      });
  }, [year, yearError]);

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Cannot delete devotee: No ID provided');
      return;
    }

    setDevoteeToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!devoteeToDelete) return;

    try {
      const response = await fetch(`/api/${year}/ganesh-devotees`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: devoteeToDelete })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setDevotees(
          devotees.filter((devotee) => devotee._id !== devoteeToDelete)
        );
      } else {
        console.error('Delete failed:', result.error);
      }
    } catch (error) {
      console.error('Error deleting devotee:', error);
    } finally {
      setDevoteeToDelete(null);
    }
  };

  const handleEdit = (devotee) => {
    setEditingDevotee(devotee);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedData = {
      id: editingDevotee._id,
      flatNo: editingDevotee.flatNo,
      gothram: editingDevotee.gothram,
      familyMembers: editingDevotee.familyMembers,
      kids: editingDevotee.kids,
      adults: editingDevotee.adults,
      pooja: editingDevotee.pooja,
      contribution: editingDevotee.contribution,
      comments: editingDevotee.comments
    };

    const response = await fetch(`/api/${year}/ganesh-devotees`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    const updatedDevotee = await response.json();
    setDevotees(
      devotees.map((dev) =>
        dev._id === updatedDevotee.data._id ? updatedDevotee.data : dev
      )
    );
    setIsDialogOpen(false);
    setEditingDevotee(null);
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/${year}/ganesh-devotees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDevotee)
    });

    const createdDevotee = await response.json();
    setDevotees([...devotees, createdDevotee.data]);
    setIsDialogOpen(false);
    setNewDevotee({
      flatNo: '',
      gothram: '',
      familyMembers: '',
      kids: 1,
      adults: 1,
      pooja: 'Saturday',
      contribution: 1116,
      comments: ''
    });
  };

  // Show error if year is invalid
  if (yearError) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Invalid Year</h1>
          <p className="text-red-700 mb-4">{yearError}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Valid years:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Past years: 2020 onwards</li>
              <li>Future years: Up to {new Date().getFullYear() + 5}</li>
            </ul>
          </div>
          <div className="mt-6">
            <a
              href="/2025/vinayaka-chavithi"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Go to 2025
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  const totalDevotees = devotees.length;
  const totalContribution = devotees.reduce(
    (sum, devotee) => sum + devotee.contribution,
    0
  );
  const totalKids = devotees.reduce((sum, devotee) => sum + devotee.kids, 0);
  const totalAdults = devotees.reduce(
    (sum, devotee) => sum + devotee.adults,
    0
  );

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div style={{ margin: '1rem' }}>
          <br />
        </div>
        <PrintList devotees={devotees} />
        <h1 className="text-2xl font-bold mb-4">{year} Vinayaka Chavithi</h1>

        {/* Create Devotee Button */}
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Add New Record
          </button>
        )}
      </div>

      {/* Devotees List */}
      <DevoteesTable
        devotees={devotees}
        isAdmin={isAdmin}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Summary */}
      {Boolean(devotees?.length) && (
        <DevoteesSummary
          devotees={devotees}
          expenses={expenses}
          isAdmin={isAdmin}
        />
      )}

      {/* Confirmation Alert */}
      <ConfirmationAlert
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={confirmDelete}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Dialog for Create/Edit Devotee */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <Dialog.Title className="text-2xl font-semibold mb-4">
              {dialogMode === 'create' ? 'Add New Devotee' : 'Edit Devotee'}
            </Dialog.Title>
            <form
              onSubmit={
                dialogMode === 'create' ? handleCreateSubmit : handleUpdate
              }
            >
              <div className="flex flex-row justify-between">
                <div className="mr-4">
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Flat No:</label>
                    <input
                      type="text"
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.flatNo
                          : editingDevotee?.flatNo
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              flatNo: e.target.value
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              flatNo: e.target.value
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Gothram:</label>
                    <input
                      type="text"
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.gothram
                          : editingDevotee?.gothram
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              gothram: e.target.value
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              gothram: e.target.value
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Family Members:
                    </label>
                    <textarea
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.familyMembers
                          : editingDevotee?.familyMembers
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              familyMembers: e.target.value
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              familyMembers: e.target.value
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Kids:</label>
                    <select
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.kids
                          : editingDevotee?.kids
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              kids: parseInt(e.target.value)
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              kids: parseInt(e.target.value)
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    >
                      {[...Array(5)].map((_, i) => (
                        <option key={`kids${i + 1}`} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Adults:</label>
                    <select
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.adults
                          : editingDevotee?.adults
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              adults: parseInt(e.target.value)
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              adults: parseInt(e.target.value)
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    >
                      {[...Array(5)].map((_, i) => (
                        <option key={i + 1} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Pooja:</label>
                    <select
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.pooja
                          : editingDevotee?.pooja
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              pooja: e.target.value
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              pooja: e.target.value
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    >
                      {[
                        'No',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday'
                      ].map((val, i) => (
                        <option key={i + 1} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Contribution:
                    </label>
                    <input
                      type="number"
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.contribution
                          : editingDevotee?.contribution
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              contribution: parseInt(e.target.value)
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              contribution: parseInt(e.target.value)
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Comments:</label>
                    <input
                      type="text"
                      value={
                        dialogMode === 'create'
                          ? newDevotee?.comments
                          : editingDevotee?.comments
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewDevotee({
                              ...newDevotee,
                              comments: e.target.value
                            })
                          : setEditingDevotee({
                              ...editingDevotee,
                              comments: e.target.value
                            })
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded"
                >
                  {dialogMode === 'create' ? 'Add Devotee' : 'Update Devotee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
