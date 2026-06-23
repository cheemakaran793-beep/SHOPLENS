export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      error: "Search query is required"
    });
  }

  const SERPAPI_KEY = process.env.SERPAPI_KEY;

  if (!SERPAPI_KEY) {
    return res.status(500).json({
      error: "SERPAPI_KEY is missing in Vercel Environment Variables"
    });
  }

  try {

    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&gl=in&hl=en&location=India&num=8&api_key=${SERPAPI_KEY}`
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({
        error: data.error
      });
    }

    const products = (data.shopping_results || []).slice(0, 4).map(item => ({

      name: item.title,

      description:
        item.snippet ||
        `${item.source || "Verified Store"} • ${item.price || "See website"}`,

      price: item.price || "Check Website",

      rating: item.rating || "N/A",

      image: item.thumbnail || "",

      status: "SAFE",

      url:
        `https://www.google.com/search?q=` +
        encodeURIComponent(item.title + " " + (item.source || "")) +
        "&btnI=I"

    }));

    return res.status(200).json({
      results: products
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }

}
