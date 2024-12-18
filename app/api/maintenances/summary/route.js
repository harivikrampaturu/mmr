import dbConnect from '@/lib/dbConnect';
import MaintenanceModel from '@/models/Maintenance';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { authenticate } from '@/lib/middleware';
import { PAYMENT_PAID, PAYMENT_PARTIAL } from '@/app/constants';
import { getFormatedMonthName } from '@/utils/helpers';

function formatToIndianRupee(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

export async function GET(request) {
  const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  }

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
    ).value = `Balance Sheet for the Month of ${getFormatedMonthName(
      monthName
    )} (A)`;
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
        (entry) => entry.payment === PAYMENT_PARTIAL
      ) || [];
    const totalPartialAmount = unoccupiedFlats.reduce(
      (sum, entry) => sum + (maintenance.partialAmount || 0),
      0
    );

    const paidFlats =
      maintenance.maintenanceData?.filter(
        (entry) => entry.payment === PAYMENT_PAID
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
      maintenance.openingBalance +
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
        amount:
          totalOccupiedAmount +
          totalPartialAmount +
          additionalIncome +
          maintenance.openingBalance
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
    worksheet.getCell('A10').value = `Expenditures of ${getFormatedMonthName(
      monthName
    )} (B)`;
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
        if (colNumber === 5) {
          cell.numFmt = '₹#,##0.00';
          cell.font = { color: { argb: 'FFFF0000' } };
        }
        if (colNumber === 4)
          cell.font = { bold: true, color: { argb: 'FFFF0000' } };
        Object.assign(cell, cellStyle);
      });
    //   Two Empty rows
    worksheet.addRow(['']);
    worksheet.addRow(['']);

    // Overall Total
    const overallTotalRow = worksheet.addRow([
      '',
      '',
      '',
      'Overall Total (A - B):',
      ` ${formatToIndianRupee(overallTotal)}`
    ]);

    overallTotalRow.getCell(4).font = { bold: true };
    // Align the value in the fifth column to the right
    overallTotalRow.getCell(5).alignment = { horizontal: 'right' };
    overallTotalRow.getCell(5).font = {
      bold: true,
      color: {
        argb: overallTotal >= 0 ? 'FF008000' : 'FFFF0000' // Green for >= 0, Red for < 0
      }
    };

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

    worksheet.getColumn(2).width = 30; // Column B
    worksheet.getColumn(4).width = 20; // Column D
    worksheet.getColumn(5).width = 25; // Column E

    // Center align text horizontally for column A
    worksheet.getColumn(1).eachCell((cell) => {
      cell.alignment = { horizontal: 'center' };
    });

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return response as downloadable Excel file
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${getFormatedMonthName(
          monthName
        )}-Maintenance-Statement.xlsx"`
      }
    });
  }

  // Default GET request handler if no monthName is provided
  const maintenance = await MaintenanceModel.find({});
  return new Response(JSON.stringify(maintenance), { status: 200 });
}
