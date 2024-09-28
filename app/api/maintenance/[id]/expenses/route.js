import dbConnect from '@/lib/dbConnect';
import MaintenanceMonth from '@/models/MaintenanceMonth';

// POST request to add an expense for a specific maintenance month
export async function POST(req, { params }) {
  await dbConnect();

  const { id } = params;
  const body = await req.json();

  try {
    const updatedMonth = await MaintenanceMonth.findByIdAndUpdate(
      id,
      { $push: { expenses: body } },
      { new: true }
    );

    if (!updatedMonth) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Maintenance month not found'
        }),
        {
          status: 404
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: updatedMonth }), {
      status: 201
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400
      }
    );
  }
}

// PUT request to update an expense by ID for a specific maintenance month
export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;
  const body = await req.json();

  try {
    const maintenanceMonth = await MaintenanceMonth.findById(id);

    if (!maintenanceMonth) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Maintenance month not found'
        }),
        {
          status: 404
        }
      );
    }

    const expenseIndex = maintenanceMonth.expenses.findIndex(
      (exp) => exp._id.toString() === body._id
    );

    if (expenseIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: 'Expense not found' }),
        {
          status: 404
        }
      );
    }

    maintenanceMonth.expenses[expenseIndex] = body; // update the specific expense
    await maintenanceMonth.save();

    return new Response(
      JSON.stringify({ success: true, data: maintenanceMonth }),
      {
        status: 200
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400
      }
    );
  }
}

// DELETE request to remove an expense by ID for a specific maintenance month
export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = params;
  const body = await req.json();

  try {
    const updatedMonth = await MaintenanceMonth.findByIdAndUpdate(
      id,
      { $pull: { expenses: { _id: body._id } } },
      { new: true }
    );

    if (!updatedMonth) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Maintenance month not found'
        }),
        {
          status: 404
        }
      );
    }

    return new Response(JSON.stringify({ success: true, data: updatedMonth }), {
      status: 200
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400
      }
    );
  }
}
