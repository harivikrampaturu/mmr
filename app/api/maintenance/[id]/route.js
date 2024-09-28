import dbConnect from '@/lib/dbConnect';
import MaintenanceMonth from '@/models/MaintenanceMonth';

// GET request to fetch a specific maintenance month by ID
export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params;

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

// PUT request to update a specific maintenance month by ID
export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;
  const body = await req.json();

  try {
    const updatedMonth = await MaintenanceMonth.findByIdAndUpdate(id, body, {
      new: true
    });

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

// DELETE request to delete a specific maintenance month by ID
export async function DELETE(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const deletedMonth = await MaintenanceMonth.findByIdAndDelete(id);

    if (!deletedMonth) {
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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Maintenance month deleted successfully'
      }),
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
