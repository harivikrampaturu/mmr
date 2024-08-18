const translateGoogle = require('translate-google');

export async function GET(request) {
  // Extract query parameters from the URL
  const url = new URL(request.url);
  const text = url.searchParams.get('text');
  const targetLang = url.searchParams.get('targetLang');

  if (!text || !targetLang) {
    return new Response(
      JSON.stringify({
        error: 'Missing required query parameters: text and targetLang'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  try {
    const res = await translateGoogle(text, { from: 'en', to: targetLang });
    console.log(res);

    // Return the translation in the response
    return new Response(res, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
