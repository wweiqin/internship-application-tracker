export function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="InternTrack home">
        <span className="brand-mark" aria-hidden="true">IT</span>
        <span>InternTrack</span>
      </a>

      <nav aria-label="Primary navigation">
        <a className="nav-link nav-link--active" href="#top" aria-current="page">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" />
          </svg>
          Dashboard
        </a>
        <a className="nav-link" href="#applications">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6V4h6v2m-9 4h12m-14 9V7h16v12H4Z" />
          </svg>
          Applications
        </a>
        <a className="nav-link" href="#match-analyser">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 19 19 5M8 5H5v3m11 11h3v-3M9 15l2 2 4-5" />
          </svg>
          Match Analyser
        </a>
      </nav>

      <div className="sidebar-footer">
        <p>Application tracker</p>
        <span>MVP dashboard</span>
      </div>
    </aside>
  )
}
