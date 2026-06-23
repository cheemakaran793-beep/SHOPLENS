export default async function handler(req, res) {
  // Set headers to allow JSON
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image received" });

    // TEST: Call SerpApi directly with a dummy query to see if it responds
    const query = "iphone 15";
    const apiKey = process.env.SERPAPI_API_KEY;
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.shopping_results && data.shopping_results.length > 0) {
      return res.status(200).json({
        product_name: data.shopping_results[0].title,
        price: data.shopping_results[0].price
      });
    } else {
      return res.status(200).json({ product_name: "No results found", price: "N/A" });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
