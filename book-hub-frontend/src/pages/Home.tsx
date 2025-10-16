// automatic JSX runtime in use
import BookList from '../components/BookList'
import type { Book } from '../types'

const sample: Book[] = []

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <BookList books={sample} />
    </main>
  )
}
