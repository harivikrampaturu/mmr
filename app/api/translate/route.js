// pages/api/translate.js
// import { Translate } from '@google-cloud/translate';
/* 
const { Translate } = require('@google-cloud/translate').v2;


 */

// Import the Google Cloud Translate client library
// import { Translate } from '@google-cloud/translate';
const { Translate } = require('@google-cloud/translate').v2;

const projectId = 'meeamitech-95ce1';

const translate = new Translate({ projectId });

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
    // Translate the text into the target language
    const [translation] = await translate.translate(text, targetLang);

    // Return the translation in the response
    return new Response(JSON.stringify({ translation }), {
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
