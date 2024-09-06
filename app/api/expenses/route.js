// pages/api/expenses/route.js
import dbConnect from '@/lib/dbConnect';
import Expense from '@/models/Expense';

// GET all expenses
export async function GET() {
  try {
    await dbConnect();
    const expenses = await Expense.find({});
    return new Response(JSON.stringify({ success: true, data: expenses }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch expenses',
        details: e.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// POST new expense
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const expense = await Expense.create(data);
    return new Response(JSON.stringify({ success: true, data: expense }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create expense',
        details: e.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// UPDATE expense by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const url = new URL(request.url);

    const id = url.pathname.split('/').pop();
    const data = await request.json();

    const updatedExpense = await Expense.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!updatedExpense) {
      return new Response(
        JSON.stringify({ success: false, message: 'Expense not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: updatedExpense }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to update expense',
        details: e.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// DELETE expense by ID
export async function DELETE(request) {
  try {
    await dbConnect();
    const url = new URL(request.url);

    const id = url.pathname.split('/').pop();
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return new Response(
        JSON.stringify({ success: false, message: 'Expense not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    return new Response(
      JSON.stringify({ success: true, message: 'Expense deleted' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to delete expense',
        details: e.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
