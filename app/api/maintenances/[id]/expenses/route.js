// app/api/maintenances/[id]/expenses/route.js
import dbConnect from '@/lib/dbConnect';
import { authenticate } from '@/lib/middleware';
import Maintenance from '@/models/Maintenance';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// GET: Fetch a specific expense by ID
export async function GET(request, { params }) {
  const authResponse = await authenticate(request);

  // If the authentication fails (returns a response with 401), return that response
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse; // Return the authentication failure response
  }

  await dbConnect(); // Ensure you are connected to the database
  const { id } = params; // Get the ID from the request parameters

  try {
    // Log the incoming ID for debugging
    console.log(`Fetching expense for expense ID: ${id}`);

    // Find the specific maintenance document that contains the expense
    const maintenance = await Maintenance.findOne({
      'expenses._id': new mongoose.Types.ObjectId(id) // Ensure to create ObjectId correctly
    });

    if (!maintenance) {
      console.error(`Maintenance not found for expense ID: ${id}`);
      return NextResponse.json(
        { message: 'Maintenance not found' },
        { status: 404 }
      );
    }

    // Get the specific expense by its ID
    const expense = maintenance.expenses.id(id); // Use the correct id to get the specific expense

    // If the expense is not found, return a 404 response
    if (!expense) {
      console.error(`Expense not found for ID: ${id}`);
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

// PUT: Update a specific expense by ID
export async function PUT(request, { params }) {
  const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  }
  await dbConnect();

  const { id } = params; // Ensure you are getting the correct expense ID from params
  const updatedExpenseData = await request.json();

  const maintenance = await Maintenance.findOneAndUpdate(
    { 'expenses._id': mongoose.Types.ObjectId(id) }, // Correctly use the expense ID
    {
      $set: { 'expenses.$': updatedExpenseData }
    },
    { new: true }
  );

  if (!maintenance) {
    return NextResponse.json(
      { message: 'Maintenance not found' },
      { status: 404 }
    );
  }

  // Optionally return the updated expense
  const updatedExpense = maintenance.expenses.id(id);
  return NextResponse.json(updatedExpense, { status: 200 });
}

// DELETE: Delete a specific expense by ID
export async function DELETE(request, { params }) {
  const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  }

  await dbConnect();

  const { id } = params; // `id` refers to the maintenance document _id (parent record)
  const { eid } = await request.json(); // `eid` is the expense _id you want to delete

  // Ensure both `id` and `eid` are ObjectId instances
  const maintenance = await Maintenance.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id),
      'expenses._id': new mongoose.Types.ObjectId(eid)
    }, // Ensure the maintenance ID and expense ID match
    { $pull: { expenses: { _id: new mongoose.Types.ObjectId(eid) } } }, // Pull the expense with the matching _id
    { new: true } // Return the updated document
  );

  if (!maintenance) {
    // If the maintenance document or the expense is not found, return a 404 response
    return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Expense deleted' }, { status: 200 });
}
