const base_URL = process.env.NEXT_PUBLIC_MENU_API_URL;

export async function fetchMenu(page=0, size=10) {
  const res = await fetch(`${base_URL}/api/v1/fooditem/getAllFoodItems?page=${page}&size=${size}`);
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}
