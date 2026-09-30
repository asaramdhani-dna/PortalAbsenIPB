// Vercel Serverless Function: proxy ke Google Apps Script
// Mengatasi masalah CORS — Vercel server yang memanggil GAS (server-to-server),
// lalu hasilnya dikirim ke browser. Tidak ada CORS karena request dari server.

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwBGxuG3wVjYgXNw6UmfyN-sEp72tOD46XK5dCXB3wXQqb7YG2-zB4r0fnYj1KwGjGY/exec';

export default async function handler(req, res) {
  try {
    // Teruskan semua query params ke GAS
    const queryString = new URL(req.url, 'http://localhost').search;
    const targetUrl   = GAS_URL + (queryString || '');

    // Fetch dari server (Node.js) — tidak kena CORS
    const gasRes = await fetch(targetUrl, {
      method:   'GET',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json, text/plain, */*',
      }
    });

    const text = await gasRes.text();

    // Kirim ke browser dengan header CORS agar browser bisa baca
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(text);

  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ status: 'error', message: 'Proxy error: ' + err.message });
  }
}
