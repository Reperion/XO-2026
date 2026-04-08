import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hermes Dashboard",
  description: "XO's view into Hermes agent — sessions, tools, jobs",
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="nav-link">
      {children}
    </a>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Top nav */}
        <header style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.25rem' }}>⬡</span>
              <span style={{ fontWeight: 600 }}>Hermes</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Dashboard</span>
            </div>
            <nav className="flex gap-1">
              <NavLink href="/">Overview</NavLink>
              <NavLink href="/sessions">Sessions</NavLink>
              <NavLink href="/tools">Tools</NavLink>
              <NavLink href="/jobs">Jobs</NavLink>
            </nav>
            <div style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--success)' }}>●</span> live
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.75rem', padding: '1rem' }}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span>Hermes Dashboard — XO's first project</span>
            <span>Refreshing every 30s</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
