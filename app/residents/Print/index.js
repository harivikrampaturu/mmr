'use client';
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const PrintList = ({ residents = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePrint = async (print = 'all') => {
    let printableResidents = [...residents];
    if (String(print).toLowerCase() !== 'all') {
      printableResidents = printableResidents.filter(
        ({ pooja }) => pooja === print
      );
    }

    const translateText = async (text) => {
      try {
        const response = await fetch(
          `/api/translate?text=${encodeURIComponent(text)}&targetLang=te`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const translatedText = await response.text();
        return translatedText;
      } catch (error) {
        console.error('Error fetching translation:', error);
        return '';
      }
    };

    const translateResidents = async () => {
      try {
        const translations = await Promise.all(
          printableResidents.map(async (resident) => {
            const [gothram_telugu, familyMembers_telugu] = await Promise.all([
              translateText(resident.gothram),
              translateText(resident.familyMembers)
            ]);

            return { ...resident, gothram_telugu, familyMembers_telugu };
          })
        );

        // setTranslatedResidents(translations);
        printResidentsList(translations); // Call the print function after translations
      } catch (error) {
        console.error('Error translating residents:', error);
      }
    };

    if (printableResidents.length > 0) {
      translateResidents();
    }

    const printResidentsList = (translatedResidents) => {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Residents List</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(
        'table { width: 100%; border-collapse: collapse; }'
      );
      printWindow.document.write(
        'th, td { border: 1px solid #ddd; padding: 8px; }'
      );
      printWindow.document.write(
        'th { background-color: #f4f4f4; text-align: left; }'
      );
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(
        `<h1>${print !== 'all' ? `${print} Pooja` : 'Residents'} list  (${
          translatedResidents.length
        })</h1>`
      );
      printWindow.document.write('<table>');
      printWindow.document.write('<thead>');
      printWindow.document.write('<tr>');
      printWindow.document.write('<th>Flat No</th>');
      printWindow.document.write('<th>Gothram</th>');
      printWindow.document.write('<th>Family Members</th>');
      if (print === 'all') {
        printWindow.document.write('<th>Kids</th>');
        printWindow.document.write('<th>Adults</th>');
      }
      printWindow.document.write('</tr>');
      printWindow.document.write('</thead>');
      printWindow.document.write('<tbody>');
      translatedResidents.forEach((resident) => {
        printWindow.document.write('<tr>');
        printWindow.document.write(`<td>${resident.flatNo}</td>`);
        printWindow.document.write(
          `<td>${resident.gothram} <br/> ${resident?.gothram_telugu}</td>`
        );
        printWindow.document.write(
          `<td>${resident.familyMembers} <br/> ${resident?.familyMembers_telugu}</td>`
        );
        if (print === 'all') {
          printWindow.document.write(`<td>${resident.kids}</td>`);
          printWindow.document.write(`<td>${resident.adults}</td>`);
        }

        printWindow.document.write('</tr>');
      });
      printWindow.document.write('</tbody>');
      printWindow.document.write('</table>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    };
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='absolute left-5 top-18 bg-green-500 text-white py-2 px-4 rounded mb-4 size-min '>
      <div className='flex items-center'>
        <button
          onClick={() => {
            handlePrint('all');
          }}
          className='mr-2'
        >
          Print
        </button>
        <button
          onClick={handleDropdownToggle}
          className='focus:outline-none h-50 w-4'
        >
          <ChevronDownIcon className='h-5 w-5 text-white' />
        </button>
      </div>
      {isDropdownOpen && (
        <div className='absolute left-0 mt-2 w-48 bg-white rounded shadow-lg z-10 text-black'>
          <ul>
            <li>
              <button
                onClick={() => {
                  handlePrint('Saturday');
                }}
                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              >
                Print Saturday
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePrint('Sunday');
                }}
                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              >
                Print Sunday
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePrint('Monday');
                }}
                className='block w-full text-left px-4 py-2 hover:bg-gray-100'
              >
                Print Monday
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PrintList;
