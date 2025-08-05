'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useParams } from 'next/navigation';
import Loader from '@/app/common/components/Loader';
import ConfirmationAlert from '@/app/common/components/ConfirmationAlert';

const isAdmin = true; // This should come from user authentication context

// Year validation function
const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);

  // Allow years from 2020 to current year + 5
  return yearNum >= 2020 && yearNum <= currentYear + 5 && !isNaN(yearNum);
};

export default function ExpensesPage() {
  const params = useParams();
  const year = params.year;

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'General',
    comments: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [yearError, setYearError] = useState(null);

  // Confirmation alert states
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

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

    console.log('🔄 Fetching expenses for year:', year);
    setLoading(true);

    fetch(`/api/${year}/expenses`)
      .then((res) => {
        console.log('📡 Response status:', res.status);
        console.log('📡 Response headers:', res.headers);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('📋 Response data:', data);
        setLoading(false);

        if (data.success && Array.isArray(data.data)) {
          console.log('✅ Setting expenses:', data.data.length);
          setExpenses(data.data);
        } else {
          console.error('❌ Invalid response format:', data);
          setExpenses([]);
        }
      })
      .catch((error) => {
        console.error('❌ Error fetching expenses:', error);
        setLoading(false);
        setExpenses([]);
      });
  }, [year, yearError]);

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Cannot delete expense: No ID provided');
      return;
    }

    setExpenseToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      const response = await fetch(`/api/${year}/expenses`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: expenseToDelete })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setExpenses(
          expenses.filter((expense) => expense._id !== expenseToDelete)
        );
      } else {
        console.error('Delete failed:', result.error);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setExpenseToDelete(null);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
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
      id: editingExpense._id,
      description: editingExpense.description,
      amount: editingExpense.amount,
      date: editingExpense.date,
      category: editingExpense.category,
      comments: editingExpense.comments
    };

    const response = await fetch(`/api/${year}/expenses`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    const updatedExpense = await response.json();
    setExpenses(
      expenses.map((exp) =>
        exp._id === updatedExpense.data._id ? updatedExpense.data : exp
      )
    );
    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/${year}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense)
    });

    const createdExpense = await response.json();
    setExpenses([...expenses, createdExpense.data]);
    setIsDialogOpen(false);
    setNewExpense({
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'General',
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
              href="/2025/expenses"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Go to 2025 Expenses
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  // Add null checks and default values
  const safeExpenses = expenses || [];

  // Filter out invalid expense objects
  const validExpenses = safeExpenses.filter(
    (expense) => expense && expense._id
  );

  const totalExpenses = validExpenses.reduce(
    (sum, expense) => sum + (expense?.amount || 0),
    0
  );

  // Group expenses by category with null checks
  const expensesByCategory = validExpenses.reduce((acc, expense) => {
    if (expense?.category && expense?.amount) {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    }
    return acc;
  }, {});

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {year} Vinayaka Chavithi Expenses
        </h1>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Add New Expense
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <p className="text-xl font-bold text-blue-600">
          Total Expenses: ₹{totalExpenses}
        </p>
        <p className="text-gray-600">
          Number of Expenses: {validExpenses.length}
        </p>

        {/* Category Breakdown */}
        {Object.keys(expensesByCategory).length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">By Category:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="bg-white p-2 rounded">
                  <span className="font-medium">{category}:</span> ₹{amount}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        {validExpenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No expenses found for {year}</p>
            {isAdmin && (
              <button
                onClick={handleCreate}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
              >
                Add First Expense
              </button>
            )}
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Comments</th>

                {isAdmin && <th className="border px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {validExpenses.map((expense) => (
                <tr key={expense?._id || Math.random()}>
                  <td className="border px-4 py-2">{expense?.date || '-'}</td>
                  <td className="border px-4 py-2">
                    {expense?.description || '-'}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        expense?.category === 'Pooja'
                          ? 'bg-yellow-100 text-yellow-800'
                          : expense?.category === 'Food'
                          ? 'bg-green-100 text-green-800'
                          : expense?.category === 'Decoration'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {expense?.category || '-'}
                    </span>
                  </td>
                  <td className="border px-4 py-2 font-medium">
                    ₹{expense?.amount || 0}
                  </td>
                  <td className="border px-4 py-2 text-sm text-gray-600">
                    {expense?.comments || '-'}
                  </td>

                  {isAdmin && (
                    <td className="border px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="inline-flex items-center px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense?._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Alert */}
      <ConfirmationAlert
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Dialog for Create/Edit Expense */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-2xl font-semibold mb-4">
              {dialogMode === 'create' ? 'Add New Expense' : 'Edit Expense'}
            </Dialog.Title>
            <form
              onSubmit={
                dialogMode === 'create' ? handleCreateSubmit : handleUpdate
              }
            >
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description:</label>
                <input
                  type="text"
                  value={
                    dialogMode === 'create'
                      ? newExpense?.description
                      : editingExpense?.description
                  }
                  onChange={(e) =>
                    dialogMode === 'create'
                      ? setNewExpense({
                          ...newExpense,
                          description: e.target.value
                        })
                      : setEditingExpense({
                          ...editingExpense,
                          description: e.target.value
                        })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Amount:</label>
                <input
                  type="number"
                  value={
                    dialogMode === 'create'
                      ? newExpense?.amount
                      : editingExpense?.amount
                  }
                  onChange={(e) =>
                    dialogMode === 'create'
                      ? setNewExpense({
                          ...newExpense,
                          amount: parseInt(e.target.value)
                        })
                      : setEditingExpense({
                          ...editingExpense,
                          amount: parseInt(e.target.value)
                        })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Date:</label>
                <input
                  type="date"
                  value={
                    dialogMode === 'create'
                      ? newExpense?.date
                      : editingExpense?.date
                  }
                  onChange={(e) =>
                    dialogMode === 'create'
                      ? setNewExpense({
                          ...newExpense,
                          date: e.target.value
                        })
                      : setEditingExpense({
                          ...editingExpense,
                          date: e.target.value
                        })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Category:</label>
                <select
                  value={
                    dialogMode === 'create'
                      ? newExpense?.category
                      : editingExpense?.category
                  }
                  onChange={(e) =>
                    dialogMode === 'create'
                      ? setNewExpense({
                          ...newExpense,
                          category: e.target.value
                        })
                      : setEditingExpense({
                          ...editingExpense,
                          category: e.target.value
                        })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="General">General</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Pooja">Pooja</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Comments:</label>
                <textarea
                  value={
                    dialogMode === 'create'
                      ? newExpense?.comments
                      : editingExpense?.comments
                  }
                  onChange={(e) =>
                    dialogMode === 'create'
                      ? setNewExpense({
                          ...newExpense,
                          comments: e.target.value
                        })
                      : setEditingExpense({
                          ...editingExpense,
                          comments: e.target.value
                        })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                  rows="3"
                  placeholder="Optional comments..."
                />
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
                  {dialogMode === 'create' ? 'Add Expense' : 'Update Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
