// app/api/expense/route.js
import dbConnect from '@/lib/dbConnect';
import { authenticate } from '@/lib/middleware';
import Maintenance from '@/models/Maintenance';

export async function POST(request) {
  const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  }
  await dbConnect();
  const { maintenanceId, expense } = await request.json();

  // Find the specific Maintenance document by ID and push the new expense into the array
  const updatedMaintenance = await Maintenance.findByIdAndUpdate(
    maintenanceId,
    { $push: { expenses: expense } },
    { new: true }
  );

  if (!updatedMaintenance) {
    return new Response('Maintenance not found', { status: 404 });
  }

  return new Response(JSON.stringify(updatedMaintenance), { status: 201 });
}

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const inCollection = url.searchParams.get('inCollection') || false;

  const authResponse = await authenticate(req);
  if (
    authResponse instanceof Response &&
    authResponse.status === 401 &&
    !Boolean(inCollection)
  ) {
    return authResponse;
  }

  const { id } = params;

  try {
    await dbConnect(); // Connect to your MongoDB database

    // Fetch the maintenance document by its ID
    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return new Response(
        JSON.stringify({ message: 'Maintenance not found' }),
        {
          status: 404
        }
      );
    }

    return new Response(JSON.stringify(maintenance), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500
    });
  }
}
