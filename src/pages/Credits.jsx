import { credits } from '../data/credits.js'

export default function Credits() {
  return (
    <>
      <h1>Photo credits</h1>
      <p className="muted">All photographs are from Wikimedia Commons, used under the licences shown.</p>
      <div className="credits">
        {credits.map((c) => (
          <div className="credit" key={c.file}>
            <strong>{c.product}</strong>
            <a href={c.url} target="_blank" rel="noreferrer">{c.file}</a>
            <span className="muted">by {c.author} · {c.license}</span>
          </div>
        ))}
      </div>
    </>
  )
}
