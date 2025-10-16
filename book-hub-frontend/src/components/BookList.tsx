import BookCard from './BookCard'
import type { Book } from '../types'

export default function BookList({ books }: { books: Book[] }) {
  return (
    <section className="book-list">
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </section>
  )
}
