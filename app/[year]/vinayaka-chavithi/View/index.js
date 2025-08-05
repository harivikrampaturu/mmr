import React from 'react';

const DevoteesTable = ({ devotees, isAdmin, handleEdit, handleDelete }) => {
  const translatedDevotees = devotees?.sort((a, b) => {
    if (a.flatNo < b.flatNo) return -1;
    else if (a.flatNo > b.flatNo) return 1;
    return 0;
  });
  return (
    <div className="overflow-x-auto p-16 pt-4">
      <table className="min-w-full bg-white border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">Flat No</th>
            <th className="py-2 px-4 text-left">
              Gothram
              <div className="text-xs text-gray-500">గోత్రము</div>
            </th>
            <th className="py-2 px-4 text-left">
              Family Members
              <div className="text-xs text-gray-500">కుటుంబ సభ్యులు</div>
            </th>
            <th className="py-2 px-4 text-left">
              Kids
              <div className="text-xs text-gray-500">పిల్లలు</div>
            </th>
            <th className="py-2 px-4 text-left">
              Adults
              <div className="text-xs text-gray-500">పెద్దలు</div>
            </th>
            <th className="py-2 px-4 text-left">Pooja Day</th>
            <th className="py-2 px-4 text-left">Contribution</th>
            <th className="py-2 px-4 text-left">Comments</th>
            {isAdmin && <th className="py-2 px-4 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {translatedDevotees?.map((devotee) => (
            <tr key={devotee._id} className="border-b">
              <td className="py-2 px-4">{devotee.flatNo}</td>
              <td className="py-2 px-4">
                <div>{devotee.gothram}</div>
                <div className="text-xs text-gray-500">
                  {devotee?.gothram_telugu}
                </div>
              </td>
              <td className="py-2 px-4">
                <div>{devotee.familyMembers}</div>
                <div className="text-xs text-gray-500">
                  {devotee?.familyMembers_telugu}
                </div>
              </td>
              <td className="py-2 px-4">
                <div>{devotee.kids}</div>
              </td>
              <td className="py-2 px-4">
                <div>{devotee.adults}</div>
              </td>
              <td className="py-2 px-4">
                <div>{devotee?.pooja}</div>
              </td>
              <td className="py-2 px-4">
                <div>{devotee?.contribution}</div>
              </td>
              <td className="py-2 px-4">
                <div>{devotee?.comments}</div>
              </td>
              {isAdmin && (
                <td className="py-2 px-4">
                  <div className="flex space-x-2 items-center">
                    <button
                      onClick={() => handleEdit(devotee)}
                      className="inline-flex items-center justify-center w-8 h-8 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm border-0"
                      style={{ backgroundColor: '#2563eb' }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = '#1d4ed8')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#2563eb')
                      }
                      title="Edit Record"
                    >
                      <svg
                        className="w-4 h-4"
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
                    </button>
                    <button
                      onClick={() => handleDelete(devotee._id)}
                      className="inline-flex items-center justify-center w-8 h-8 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm border-0"
                      style={{ backgroundColor: '#dc2626' }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = '#b91c1c')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#dc2626')
                      }
                      title="Delete Record"
                    >
                      <svg
                        className="w-4 h-4"
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

export default DevoteesTable;
