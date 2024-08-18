import React from 'react';

const ResidentsTable = ({ residents, isAdmin, handleEdit, handleDelete }) => {
  const translatedResidents = residents;
  return (
    <div className='overflow-x-auto p-16 pt-4'>
      <table className='min-w-full bg-white border border-gray-200 rounded'>
        <thead>
          <tr className='bg-gray-100 border-b'>
            <th className='py-2 px-4 text-left'>Flat No</th>
            <th className='py-2 px-4 text-left'>
              Gothram
              <div className='text-xs text-gray-500'>గోత్రము</div>
            </th>
            <th className='py-2 px-4 text-left'>
              Family Members
              <div className='text-xs text-gray-500'>కుటుంబ సభ్యులు</div>
            </th>
            <th className='py-2 px-4 text-left'>
              Kids
              <div className='text-xs text-gray-500'>పిల్లలు</div>
            </th>
            <th className='py-2 px-4 text-left'>
              Adults
              <div className='text-xs text-gray-500'>పెద్దలు</div>
            </th>
            <th className='py-2 px-4 text-left'>Pooja Day</th>
            <th className='py-2 px-4 text-left'>Contribution</th>
            {isAdmin && <th className='py-2 px-4 text-left'>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {translatedResidents?.map((resident) => (
            <tr key={resident._id} className='border-b'>
              <td className='py-2 px-4'>{resident.flatNo}</td>
              <td className='py-2 px-4'>
                <div>{resident.gothram}</div>
                <div className='text-xs text-gray-500'>
                  {resident?.gothram_telugu}
                </div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident.familyMembers}</div>
                <div className='text-xs text-gray-500'>
                  {resident?.familyMembers_telugu}
                </div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident.kids}</div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident.adults}</div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident?.pooja}</div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident?.contribution}</div>
              </td>
              {isAdmin && (
                <td className='py-2 px-4 flex space-x-2'>
                  <button
                    onClick={() => handleEdit(resident)}
                    className='bg-yellow-500 text-white py-1 px-2 rounded'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resident._id)}
                    className='bg-red-500 text-white py-1 px-2 rounded'
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResidentsTable;
