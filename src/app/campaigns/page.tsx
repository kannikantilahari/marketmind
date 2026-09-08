import Link from "next/link";
import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { desc } from "drizzle-orm";

function formatCurrency(value: string | null) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function CampaignsPage() {
  const rows = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      productService: campaigns.productService,
      targetAudience: campaigns.targetAudience,
      budget: campaigns.budget,
      platform: campaigns.platform,
      startDate: campaigns.startDate,
      endDate: campaigns.endDate,
      goal: campaigns.goal,
      status: campaigns.status,
      createdAt: campaigns.createdAt,
    })
    .from(campaigns)
    .orderBy(desc(campaigns.id));

  return (
    <main className="section-shell py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="warm-label text-xs font-medium">Owner View</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Created Campaigns</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Every newly created campaign appears here.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/campaigns/new"
            className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[#1e120a] hover:brightness-110"
          >
            + New Campaign
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            Landing
          </Link>
        </div>
      </div>

      <section className="surface overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--bg-soft)]/60 text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Product/Service</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Audience</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Goal</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-[var(--text-muted)]">
                    No campaigns yet. Create your first one.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--line)]/70 last:border-b-0">
                    <td className="px-4 py-3 text-[var(--text-muted)]">#{row.id}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text)]">{row.name}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{row.productService}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{row.platform}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{row.targetAudience}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{formatCurrency(row.budget)}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{row.goal}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">
                      {row.startDate} → {row.endDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(row.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
