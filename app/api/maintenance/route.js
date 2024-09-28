import dbConnect from '@/lib/dbConnect';
import MaintenanceMonth from '@/models/MaintenanceMonth';

export async function GET(req, res) {
  await dbConnect();

  try {
    const maintenanceMonths = await MaintenanceMonth.find({});
    return new Response(
      JSON.stringify({ success: true, data: maintenanceMonths }),
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

export async function POST(req, res) {
  await dbConnect();

  try {
    const body = await req.json();
    const newMonth = await MaintenanceMonth.create(body);
    return new Response(JSON.stringify({ success: true, data: newMonth }), {
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
