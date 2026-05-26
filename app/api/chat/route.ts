import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { loadProducts } from '@/lib/prices';

export const maxDuration = 30;

function getLatestUserText(messages: UIMessage[]): string {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  if (!latestUserMessage) return '';

  return latestUserMessage.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join(' ')
    .trim();
}

function pickRelevantProducts(
  products: { name: string; price: number; category: string }[],
  userText: string,
  limit = 30,
): { name: string; price: number; category: string }[] {
  if (products.length === 0) return [];

  const tokens = userText
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);

  if (tokens.length === 0) return products.slice(0, limit);

  const scored = products
    .map((product) => {
      const searchable = `${product.name} ${product.category}`.toLowerCase();
      const score = tokens.reduce((acc, token) => acc + (searchable.includes(token) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);

  return scored.length > 0 ? scored : products.slice(0, limit);
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const latestUserText = getLatestUserText(messages);

  let products: { name: string; price: number; category: string }[] = [];
  try {
    products = await loadProducts();
  } catch {
    products = [];
  }

  const relevantProducts = pickRelevantProducts(products, latestUserText, 30);
  const priceDatasetSection = relevantProducts.length
    ? `\n\nAuthoritative local price dataset (source: public/data/products_with_category.csv):\n${relevantProducts
        .map((p) => `- ${p.name}: RWF ${p.price.toLocaleString()} (${p.category})`)
        .join('\n')}`
    : '\n\nPrice dataset source public/data/products_with_category.csv could not be loaded. If exact product prices are requested, state uncertainty clearly instead of inventing exact numbers.';

  const result = streamText({
    model: google('gemini-3-flash-preview'),
    system: `You are Gasura, a wise and firm Rwandan Financial Parent. Your goal is to help the user survive until the end of the month by prioritizing NEEDS over WANTS.

Constraints:
- Always allocate funds for Rent, Utilities, and Basic Food first.
- Reference local Kigali prices and Rwandan context (RWF currency, Mutuelle de Santé, Ikimina savings groups, WASAC utilities).
- Use the local dataset prices below as the primary source for product-specific prices whenever relevant.
- If a user asks for a luxury they cannot afford, explain why it violates the Needs-First framework.
- Respond in a supportive but disciplined tone, like a trusted financial mentor.
- Keep responses concise and actionable.${priceDatasetSection}`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
