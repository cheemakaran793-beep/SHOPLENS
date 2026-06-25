export default async function handler(req, res) {

  const categories = [
    { title: "Clothing", query: "trending clothing india" },
    { title: "Shoes", query: "trending shoes india" },
    { title: "Beauty Products", query: "trending beauty products india" },
    { title: "Accessories", query: "trending accessories india" },
    { title: "Gadgets", query: "trending gadgets india" }
  ];

  try {

    const results = [];

    for (const category of categories) {

      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
          category.query
        )}&gl=in&hl=en&num=10&api_key=${process.env.SERPAPI_KEY}`
      );

      const data = await response.json();

      const products = (data.shopping_results || [])
        .slice(0, 8)
        .map(item => ({
          name: item.title || "Unknown Product",
          price: item.price || "Price unavailable",
          image:
            item.thumbnail ||
            item.image ||
            "https://via.placeholder.com/500?text=No+Image",
          source: item.source || "Online Store",
          link: item.link || item.product_link || "#",
          rating: item.rating || "4.5",
          reviews: item.reviews || 100,
          trending_score: Math.floor(Math.random() * 20) + 80,
          discount: Math.floor(Math.random() * 50) + 10,
          badge: ["🔥 Hot", "🚀 Rising", "👑 Bestseller"][
            Math.floor(Math.random() * 3)
          ]
        }));

      results.push({
        title: category.title,
        products
      });
    }

    return res.status(200).json({
      updated_at: new Date().toISOString(),
      categories: results
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }
}
