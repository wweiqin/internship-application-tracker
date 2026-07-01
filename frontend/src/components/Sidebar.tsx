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
      </nav>

      <div className="sidebar-footer">
        <p>Application tracker</p>
        <span>MVP dashboard</span>
      </div>
    </aside>
  )
}
