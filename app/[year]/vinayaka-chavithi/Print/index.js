'use client';
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const PrintList = ({ devotees = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printStatus, setPrintStatus] = useState('');

  const handlePrint = async (print = 'all') => {
    let printableDevotees = [...devotees];
    if (String(print).toLowerCase() !== 'all') {
      printableDevotees = printableDevotees.filter(
        ({ pooja }) => pooja === print
      );
    }

    if (printableDevotees.length === 0) {
      alert('No devotees found to print');
      return;
    }

    setIsPrinting(true);
    setPrintStatus('Preparing print data...');

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

    const translateDevotees = async () => {
      try {
        setPrintStatus(`Translating ${printableDevotees.length} records...`);

        const translations = await Promise.all(
          printableDevotees.map(async (devotee, index) => {
            setPrintStatus(
              `Translating record ${index + 1} of ${
                printableDevotees.length
              }...`
            );

            const [gothram_telugu, familyMembers_telugu] = await Promise.all([
              translateText(devotee.gothram),
              translateText(devotee.familyMembers)
            ]);

            return { ...devotee, gothram_telugu, familyMembers_telugu };
          })
        );

        setPrintStatus('Generating print preview...');
        await printDevoteesList(translations, print);
      } catch (error) {
        console.error('Error translating devotees:', error);
        setPrintStatus('Translation failed. Printing without translations...');
        await printDevoteesList(printableDevotees, print);
      }
    };

    translateDevotees();
  };

  const printDevoteesList = async (translatedDevotees, printType) => {
    try {
      setPrintStatus('Opening print window...');

      // Create a new window for printing
      const printWindow = window.open(
        '',
        '_blank',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      if (!printWindow) {
        alert(
          'Please allow pop-ups to print the list. You can enable pop-ups for this site in your browser settings.'
        );
        setIsPrinting(false);
        setPrintStatus('');
        return;
      }

      setPrintStatus('Generating print content...');

      // Create the HTML content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Devotees List - ${
            printType !== 'all' ? printType : 'All'
          }</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            h1 { color: #333; text-align: center; }
            .header { text-align: center; margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${
              printType !== 'all' ? `${printType} Pooja` : 'All Devotees'
            } List</h1>
            <p>Total Records: ${translatedDevotees.length}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Flat No</th>
                <th>Gothram</th>
                <th>Family Members</th>
                ${
                  printType === 'all'
                    ? '<th>Kids</th><th>Adults</th><th>Pooja</th>'
                    : ''
                }
              </tr>
            </thead>
            <tbody>
              ${translatedDevotees
                .map(
                  (devotee) => `
                <tr>
                  <td>${devotee.flatNo || ''}</td>
                  <td>${
                    devotee.gothram || ''
                  }<br/><small style="color: #666;">${
                    devotee.gothram_telugu || ''
                  }</small></td>
                  <td>${
                    devotee.familyMembers || ''
                  }<br/><small style="color: #666;">${
                    devotee.familyMembers_telugu || ''
                  }</small></td>
                  ${
                    printType === 'all'
                      ? `
                    <td>${devotee.kids || 0}</td>
                    <td>${devotee.adults || 0}</td>
                    <td>${devotee.pooja || ''}</td>
                  `
                      : ''
                  }
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print This Page
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              Close Window
            </button>
          </div>
        </body>
        </html>
      `;

      // Write content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        setPrintStatus('Print dialog opening...');

        // Small delay to ensure content is fully loaded
        setTimeout(() => {
          try {
            printWindow.focus(); // Focus the print window
            printWindow.print(); // Trigger print dialog
          } catch (printError) {
            console.error('Print error:', printError);
            setPrintStatus(
              'Print dialog failed. Please use the Print button in the new window.'
            );
          }
        }, 500);
      };

      // Reset status after a delay
      setTimeout(() => {
        setIsPrinting(false);
        setPrintStatus('');
      }, 3000);
    } catch (error) {
      console.error('Print window error:', error);
      setPrintStatus('Failed to create print window. Please try again.');
      setTimeout(() => {
        setIsPrinting(false);
        setPrintStatus('');
      }, 3000);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="absolute left-5 top-18 bg-green-500 text-white py-2 px-4 rounded mb-4 size-min">
      <div className="flex items-center">
        <button
          onClick={() => {
            handlePrint('all');
          }}
          disabled={isPrinting}
          className={`mr-2 ${
            isPrinting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPrinting ? 'Printing...' : 'Print'}
        </button>
        <button
          onClick={handleDropdownToggle}
          disabled={isPrinting}
          className={`focus:outline-none h-50 w-4 ${
            isPrinting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronDownIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Loading Indicator */}
      {isPrinting && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded shadow-lg z-20 text-black p-3">
          <div className="flex items-center mb-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
            <span className="text-sm font-medium">Processing...</span>
          </div>
          <p className="text-xs text-gray-600">{printStatus}</p>
        </div>
      )}

      {isDropdownOpen && !isPrinting && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg z-10 text-black">
          <ul>
            <li>
              <button
                onClick={() => {
                  handlePrint('Wednesday');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Print Wednesday
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePrint('Thursday');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Print Thursday
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePrint('Friday');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Print Friday
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePrint('Saturday');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Print Saturday
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handlePrint('Sunday');
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Print Sunday
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PrintList;
