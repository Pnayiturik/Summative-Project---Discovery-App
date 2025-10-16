// Lightweight wrapper so other code can swap to axios later without many changes
export async function get<T = unknown>(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Network error')
  return (await res.json()) as T
}

export default { get }
