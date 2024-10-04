// app/api/expense/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import Maintenance from '@/models/Maintenance';
import mongoose from 'mongoose';

// GET: Fetch a specific expense by ID
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;

  console.log('came here tooooooo');

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
  await dbConnect();

  const { eid } = await request.json();

  console.log(' came to delete here');

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
