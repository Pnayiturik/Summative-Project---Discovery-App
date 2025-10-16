import type { Book } from '../types'

export default function BookDetails({ book }: { book: Book | null }) {
  if (!book) return <div>No book selected</div>
  const authorNames = Array.isArray(book.authors) ? book.authors.map(a => typeof a === 'string' ? a : a.name).join(', ') : '';
  return (
    <div className="book-details">
      <h2>{book.title}</h2>
      <p>Author: {authorNames}</p>
      <p>{book.description}</p>
    </div>
  )
}
