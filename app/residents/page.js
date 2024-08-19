'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react'; // Headless UI for dialogs
import ResidentsTable from './View';
import PrintList from './Print';
import ResidentsSummary from './Summary';

// Example user role for demonstration
const isAdmin = true; // This should come from user authentication context

export default function ResidentsList() {
  const [residents, setResidents] = useState([]);
  const [editingResident, setEditingResident] = useState(null);
  const [newResident, setNewResident] = useState({
    flatNo: '',
    gothram: '',
    familyMembers: '',
    kids: 1,
    adults: 1,
    pooja: 'Saturday',
    contribution: 1116
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'

  useEffect(() => {
    fetch('/api/residents')
      .then((res) => res.json())
      .then((data) => setResidents(data.data));
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Press ok to delete') === true) {
      await fetch('/api/residents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      setResidents(residents.filter((resident) => resident._id !== id));
    }
  };

  const handleEdit = (resident) => {
    setEditingResident(resident);
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
      id: editingResident._id,
      flatNo: editingResident.flatNo,
      gothram: editingResident.gothram,
      familyMembers: editingResident.familyMembers,
      kids: editingResident.kids,
      adults: editingResident.adults,
      pooja: editingResident.pooja,
      contribution: editingResident.contribution
    };

    const response = await fetch('/api/residents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    const updatedResident = await response.json();
    setResidents(
      residents.map((res) =>
        res._id === updatedResident.data._id ? updatedResident.data : res
      )
    );
    setIsDialogOpen(false);
    setEditingResident(null);
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/residents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResident)
    });

    const createdResident = await response.json();
    setResidents([...residents, createdResident.data]);
    setIsDialogOpen(false);
    setNewResident({
      flatNo: '',
      gothram: '',
      familyMembers: '',
      kids: 1,
      adults: 1,
      pooja: 'Saturday',
      contribution: 1116
    });
  };

  return (
    <div className='p-4'>
      <div className='flex justify-between'>
        {/* Print Button */}
        {/*   <button
          onClick={() => printList(residents)}
          className='bg-green-500 text-white py-2 px-4 rounded mb-4 size-min'
        >
          Print
        </button> */}
        <div style={{ margin: '1rem' }}>
          <br />
        </div>
        <PrintList residents={residents} />
        <h1 className='text-2xl font-bold mb-4'>Residents List</h1>

        {/* Create Resident Button */}
        {isAdmin && (
          <button
            onClick={handleCreate}
            className='bg-blue text-white py-2 px-4 rounded mb-4'
          >
            Add New Resident
          </button>
        )}
      </div>

      {/* Residents List */}

      <ResidentsTable
        residents={residents}
        isAdmin={isAdmin}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Summary */}
      {Boolean(residents?.length) && <ResidentsSummary residents={residents} />}

      {/* Dialog for Create/Edit Resident */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div
          className='fixed inset-0 bg-black bg-opacity-30'
          aria-hidden='true'
        />
        <div className='fixed inset-0 flex items-center justify-center p-4 overflow-y-auto  '>
          <div className='bg-white rounded-lg p-6 w-full max-w-lg '>
            <Dialog.Title className='text-2xl font-semibold mb-4'>
              {dialogMode === 'create' ? 'Add New Resident' : 'Edit Resident'}
            </Dialog.Title>
            <form
              onSubmit={
                dialogMode === 'create' ? handleCreateSubmit : handleUpdate
              }
            >
              <div className='flex flex-row justify-between'>
                <div className='mr-4'>
                  <div className='mb-4'>
                    <label className='block mb-1 font-medium'>Flat No:</label>
                    <input
                      type='text'
                      value={
                        dialogMode === 'create'
                          ? newResident?.flatNo
                          : editingResident?.flatNo
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewResident({
                              ...newResident,
                              flatNo: e.target.value
                            })
                          : setEditingResident({
                              ...editingResident,
                              flatNo: e.target.value
                            })
                      }
                      className='border border-gray-300 rounded p-2 w-full'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block mb-1 font-medium'>Gothram:</label>
                    <input
                      type='text'
                      value={
                        dialogMode === 'create'
                          ? newResident?.gothram
                          : editingResident?.gothram
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewResident({
                              ...newResident,
                              gothram: e.target.value
                            })
                          : setEditingResident({
                              ...editingResident,
                              gothram: e.target.value
                            })
                      }
                      className='border border-gray-300 rounded p-2 w-full'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label className='block mb-1 font-medium'>
                      Family Members:
                    </label>
                    <textarea
                      value={
                        dialogMode === 'create'
                          ? newResident?.familyMembers
                          : editingResident?.familyMembers
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewResident({
                              ...newResident,
                              familyMembers: e.target.value
                            })
                          : setEditingResident({
                              ...editingResident,
                              familyMembers: e.target.value
                            })
                      }
                      className='border border-gray-300 rounded p-2 w-full'
                      required
                    />
                  </div>
                </div>
                <div>
                  <div className='mb-4'>
                    <label className='block mb-1 font-medium'>Kids:</label>
                    <select
                      value={
                        dialogMode === 'create'
                          ? newResident?.kids
                          : editingResident?.kids
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewResident({
                              ...newResident,
                              kids: parseInt(e.target.value)
                            })
                          : setEditingResident({
                              ...editingResident,
                              kids: parseInt(e.target.value)
                            })
                      }
                      className='border border-gray-300 rounded p-2 w-full'
                      required
                    >
                      {[...Array(5)].map((_, i) => (
                        <option key={`kids${i + 1}`} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='mb-4'>
                    <label className='block mb-1 font-medium'>Adults:</label>
                    <select
                      value={
                        dialogMode === 'create'
                          ? newResident?.adults
                          : editingResident?.adults
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewResident({
                              ...newResident,
                              adults: parseInt(e.target.value)
                            })
                          : setEditingResident({
                              ...editingResident,
                              adults: parseInt(e.target.value)
                            })
                      }
                      className='border border-gray-300 rounded p-2 w-full'
                      required
                    >
                      {[...Array(5)].map((_, i) => (
                        <option key={i + 1} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='mb-4'>
                    <label className='block mb-1 font-medium'>Pooja:</label>

                    <select
                      value={
                        dialogMode === 'create'
                          ? newResident?.pooja
                          : editingResident?.pooja
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewResident({
                              ...newResident,
                              pooja: e.target.value
                            })
                          : setEditingResident({
                              ...editingResident,
                              pooja: e.target.value
                            })
                      }
                      className='border border-gray-300 rounded p-2 w-full'
                      required
                    >
                      {['No', 'Saturday', 'Sunday', 'Monday'].map((val, i) => (
                        <option key={i + 1} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='mb-4'>
                    <label className='block mb-1 font-medium'>
                      Contribution:
                    </label>
                    <input
                      type='text'
                      value={
                        dialogMode === 'create'
                          ? newResident?.contribution
                          : editingResident?.contribution
                      }
                      onChange={(e) =>
                        dialogMode === 'create'
                          ? setNewResident({
                              ...newResident,
                              contribution: parseInt(e.target.value)
                            })
                          : setEditingResident({
                              ...editingResident,
                              contribution: parseInt(e.target.value)
                            })
                      }
                      className='border border-gray-300 rounded p-2 w-full'
                      required
                    />
                  </div>
                </div>
              </div>
              <div className='flex justify-end mt-3'>
                <button
                  type='button'
                  onClick={() => setIsDialogOpen(false)}
                  className='bg-gray-500 text-white py-2 px-4 rounded mr-2'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue text-white py-2 px-4 rounded '
                >
                  {dialogMode === 'create' ? 'Add Resident' : 'Update Resident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
