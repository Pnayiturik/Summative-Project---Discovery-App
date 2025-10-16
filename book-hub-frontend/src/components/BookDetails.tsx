import type { Book } from '../types'

export default function BookDetails({ book }: { book: Book | null }) {
  if (!book) return <div>No book selected</div>
  return (
    <div className="book-details">
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>{book.description}</p>
    </div>
  )
}
