export default async function handler(req, res) {
  try {
    // Fetch location data from the server's perspective
    const fetchRes = await fetch('https://ipapi.co/json/');
    if (!fetchRes.ok) throw new Error('ipapi failed');
    const data = await fetchRes.json();
    
    // Override IP with Vercel server info or keep the IP returned by ipapi
    res.status(200).json(data);
  } catch (err) {
    // Fallback using Vercel's edge headers if ipapi fails
    const city = req.headers['x-vercel-ip-city'] || 'Unknown City';
    const country = req.headers['x-vercel-ip-country'] || 'Unknown Country';
    res.status(200).json({ 
      ip: 'Server Node', 
      city, 
      country_name: country 
    });
  }
}
