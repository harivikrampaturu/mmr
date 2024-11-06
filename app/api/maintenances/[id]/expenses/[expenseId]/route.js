// app/api/maintenances/[maintenanceId]/expenses/[expenseId]/route.js
import dbConnect from '@/lib/dbConnect';
// import { authenticate } from '@/lib/middleware';
import Maintenance from '@/models/Maintenance';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// GET: Fetch a specific expense by expense ID for a given maintenance ID
export async function GET(request, { params }) {
  /*   const authResponse = await authenticate(request);

  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse; // Return authentication failure response
  } */

  await dbConnect(); // Ensure you are connected to the database

  // Capture both parameters correctly
  const { id: maintenanceId, expenseId } = params;

  try {
    console.log(
      `Fetching expense for maintenance ID: ${maintenanceId}, expense ID: ${expenseId}`
    );

    // Find the specific maintenance document that contains the expense
    const maintenance = await Maintenance.findOne({
      _id: new mongoose.Types.ObjectId(maintenanceId),
      'expenses._id': new mongoose.Types.ObjectId(expenseId) // Use the correct IDs
    });

    if (!maintenance) {
      console.error(`Maintenance not found for ID: ${maintenanceId}`);
      return NextResponse.json(
        { message: 'Maintenance or expense not found' },
        { status: 404 }
      );
    }

    // Get the specific expense by its ID
    const expense = maintenance.expenses.id(expenseId);

    if (!expense) {
      console.error(`Expense not found for ID: ${expenseId}`);
      return NextResponse.json(
        { message: 'Expense not found' },
        { status: 404 }
      );
    }

    // Return the expense as JSON
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
