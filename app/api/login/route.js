import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  const { username, password } = await request.json();
  await dbConnect();

  const adminUser = await User.findOne({ username, password });

  if (adminUser) {
    return new Response(null, { status: 200 });
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}
