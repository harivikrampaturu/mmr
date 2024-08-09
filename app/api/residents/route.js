import dbConnect from '@/lib/dbConnect';
import Resident from '@/models/Resident';

export async function GET(request) {
  try {
    await dbConnect();
    const residents = await Resident.find({});
    return new Response(JSON.stringify({ success: true, data: residents }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching residents:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching residents' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const resident = await Resident.create(data);
    return new Response(JSON.stringify({ success: true, data: resident }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating resident:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error creating resident' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const resident = await Resident.findByIdAndUpdate(data.id, data, {
      new: true
    });
    return new Response(JSON.stringify({ success: true, data: resident }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating resident:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error updating resident' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
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
  } catch (error) {
    console.error('Error deleting resident:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error deleting resident' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
