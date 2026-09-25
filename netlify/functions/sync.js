// Ta funkcija teče na Netlify strežniku (ne v brskalniku uporabnika),
// zato ne pride do CORS ali omrežnih/požarnozidnih blokad, ki jih ima
// lahko brskalnik posameznega uporabnika do script.google.com.
//
// Geslo (SECRET) je tukaj, na strežniku - nikoli ni vidno v kodi strani,
// ki jo vidijo uporabniki v brskalniku.

const GOOGLE_URL = 'https://script.google.com/macros/s/AKfycbwLfet0kgbj6VxJUhzc2Zro3U6Vmu_TvbTp7ihqnMnN38QcSMAEIyjnJ6zx1HDGf6M6/exec';
const SECRET = '1234'; // <-- mora biti enako kot SECRET v apps-script-koda.gs

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    let targetUrl;

    if (params.action === 'set') {
      const qs = new URLSearchParams({
        action: 'set',
        token: SECRET,
        value: params.value || ''
      }).toString();
      targetUrl = GOOGLE_URL + '?' + qs;
    } else {
      targetUrl = GOOGLE_URL;
    }

    const response = await fetch(targetUrl);
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: String(err) })
    };
  }
};
