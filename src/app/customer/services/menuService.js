export async function fetchMenu() {
  const res = await fetch(process.env.NEXT_PUBLIC_MENU_API_URL);
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}
