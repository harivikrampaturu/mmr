export const printList = (residents = []) => {
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
  residents.forEach((resident) => {
    printWindow.document.write('<tr>');
    printWindow.document.write(`<td>${resident.flatNo}</td>`);
    printWindow.document.write(`<td>${resident.gothram}</td>`);
    printWindow.document.write(`<td>${resident.familyMembers}</td>`);
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
