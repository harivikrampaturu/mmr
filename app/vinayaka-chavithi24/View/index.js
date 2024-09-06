import React from 'react';

const ResidentsTable = ({ residents, isAdmin, handleEdit, handleDelete }) => {
  const translatedResidents = residents?.sort((a, b) => {
    if (a.flatNo < b.flatNo) return -1;
    else if (a.flatNo > b.flatNo) return 1;
    return 0;
  });
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
            <th className='py-2 px-4 text-left'>Comments</th>
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
              <td className='py-2 px-4'>
                <div>{resident?.comments}</div>
              </td>
              {isAdmin && (
                <td className='py-2 px-4 '>
                  <div className='flex space-x-2  items-center'>
                    <button
                      onClick={() => handleEdit(resident)}
                      className='bg-yellow-500 text-white py-1 px-2 rounded'
                      title='Edit'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(resident._id)}
                      className='bg-red-500 text-white py-1 px-2 rounded'
                      title='Delete'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                        />
                      </svg>
                    </button>
                  </div>
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
