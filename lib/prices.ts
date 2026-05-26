import fs from 'fs/promises';
import path from 'path';

export interface Product {
  name: string;
  price: number;
  category: string;
}

/**
 * Reads and parses the products CSV from the public/data directory.
 * Handles prices formatted like "9,900.00" (strips commas before parsing).
 */
export async function loadProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'products_with_category.csv');

  let content: string;
  try {
    content = await fs.readFile(filePath, 'utf-8');
  } catch {
    return [];
  }

  const lines = content.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Detect header row — look for column names
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  const nameIdx = header.findIndex((h) => h === 'name' || h === 'product' || h === 'item' || h === 'product_name');
  const priceIdx = header.findIndex((h) => h === 'price' || h === 'unit_price' || h === 'cost');
  const categoryIdx = header.findIndex((h) => h === 'category' || h === 'cat' || h === 'type');

  // Fallback: assume name=0, price=1, category=2
  const nIdx = nameIdx >= 0 ? nameIdx : 0;
  const pIdx = priceIdx >= 0 ? priceIdx : 1;
  const cIdx = categoryIdx >= 0 ? categoryIdx : 2;

  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV fields that may be quoted
    const cols = parseCSVLine(line);
    if (cols.length < 2) continue;

    const name = (cols[nIdx] ?? '').trim().replace(/^["']|["']$/g, '');
    const rawPrice = (cols[pIdx] ?? '').trim().replace(/^["']|["']$/g, '');
    const category = (cols[cIdx] ?? 'General').trim().replace(/^["']|["']$/g, '');

    if (!name) continue;

    // Strip commas from price (e.g., "9,900.00" → "9900.00") then parse
    const price = parseFloat(rawPrice.replace(/,/g, ''));
    if (isNaN(price)) continue;

    products.push({ name, price, category });
  }

  return products;
}

/**
 * Minimal CSV line parser: handles quoted fields with embedded commas.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Toggle quote state; handle "" escape inside quotes
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
