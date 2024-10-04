import {
  MONTH_EXPENSES,
  MONTH_MAINTENANCE_DATA,
  PAYMENT_PENDING
} from '@/app/constants';
import dbConnect from '@/lib/dbConnect';
import Maintenance from '@/models/Maintenance';

// Function to generate maintenanceData for 50 flats
const generateMaintenanceData = () => {
  let maintenanceData = [];

  for (let floor = 1; floor <= 5; floor++) {
    for (let flat = 1; flat <= 10; flat++) {
      maintenanceData.push({
        flatNo: floor * 100 + flat,
        payment: PAYMENT_PENDING, // Default amount
        comments: '' // Default comments
      });
    }
  }

  return maintenanceData;
};

export async function POST(req) {
  try {
    await dbConnect();

    const { monthName, amount, partialAmount } = await req.json();

    // Generate maintenance data for 50 flats
    const maintenanceData = generateMaintenanceData();

    const newMaintenance = new Maintenance({
      monthName,
      amount,
      partialAmount,
      maintenanceData,
      expenses: []
    });

    await newMaintenance.save();
    return new Response(JSON.stringify(newMaintenance), { status: 201 });
  } catch (error) {
    debugger;
    return new Response(
      JSON.stringify({ message: 'Error creating new data', error }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const maintenanceData = await Maintenance.find({});

    return new Response(
      JSON.stringify({ success: true, data: maintenanceData }),
      { status: 200 }
    );
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

export async function PUT(req) {
  try {
    await dbConnect();

    const { id, type, updateData } = await req.json(); // Expect id, type, and updateData in request

    let updatedData;

    if (type === MONTH_MAINTENANCE_DATA) {
      // Update maintenanceData
      updatedData = await Maintenance.findByIdAndUpdate(
        id,
        { maintenanceData: updateData }, // Only updating maintenanceData
        { new: true }
      );
    } else if (type === MONTH_EXPENSES) {
      // Update expenses
      updatedData = await Maintenance.findByIdAndUpdate(
        id,
        { expenses: updateData }, // Only updating expenses
        { new: true }
      );
    } else {
      return new Response(JSON.stringify({ message: 'Invalid type' }), {
        status: 400
      });
    }

    if (!updatedData) {
      return new Response(JSON.stringify({ message: 'Data not found' }), {
        status: 404
      });
    }

    return new Response(JSON.stringify(updatedData), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error updating data', error }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    await Maintenance.deleteMany();

    return new Response(
      JSON.stringify({ message: 'All entries deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error deleting data', error }),
      { status: 500 }
    );
  }
}
