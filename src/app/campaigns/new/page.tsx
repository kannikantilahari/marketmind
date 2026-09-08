"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";

type CampaignFormState = {
  name: string;
  productService: string;
  targetAudience: string;
  budget: string;
  platform: string;
  startDate: string;
  endDate: string;
  goal: string;
};

const initialState: CampaignFormState = {
  name: "",
  productService: "",
  targetAudience: "",
  budget: "",
  platform: "Instagram",
  startDate: "",
  endDate: "",
  goal: "Lead Generation",
};

type AiStrategy = {
  score: number;
  label: string;
  insights: string[];
  recommendations: string[];
  message?: string;
};

export default function NewCampaignPage() {
  const [form, setForm] = useState<CampaignFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<AiStrategy | null>(null);

  const isDateRangeValid = useMemo(() => {
    if (!form.startDate || !form.endDate) return true;
    return new Date(form.endDate).getTime() >= new Date(form.startDate).getTime();
  }, [form.endDate, form.startDate]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setStrategy(null);

    if (!isDateRangeValid) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { ok: boolean; message?: string; campaign?: { id: number; name: string } };

      if (!response.ok || !data.ok) {
        setError(data.message ?? "Failed to create campaign.");
        return;
      }

      const aiResponse = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const aiData = (await aiResponse.json()) as {
        ok: boolean;
        score?: number;
        label?: string;
        insights?: string[];
        recommendations?: string[];
        message?: string;
      };

      if (
        aiData.ok &&
        typeof aiData.score === "number" &&
        typeof aiData.label === "string" &&
        Array.isArray(aiData.insights) &&
        Array.isArray(aiData.recommendations)
      ) {
        setStrategy({
          score: aiData.score,
          label: aiData.label,
          insights: aiData.insights,
          recommendations: aiData.recommendations,
          message: aiData.message,
        });
      }

      setMessage(`Campaign \"${data.campaign?.name ?? ""}\" created successfully. ID: #${data.campaign?.id ?? "-"}`);
      setForm(initialState);
    } catch {
      setError("Network error while creating campaign.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section-shell py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="warm-label text-xs font-medium">Campaign Builder</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Create New Campaign</h1>
        </div>
        <Link href="/" className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
          Back to Landing
        </Link>
      </div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface rounded-2xl p-6 md:p-8"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">Campaign name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
              placeholder="Back to College 2026"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">Product / service</span>
            <input
              required
              value={form.productService}
              onChange={(e) => setForm((prev) => ({ ...prev, productService: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
              placeholder="Skincare kit"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">Target audience</span>
            <input
              required
              value={form.targetAudience}
              onChange={(e) => setForm((prev) => ({ ...prev, targetAudience: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
              placeholder="18-25 students"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">Budget (USD)</span>
            <input
              required
              type="number"
              min="1"
              step="0.01"
              value={form.budget}
              onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
              placeholder="2500"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">Platform</span>
            <select
              value={form.platform}
              onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
            >
              <option>Instagram</option>
              <option>Google Ads</option>
              <option>Facebook</option>
              <option>YouTube</option>
              <option>LinkedIn</option>
              <option>TikTok</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">Goal</span>
            <select
              value={form.goal}
              onChange={(e) => setForm((prev) => ({ ...prev, goal: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
            >
              <option>Lead Generation</option>
              <option>Conversions</option>
              <option>Brand Awareness</option>
              <option>Traffic</option>
              <option>Engagement</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">Start date</span>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">End date</span>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 outline-none ring-[var(--brand)]/40 focus:ring-2"
            />
          </label>
        </div>

        {!isDateRangeValid ? <p className="mt-3 text-sm text-red-300">End date must be after start date.</p> : null}

        {loading ? (
          <div className="mt-5 overflow-hidden rounded-full border border-[var(--line)]">
            <motion.div
              className="h-2 bg-[var(--brand)]"
              initial={{ width: "0%" }}
              animate={{ width: ["18%", "63%", "92%"] }}
              transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            <p>{message}</p>
            <Link href="/campaigns" className="mt-2 inline-block text-emerald-100 underline underline-offset-4">
              View all created campaigns →
            </Link>
          </div>
        ) : null}
        {error ? <p className="mt-4 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={loading}
            className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[#20130a] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Analyzing Campaign..." : "Analyze Campaign"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setForm(initialState);
              setMessage(null);
              setError(null);
              setStrategy(null);
            }}
            className="rounded-xl border border-[var(--line)] px-5 py-3 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)] disabled:opacity-70"
          >
            Reset
          </button>
        </div>
      </motion.form>

      {strategy ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface mt-6 rounded-2xl p-6 md:p-8"
        >
          <p className="warm-label text-xs font-medium">AI Strategy Output</p>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-5xl font-semibold leading-none text-[var(--brand)]">{strategy.score}</p>
            <p className="pb-1 text-sm text-[var(--text-muted)]">{strategy.label}</p>
          </div>

          {strategy.message ? <p className="mt-3 text-xs text-[var(--text-muted)]">{strategy.message}</p> : null}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Insights</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                {strategy.insights.map((insight) => (
                  <li key={insight}>• {insight}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Recommendations</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--text-muted)]">
                {strategy.recommendations.map((recommendation) => (
                  <li key={recommendation}>→ {recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      ) : null}
    </main>
  );
}
