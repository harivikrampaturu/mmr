import dbConnect from '@/lib/dbConnect';
import Resident from '@/models/Resident';
import Devotee from '@/models/Devotee';

export async function POST() {
  try {
    await dbConnect();

    // Get all residents
    const residents = await Resident.find({});

    if (residents.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No residents found to migrate'
        }),
        { status: 400 }
      );
    }

    // Check if devotees already exist for 2025
    const existingDevotees = await Devotee.find({ year: 2025 });
    if (existingDevotees.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Found ${existingDevotees.length} existing devotees for 2025. Migration aborted to prevent duplicates.`
        }),
        { status: 400 }
      );
    }

    // Convert residents to devotees with year 2025
    const devoteesToCreate = residents.map((resident) => ({
      flatNo: resident.flatNo,
      gothram: resident.gothram,
      familyMembers: resident.familyMembers,
      kids: resident.kids,
      adults: resident.adults,
      year: 2025,
      isApproved: resident.isApproved,
      contribution: resident.contribution,
      pooja: resident.pooja,
      comments: resident.comments,
      addedBy: 'Migration API'
    }));

    // Create devotees
    const createdDevotees = await Devotee.insertMany(devoteesToCreate);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully migrated ${createdDevotees.length} residents to devotees for 2025`,
        data: {
          residentsProcessed: residents.length,
          devoteesCreated: createdDevotees.length,
          year: 2025
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Migration failed',
        error: error.message
      }),
      { status: 500 }
    );
  }
}
