import dbConnect from '@/lib/dbConnect';
import YearlyExpense from '@/models/YearlyExpense';

export async function GET(request, { params }) {
  try {
    console.log('🔍 GET /api/[year]/expenses - Starting request');
    console.log('📋 Params:', params);

    await dbConnect();
    console.log('✅ Database connected successfully');

    const { year } = params;
    console.log('📅 Year from params:', year);

    // Get expenses for the specific year
    const expenses = await YearlyExpense.find({ year: parseInt(year) }).sort({
      date: -1
    });
    console.log('📊 Found expenses:', expenses.length);
    console.log('📋 Expenses data:', expenses);

    return new Response(JSON.stringify({ success: true, data: expenses }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('❌ Error in GET /api/[year]/expenses:', e);
    console.error('❌ Error stack:', e.stack);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch expenses',
        details: e.message,
        stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { year } = params;

    const data = await request.json();
    console.log('Creating expense with data:', data);

    // Ensure year is set from the URL parameter
    data.year = parseInt(year);

    // Validate required fields
    if (!data.description || !data.amount || !data.date || !data.category) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          details: 'description, amount, date, and category are required'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const expense = await YearlyExpense.create(data);
    console.log('Created expense:', expense);

    return new Response(JSON.stringify({ success: true, data: expense }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Error creating expense:', e);
    return new Response(
      JSON.stringify({
        error: 'Failed to add expense',
        details: e.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    console.log('Updating expense with data:', data);

    if (!data.id) {
      return new Response(
        JSON.stringify({
          error: 'Missing expense ID'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const expense = await YearlyExpense.findByIdAndUpdate(data.id, data, {
      new: true
    });

    if (!expense) {
      return new Response(
        JSON.stringify({
          error: 'Expense not found'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: expense }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Error updating expense:', e);
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

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await request.json();
    console.log('Deleting expense with ID:', id);

    if (!id) {
      return new Response(
        JSON.stringify({
          error: 'Missing expense ID'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const deletedExpense = await YearlyExpense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return new Response(
        JSON.stringify({
          error: 'Expense not found'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Error deleting expense:', e);
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
