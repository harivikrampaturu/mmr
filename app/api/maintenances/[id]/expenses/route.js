// app/api/expense/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import { authenticate } from '@/lib/middleware';
import Maintenance from '@/models/Maintenance';
import mongoose from 'mongoose';

// GET: Fetch a specific expense by ID
export async function GET(request, { params }) {
  const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  }
  await dbConnect();
  const { id } = params;

  // Find the specific expense within the Maintenance collection
  const maintenance = await Maintenance.findOne({
    'expenses._id': mongoose.Types.ObjectId(id)
  });

  if (!maintenance) {
    return new Response('Expense not found', { status: 404 });
  }

  const expense = maintenance.expenses.id(id);
  return new Response(JSON.stringify(expense), { status: 200 });
}

// PUT: Update a specific expense by ID
export async function PUT(request, { params }) {
  const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  }
  await dbConnect();
  const { id } = params;
  const updatedExpenseData = await request.json();

  const maintenance = await Maintenance.findOneAndUpdate(
    { 'expenses._id': mongoose.Types.ObjectId(id) },
    {
      $set: { 'expenses.$': updatedExpenseData }
    },
    { new: true }
  );

  if (!maintenance) {
    return new Response('Expense not found', { status: 404 });
  }

  return new Response(JSON.stringify(maintenance), { status: 200 });
}

// DELETE: Delete a specific expense by ID
export async function DELETE(request, { params }) {
  const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  }
  await dbConnect();

  const { eid } = await request.json();

  const maintenance = await Maintenance.findOneAndUpdate(
    { 'expenses._id': new mongoose.Types.ObjectId(eid) },
    { $pull: { expenses: { _id: new mongoose.Types.ObjectId(eid) } } },
    { new: true }
  );

  if (!maintenance) {
    return new Response('Expense not found', { status: 404 });
  }

  return new Response('Expense deleted', { status: 200 });
}
