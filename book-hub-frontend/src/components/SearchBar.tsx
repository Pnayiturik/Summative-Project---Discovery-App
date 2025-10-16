// Using the automatic JSX runtime; no default React import required

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      aria-label="Search books"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by title or author"
    />
  )
}
