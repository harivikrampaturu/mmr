// app/api/maintenances/[maintenanceId]/expenses/[expenseId]/route.js
import dbConnect from '@/lib/dbConnect';
import { authenticate } from '@/lib/middleware';
import Maintenance from '@/models/Maintenance';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// GET: Fetch a specific Maintenance Record by Maintenance Record ID for a given maintenance ID
export async function GET(request, { params }) {
  /*   const authResponse = await authenticate(request);

  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse; // Return authentication failure response
  } */

  await dbConnect(); // Ensure you are connected to the database

  // Capture both parameters correctly
  const { id, mId } = params;

  try {
    console.log(
      `Fetching Maintenance Record for maintenance ID: ${id}, record ID: ${mId}`
    );

    // Find the specific maintenance document that contains the Maintenance Record
    const maintenance = await Maintenance.findOne({
      _id: new mongoose.Types.ObjectId(id),
      'maintenanceData._id': new mongoose.Types.ObjectId(mId) // Use the correct IDs
    });

    if (!maintenance) {
      console.error(`Maintenance not found for ID: ${maintenanceId}`);
      return NextResponse.json(
        { message: 'Maintenance or Maintenance Record not found' },
        { status: 404 }
      );
    }

    // Get the specific Maintenance Record by its ID
    const record = maintenance.maintenanceData.id(mId);

    if (!record) {
      console.error(`Record not found for ID: ${mId}`);
      return NextResponse.json(
        { message: 'Record not found' },
        { status: 404 }
      );
    }

    // Return the Maintenance Record as JSON
    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT: Update a specific maintenenance by ID
export async function PUT(request, { params }) {
  /*   const authResponse = await authenticate(request);
  if (authResponse instanceof Response && authResponse.status === 401) {
    return authResponse;
  } */
  try {
    await dbConnect();

    const { id, mId } = params; // Ensure you are getting the correct expense ID from params
    const updatedRecordData = await request.json();

    const maintenance = await Maintenance.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        'maintenanceData._id': new mongoose.Types.ObjectId(mId)
      },
      {
        $set: { 'maintenanceData.$': updatedRecordData }
      },
      { new: true }
    );

    if (!maintenance) {
      return NextResponse.json(
        { message: 'Maintenance not found' },
        { status: 404 }
      );
    }

    // Optionally return the updated expense
    const updatedRecord = maintenance.maintenanceData.id(id);
    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
