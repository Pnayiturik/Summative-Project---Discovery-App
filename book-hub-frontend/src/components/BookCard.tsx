import type { Book } from '../types'

export default function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-card">
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
    </article>
  )
}
