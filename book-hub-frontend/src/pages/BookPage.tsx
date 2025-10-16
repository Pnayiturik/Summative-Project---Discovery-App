// automatic JSX runtime in use
import BookDetails from '../components/BookDetails'

export default function BookPage() {
  return (
    <section>
      <h1>Book</h1>
      <BookDetails book={null} />
    </section>
  )
}
