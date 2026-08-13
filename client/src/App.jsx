import { useState } from 'react'
import './App.css'

const GENRES = ['All', 'Drama', 'Thriller', 'Sci-Fi', 'Comedy', 'Horror', 'Romance']

export default function App() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [activeGenre, setActiveGenre] = useState('All')

  const handleSearch = () => {
    if (query.trim()) setSubmitted(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    setSubmitted('')
    setActiveGenre('All')
  }

  return (
    <div className="app">
      <div className="hero">
        <p className="hero-eyebrow">Your personal film guide</p>
        <h1 className="hero-title">
          What do you feel
          <br />
          <span className="hero-title-accent">like watching?</span>
        </h1>
        <p className="hero-subtitle">
          Enter a film you love — we'll find something worth your next evening.
        </p>

        <div className="search-bar">
          <svg className="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. Blade Runner, Mulholland Drive…"
          />
          {query && (
            <button className="search-clear" onClick={handleClear}>✕</button>
          )}
          <button
            className={`search-submit ${query.trim() ? 'active' : 'inactive'}`}
            onClick={handleSearch}
          >
            Find
          </button>
        </div>
      </div>

    </div>
  )
}
