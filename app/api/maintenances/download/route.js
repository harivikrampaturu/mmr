import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import dbConnect from '@/lib/dbConnect';
import MaintenanceModel from '@/models/Maintenance';

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

    // Initialize PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Table Header
    page.drawText('MATRI MIRRA RESIDENCY', {
      x: 50,
      y: height - 50,
      size: 14,
      font
    });
    page.drawText(`Balance Sheet for the Month of ${monthName}`, {
      x: 50,
      y: height - 70,
      size: 12,
      font
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
      (sum, entry) => sum + (maintenance.partialAmount || 0),
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

    // Table Rows
    const rowStartY = height - 100;
    let yPosition = rowStartY;
    const rowHeight = 20;

    // Column titles
    page.drawText('SNO.', { x: 50, y: yPosition, size: 12, font });
    page.drawText('Description', { x: 100, y: yPosition, size: 12, font });
    page.drawText('Amount', { x: 400, y: yPosition, size: 12, font });

    // Rows with data
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
        sno: 'Total',
        description: 'Total',
        amount: totalOccupiedAmount + totalPartialAmount + additionalIncome
      }
    ];

    yPosition -= rowHeight;
    rows.forEach((row) => {
      page.drawText(row.sno.toString(), { x: 50, y: yPosition, size: 12 });
      page.drawText(row.description, { x: 100, y: yPosition, size: 12 });
      page.drawText(`Rs.${row.amount}`, { x: 400, y: yPosition, size: 12 });
      yPosition -= rowHeight;
    });

    // Spacer Row
    yPosition -= rowHeight;

    // Expenditures Header
    page.drawText(`Expenditures of ${monthName}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font
    });
    yPosition -= rowHeight;

    // Expenses Table Column Titles
    page.drawText('SNO.', { x: 50, y: yPosition, size: 12 });
    page.drawText('Description', { x: 100, y: yPosition, size: 12 });
    page.drawText('Date', { x: 250, y: yPosition, size: 12 });
    page.drawText('Amount', { x: 350, y: yPosition, size: 12 });
    page.drawText('Bill (A/NA)', { x: 450, y: yPosition, size: 12 });

    // Expenses Rows
    yPosition -= rowHeight;
    maintenance.expenses?.forEach((expense, index) => {
      page.drawText((index + 1).toString(), { x: 50, y: yPosition, size: 10 });
      page.drawText(expense.name || 'N/A', { x: 100, y: yPosition, size: 10 });
      page.drawText(expense.expenseDate || 'N/A', {
        x: 250,
        y: yPosition,
        size: 10
      });
      page.drawText(`Rs.${expense.amount || 0}`, {
        x: 350,
        y: yPosition,
        size: 10
      });
      page.drawText(expense.bill || 'N/A', { x: 450, y: yPosition, size: 10 });
      yPosition -= rowHeight;
    });

    // Total Expenses Row
    page.drawText('Total Expenses', { x: 100, y: yPosition, size: 12, font });
    page.drawText(`Rs.${expensesTotal}`, {
      x: 400,
      y: yPosition,
      size: 12,
      font
    });
    yPosition -= rowHeight;

    // Spacer Row
    yPosition -= rowHeight;

    // Overall Total
    page.drawText(`Overall Total: Rs.${overallTotal}`, {
      x: 50,
      y: yPosition,
      size: 16,
      font,
      color: rgb(1, 0, 0)
    });

    // Save and return the PDF
    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${monthName}-Maintenance-Statement.pdf"`
      }
    });
  }

  // Default GET request handler if no monthName is provided
  const maintenance = await MaintenanceModel.find({});
  return new Response(JSON.stringify(maintenance), { status: 200 });
}
