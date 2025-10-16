// Minimal API helper using the browser fetch API to avoid adding axios as a dependency.
import type { Book } from '../types'

export async function fetchBooks(query?: string): Promise<Book[]> {
  // This is a placeholder. Replace the URL with your backend endpoint.
  const url = query ? `/api/books?search=${encodeURIComponent(query)}` : '/api/books'
  const res = await fetch(url)
  if (!res.ok) return []
  try {
    const data = await res.json()
    return data as Book[]
  } catch {
    return []
  }
}

export default { fetchBooks }
