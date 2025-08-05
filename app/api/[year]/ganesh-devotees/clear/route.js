import dbConnect from '@/lib/dbConnect';
import Devotee from '@/models/Devotee';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { year } = params;

    // Clear contribution, pooja, and comments for all devotees in the specified year
    const result = await Devotee.updateMany(
      { year: parseInt(year) },
      {
        $set: {
          contribution: 0,
          pooja: '',
          comments: ''
        }
      }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `No devotees found for year ${year}`
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully cleared contribution, pooja, and comments for ${result.modifiedCount} devotees in year ${year}`,
        data: {
          year: parseInt(year),
          devoteesMatched: result.matchedCount,
          devoteesModified: result.modifiedCount
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Clear operation failed',
        error: error.message
      }),
      { status: 500 }
    );
  }
}
