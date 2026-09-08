import Link from "next/link";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(15,17,21,0.82)] backdrop-blur">
        <div className="section-shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--text)]">
              Market<span className="text-[var(--brand)]">Mind</span>
            </Link>
            <span className="warm-label rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-medium">
              Owner Console
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/owner/campaigns"
              className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              Campaigns
            </Link>
            <Link
              href="/campaigns/new"
              className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              + New Campaign
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              Back to Site
            </Link>
          </nav>
        </div>
      </header>
      <div className="pt-4 md:pt-6">{children}</div>
    </div>
  );
}
