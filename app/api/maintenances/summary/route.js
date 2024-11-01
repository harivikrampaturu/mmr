import dbConnect from '@/lib/dbConnect';
import MaintenanceModel from '@/models/Maintenance';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';

export async function GET(request) {
  await dbConnect();

  const url = new URL(request.url);
  const monthName = url.searchParams.get('monthName');

  if (monthName) {
    // Fetch maintenance data
    const maintenance = await MaintenanceModel.findOne({ monthName });
    if (!maintenance) {
      return new Response(
        JSON.stringify({ error: 'Statement not found for this month' }),
        { status: 404 }
      );
    }

    // Initialize workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Maintenance Statement');

    // Styling options
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' }
    };
    const cellStyle = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    // Add Header
    worksheet.mergeCells('A1', 'E1');
    worksheet.getCell('A1').value = 'MATRI MIRRA RESIDENCY';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2', 'E2');
    worksheet.getCell(
      'A2'
    ).value = `Balance Sheet for the Month of ${monthName}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Table Header
    worksheet.addRow(['SNO.', 'Description', 'Amount']).eachCell((cell) => {
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      Object.assign(cell, cellStyle);
    });

    // Calculations with default values to avoid undefined errors
    const unoccupiedFlats =
      maintenance.maintenanceData?.filter(
        (entry) => entry.payment === 'partial'
      ) || [];
    const totalPartialAmount = unoccupiedFlats.reduce(
      (sum, entry) => sum + (maintenance.partialAmount || 0),
      0
    );

    const paidFlats =
      maintenance.maintenanceData?.filter(
        (entry) => entry.payment === 'paid'
      ) || [];
    const totalOccupiedAmount = paidFlats.reduce(
      (sum, entry) => sum + (maintenance.amount || 0),
      0
    );

    const additionalIncome = maintenance.additionalIncome || 0;
    const expensesTotal =
      maintenance.expenses?.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0
      ) || 0;
    const overallTotal =
      totalOccupiedAmount +
      totalPartialAmount +
      additionalIncome -
      expensesTotal;

    // Rows Data
    const rows = [
      {
        sno: '1',
        description: 'Opening Balance',
        amount: maintenance.openingBalance || 0
      },
      {
        sno: '2',
        description: `Occupied Flats: ${paidFlats.length}`,
        amount: totalOccupiedAmount
      },
      {
        sno: '3',
        description: `Unoccupied Flats: ${unoccupiedFlats.length}`,
        amount: totalPartialAmount
      },
      { sno: '4', description: 'Additional Income', amount: additionalIncome },
      {
        sno: '',
        description: 'Total',
        amount: totalOccupiedAmount + totalPartialAmount + additionalIncome
      }
    ];
    worksheet.mergeCells(`C3:E3`);

    rows.forEach((row) => {
      const newRow = worksheet.addRow([row.sno, row.description, row.amount]);
      // Merge columns C, D, and E for the amount cell
      worksheet.mergeCells(`C${newRow.number}:E${newRow.number}`);
      newRow.eachCell((cell, cellNumber) => {
        Object.assign(cell, cellStyle);
        if (typeof row.amount === 'number' && cellNumber !== 1)
          cell.numFmt = '₹#,##0.00'; // Currency formatting
      });
    });

    // Spacer Row
    // worksheet.addRow([]);

    // Expenses Header
    // worksheet.addRow([`Expenditures of ${monthName}`]);
    worksheet.addRow(['']);
    worksheet.mergeCells('A10', 'E10');
    worksheet.getCell('A10').value = `Expenditures of ${monthName}`;
    worksheet.getCell('A10').alignment = { horizontal: 'center' };

    // Expenses Table Header
    worksheet
      .addRow(['SNO.', 'Description', 'Date', 'Bill (A/NA)', 'Amount'])
      .eachCell((cell) => {
        cell.font = headerStyle.font;
        cell.alignment = headerStyle.alignment;
        Object.assign(cell, cellStyle);
      });

    // Expenses Rows
    maintenance.expenses?.forEach((expense, index) => {
      const newRow = worksheet.addRow([
        index + 1,
        expense.name || 'N/A',
        format(new Date(expense.expenseDate), 'dd-MM-yyyy') || 'N/A',
        Boolean(expense.bill) ? 'A' : 'NA' || 'NA',
        expense.amount || 0
      ]);
      newRow.eachCell((cell, colNumber) => {
        Object.assign(cell, cellStyle);
        if (typeof expense.amount === 'number' && colNumber !== 1)
          cell.numFmt = '₹#,##0.00';
      });
    });

    // Total Expenses
    worksheet
      .addRow(['', '', '', 'Total Expenses', expensesTotal])
      .eachCell((cell, colNumber) => {
        if (colNumber === 5) cell.numFmt = '₹#,##0.00';
        Object.assign(cell, cellStyle);
      });

    // Overall Total
    worksheet
      .addRow(['', '', '', '', `Overall Total: Rs.${overallTotal}`])
      .getCell(5).alignment = { horizontal: 'right' };

    //   Two Empty rows
    worksheet.addRow(['']);
    worksheet.addRow(['']);

    worksheet
      .addRow([
        '',
        '',
        `This is Auto Generated Sheet. No Signature Required`,
        '',
        ''
      ])
      .getCell(5).alignment = { horizontal: 'center' };

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return response as downloadable Excel file
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${monthName}-Maintenance-Statement.xlsx"`
      }
    });
  }

  // Default GET request handler if no monthName is provided
  const maintenance = await MaintenanceModel.find({});
  return new Response(JSON.stringify(maintenance), { status: 200 });
}
