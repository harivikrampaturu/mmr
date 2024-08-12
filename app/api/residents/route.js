import dbConnect from '@/lib/dbConnect';
import Resident from '@/models/Resident';

export async function GET() {
  try {
    await dbConnect(); // Establish connection

    const residents = await Resident.find({});
    return new Response(JSON.stringify({ success: true, data: residents }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch residents',
        details: e.message
      }),
      {
        status: 500
      }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect(); // Establish connection

    const data = await request.json();
    const resident = await Resident.create(data);

    return new Response(JSON.stringify({ success: true, data: resident }), {
      status: 201
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Failed to add resident', details: e.message }),
      {
        status: 500
      }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.json();
    console.log(data, '===>');
    const resident = await Resident.findByIdAndUpdate(data.id, data, {
      new: true
    });
    return new Response(JSON.stringify({ success: true, data: resident }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to update resident',
        details: e.message
      }),
      {
        status: 500
      }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await Resident.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Failed to delete resident',
        details: e.message
      }),
      {
        status: 500
      }
    );
  }
}
