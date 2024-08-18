'use client';
import React, { useEffect } from 'react';

const PrintList = ({ residents = [] }) => {
  const handlePrint = async () => {
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
          residents.map(async (resident) => {
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

    if (residents.length > 0) {
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
      printWindow.document.write('<h1>Residents List</h1>');
      printWindow.document.write('<table>');
      printWindow.document.write('<thead>');
      printWindow.document.write('<tr>');
      printWindow.document.write('<th>Flat No</th>');
      printWindow.document.write('<th>Gothram</th>');
      printWindow.document.write('<th>Family Members</th>');
      printWindow.document.write('<th>Kids</th>');
      printWindow.document.write('<th>Adults</th>');
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
        printWindow.document.write(`<td>${resident.kids}</td>`);
        printWindow.document.write(`<td>${resident.adults}</td>`);
        printWindow.document.write('</tr>');
      });
      printWindow.document.write('</tbody>');
      printWindow.document.write('</table>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    };
  };

  return (
    <div className='absolute left-5 top-18 bg-green-500 text-white py-2 px-4 rounded mb-4 size-min'>
      <button onClick={handlePrint}> Print </button>
    </div>
  );
};

export default PrintList;
