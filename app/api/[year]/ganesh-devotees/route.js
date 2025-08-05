import dbConnect from '@/lib/dbConnect';
import Devotee from '@/models/Devotee';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { year } = params;

    // Get devotees for the specific year
    const devotees = await Devotee.find({ year: parseInt(year) }).sort({
      flatNo: 1
    });
    return new Response(JSON.stringify({ success: true, data: devotees }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch devotees',
        details: e.message
      }),
      {
        status: 500
      }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { year } = params;

    const data = await request.json();
    // Ensure year is set from the URL parameter
    data.year = parseInt(year);
    const devotee = await Devotee.create(data);

    return new Response(JSON.stringify({ success: true, data: devotee }), {
      status: 201
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Failed to add devotee', details: e.message }),
      {
        status: 500
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const data = await request.json();
    const devotee = await Devotee.findByIdAndUpdate(data.id, data, {
      new: true
    });
    return new Response(JSON.stringify({ success: true, data: devotee }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to update devotee',
        details: e.message
      }),
      {
        status: 500
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await Devotee.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to delete devotee',
        details: e.message
      }),
      {
        status: 500
      }
    );
  }
}
