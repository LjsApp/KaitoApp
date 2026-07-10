import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generate() {
  console.log("Fetching fallback data from Supabase...");
  const data = {};

  // Fetch products
  console.log("Fetching products...");
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  data.products = products || [];

  // Fetch categories
  console.log("Fetching categories...");
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });
  data.categories = categories || [];

  // Fetch articles
  console.log("Fetching articles...");
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });
  data.articles = articles || [];

  // Fetch downloads
  console.log("Fetching downloads...");
  const { data: downloads } = await supabase
    .from("downloads")
    .select("*")
    .order("created_at", { ascending: false });
  data.downloads = downloads || [];

  // Write to src/lib/fallback-data.json
  const outputPath = path.resolve("./src/lib/fallback-data.json");
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  console.log(`✅ Fallback data written to ${outputPath}`);
}

generate().catch(console.error);
