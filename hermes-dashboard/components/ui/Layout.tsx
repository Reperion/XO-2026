import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="nav-link">
      {children}
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent)] font-bold text-xl">⬡</span>
            <span className="font-semibold">Hermes</span>
            <span className="text-[var(--muted)] text-sm">Dashboard</span>
          </div>
          <nav className="flex gap-1">
            <NavLink href="/">Overview</NavLink>
            <NavLink href="/sessions">Sessions</NavLink>
            <NavLink href="/tools">Tools</NavLink>
            <NavLink href="/jobs">Jobs</NavLink>
          </nav>
          <div className="ml-auto text-[var(--muted)] text-xs">
            <span className="text-[var(--success)]">●</span> live
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-[var(--border)] text-[var(--muted)] text-xs p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Hermes Dashboard &mdash; XO&apos;s first project</span>
          <span>Refreshing every 30s</span>
        </div>
      </footer>
    </>
  );
}