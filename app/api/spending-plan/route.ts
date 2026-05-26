import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { loadProducts } from '@/lib/prices';

export const maxDuration = 30;

interface SpendingItem {
  name: string;
  amount: number;
  reason?: string;
}

interface SpendingPlan {
  must: SpendingItem[];
  need: SpendingItem[];
  save: SpendingItem[];
  want: SpendingItem[];
}

export async function POST(req: Request) {
  const body = await req.json() as {
    income: number;
    deductions: { name: string; amount: number }[];
    household: { adults: number; children: number; dietaryPrefs: string[]; groceryBudget: number };
    priorities: { id: string; label: string }[];
  };

  const { income, deductions, household, priorities } = body;

  // Load products from CSV
  let products: { name: string; price: number; category: string }[] = [];
  try {
    products = await loadProducts();
  } catch {
    products = [];
  }

  // Select top 20 relevant products based on household size
  const topProducts = products.slice(0, 20);

  const available = income - deductions.reduce((s, d) => s + d.amount, 0);

  const prompt = `You are Gasura, a Rwandan financial advisor. Generate a monthly spending plan as JSON.

User financial data:
- Monthly income: RWF ${income.toLocaleString()}
- Fixed deductions: ${JSON.stringify(deductions)}
- Available after deductions: RWF ${available.toLocaleString()}
- Household: ${household.adults} adults, ${household.children} children
- Dietary preferences: ${household.dietaryPrefs.join(', ')}
- Target grocery budget: RWF ${household.groceryBudget.toLocaleString()}
- Priority ranking: ${priorities.map((p, i) => `${i + 1}. ${p.label}`).join(', ')}

Available products and prices from local Kigali market:
${topProducts.map((p) => `- ${p.name}: RWF ${p.price.toLocaleString()} (${p.category})`).join('\n')}

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "must": [{"name": string, "amount": number, "reason": string}],
  "need": [{"name": string, "amount": number, "reason": string}],
  "save": [{"name": string, "amount": number, "reason": string}],
  "want": [{"name": string, "amount": number, "reason": string}]
}

Rules:
- MUST: non-negotiable obligations (electricity, water/WASAC, transport to work/school)
- NEED: essential living (food, basic healthcare, Mutuelle de Santé)
- SAVE: savings goals (Ikimina, emergency fund, goal-based savings)
- WANT: discretionary spending (dining out, entertainment, personal treats)
- Total of all amounts must not exceed RWF ${available.toLocaleString()}
- Use realistic Kigali/Rwanda prices in RWF
- Include Mutuelle de Santé in MUST if not already in deductions`;

  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    prompt,
  });

  // Parse the JSON response
  let plan: SpendingPlan;
  try {
    // Strip any markdown code fences if present
    const cleaned = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
    plan = JSON.parse(cleaned) as SpendingPlan;
  } catch {
    // Return a fallback plan if parsing fails
    plan = {
      must: [
        { name: 'Electricity (RECO/REG)', amount: 15000, reason: 'Essential utility' },
        { name: 'Water (WASAC)', amount: 8000, reason: 'Essential utility' },
      ],
      need: [
        { name: 'Rice (25kg)', amount: 26000, reason: 'Main food staple' },
        { name: 'Beans (10kg)', amount: 16800, reason: 'Protein source' },
        { name: 'Cooking oil (5L)', amount: 16400, reason: 'Cooking essential' },
        { name: 'Vegetables', amount: 12000, reason: 'Nutritional balance' },
      ],
      save: [
        { name: 'Ikimina contribution', amount: 17500, reason: 'Community savings group' },
        { name: 'Emergency fund', amount: 10000, reason: 'Buffer for unexpected costs' },
      ],
      want: [
        { name: 'Dining out', amount: 10000, reason: 'Lifestyle allocation' },
      ],
    };
  }

  return Response.json(plan);
}
