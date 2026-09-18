import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Category from "./models/categoryModel.js";
import Product from "./models/productModel.js";

dotenv.config();

const catalog = [
  ["Sneakers", "Nike Air Max 270", "Nike", 149, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900", "Lightweight everyday sneakers with responsive cushioning and a clean streetwear silhouette."],
  ["Sneakers", "Court Vision Low", "Nike", 89, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900", "A timeless low-top sneaker made for everyday comfort and easy styling."],
  ["Sneakers", "Classic Leather Runner", "Puma", 110, "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900", "Soft leather upper and a flexible sole for a polished casual look."],
  ["Sneakers", "Retro Suede Trainer", "Adidas", 120, "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900", "A retro-inspired trainer with a premium suede finish and durable rubber outsole."],
  ["Watches", "Minimal Steel Watch", "Fossil", 180, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900", "A refined stainless steel watch with a minimal face for every occasion."],
  ["Watches", "Chronograph Black", "Rolex", 420, "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900", "A bold chronograph design with precise movement and a confident black finish."],
  ["Watches", "Classic Gold Dial", "Casio", 75, "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900", "A warm gold-tone classic that adds a subtle statement to your everyday look."],
  ["Bags", "Everyday Leather Tote", "Coach", 210, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900", "Roomy structured tote with comfortable handles and an easy-to-organize interior."],
  ["Bags", "Canvas Weekender", "Herschel", 95, "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=900", "A versatile weekender built for short trips, gym days, and daily carry."],
  ["Bags", "City Crossbody", "Michael Kors", 160, "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900", "Compact crossbody bag with a polished finish and room for your essentials."],
  ["Clothing", "Oversized Cotton Hoodie", "Puma", 68, "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900", "Soft heavyweight cotton hoodie with a relaxed fit and everyday warmth."],
  ["Clothing", "Relaxed Linen Shirt", "Uniqlo", 55, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900", "Breathable linen blend shirt designed for effortless warm-weather dressing."],
  ["Clothing", "Essential White Tee", "H&M", 25, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900", "A comfortable everyday tee with a clean neckline and dependable fit."],
  ["Accessories", "Polarized Sunglasses", "Ray-Ban", 130, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900", "Classic polarized sunglasses with a lightweight frame and full UV protection."],
  ["Accessories", "Everyday Cap", "New Era", 32, "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900", "A structured cotton cap with an adjustable fit and understated branding."],
  ["Accessories", "Leather Card Holder", "Fossil", 45, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900", "Slim leather card holder with practical slots for your daily essentials."],
];

const seedProducts = async () => {
  await connectDB();

  try {
    const categoryNames = [...new Set(catalog.map(([category]) => category))];
    const categories = {};

    for (const name of categoryNames) {
      categories[name] = await Category.findOneAndUpdate(
        { name },
        { name },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    for (const [category, name, brand, price, image, description] of catalog) {
      await Product.findOneAndUpdate(
        { name },
        {
          name,
          image,
          brand,
          quantity: 1,
          category: categories[category]._id,
          description,
          rating: 4,
          numReviews: 0,
          price,
          countInStock: 20,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Seeded ${catalog.length} products across ${categoryNames.length} categories.`);
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts().catch((error) => {
  console.error(`Product seed failed: ${error.message}`);
  process.exitCode = 1;
});
