import { useEffect, useState } from 'react'
import { fetchBooks } from '../api'
import type { Book } from '../types'

export default function useBooks(query?: string) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchBooks(query)
      .then((data) => {
        if (!mounted) return
        setBooks(data)
      })
      .catch(() => {
        if (!mounted) return
        setError('Failed to fetch books')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [query])

  return { books, loading, error }
}
