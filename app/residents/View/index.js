import React, { useEffect, useState } from 'react';

const ResidentsTable = ({ residents, isAdmin, handleEdit, handleDelete }) => {
  const [translatedResidents, setTranslatedResidents] = useState([
    ...residents
  ]);

  useEffect(() => {
    const translateText = async (text) => {
      try {
        const response = await fetch(
          `/api/translate?text=${encodeURIComponent(text)}&targetLang=te`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseText = await response.text(); // Use text() to inspect raw response
        console.log('Response Text:', responseText);

        // Attempt to parse JSON
        const data = JSON.parse(responseText);
        return data.translation;
      } catch (error) {
        // console.error('Error fetching translation:', error);
        return '';
      }
    };

    const translateResidents = async () => {
      const translations = await Promise.all(
        residents.map(async (resident) => ({
          ...resident,
          gothram_telugu: await translateText(resident.gothram),
          familyMembers_telugu: await translateText(resident.familyMembers),
          kids_telugu: await translateText(resident.kids),
          adults_telugu: await translateText(resident.adults)
        }))
      );
      setTranslatedResidents(translations);
    };

    translateResidents();
  }, [residents]);

  return (
    <div className='overflow-x-auto'>
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
                  {resident.gothram_telugu}
                </div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident.familyMembers}</div>
                <div className='text-xs text-gray-500'>
                  {resident.familyMembers_telugu}
                </div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident.kids}</div>
                <div className='text-xs text-gray-500'>
                  {resident.kids_telugu}
                </div>
              </td>
              <td className='py-2 px-4'>
                <div>{resident.adults}</div>
                <div className='text-xs text-gray-500'>
                  {resident.adults_telugu}
                </div>
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
