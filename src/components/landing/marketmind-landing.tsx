"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Preview", href: "#preview" },
  { label: "Campaigns", href: "/campaigns", external: true },
];

const features = [
  {
    title: "Unified Campaign Input",
    description:
      "Capture campaign name, budget, audience, platform, and goals in one clean workflow.",
  },
  {
    title: "Live Performance Intelligence",
    description:
      "Track reach, engagement, conversion, and trend shifts with meaningful visual context.",
  },
  {
    title: "AI Strategy Recommendations",
    description:
      "Get next-step guidance for audience fit, platform mix, and budget optimization.",
  },
  {
    title: "Planner-first Execution",
    description:
      "Move from insight to action with a monthly marketing planner and execution checkpoints.",
  },
];

const flow = [
  "Create campaign",
  "Analyze metrics",
  "Receive AI strategy",
  "Plan + optimize",
];

const useCases = [
  "D2C product launches",
  "B2B lead generation campaigns",
  "Multi-platform seasonal promotions",
  "Agency client performance reporting",
];

function CountUp({ value, suffix = "", duration = 1.4 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const update = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, shouldReduceMotion]);

  return (
    <div ref={ref} className="text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
      {display.toLocaleString()}
      {suffix}
    </div>
  );
}

function HeroChart() {
  const bars = useMemo(() => [48, 56, 42, 68, 62, 74, 86], []);

  return (
    <div className="surface grid-faint relative overflow-hidden rounded-2xl p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">Campaign Performance</p>
        <p className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--success)]">+18.4%</p>
      </div>

      <svg viewBox="0 0 320 130" className="h-36 w-full">
        <motion.path
          d="M5 103 C 40 94, 60 88, 90 80 C 120 72, 150 78, 180 60 C 220 38, 245 40, 280 18 L 315 10"
          fill="transparent"
          stroke="rgba(201,143,86,0.95)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {bars.map((height, idx) => (
          <motion.div
            key={idx}
            initial={{ scaleY: 0.3, opacity: 0.4 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
            className="origin-bottom rounded-md bg-[linear-gradient(180deg,rgba(201,143,86,0.95),rgba(201,143,86,0.2))]"
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
}

export function MarketMindLanding() {
  return (
    <main className="pb-10">
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(15,17,21,0.75)] backdrop-blur"
      >
        <div className="section-shell flex h-16 items-center justify-between">
          <Link href="#top" className="text-lg font-semibold tracking-tight text-[var(--text)]">
            Market<span className="text-[var(--brand)]">Mind</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) =>
              item.external ? (
                <Link key={item.href} href={item.href} className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
                  {item.label}
                </Link>
              ) : (
                <a key={item.href} href={item.href} className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <Link
            href="/campaigns/new"
            className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[#1a120c] transition hover:brightness-110"
          >
            Create Campaign
          </Link>
        </div>
      </motion.header>

      <section id="top" className="section-shell relative pt-16 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="warm-label text-xs font-medium">Marketing Intelligence Platform</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--text)] md:text-6xl">
              Turn Marketing Data into <span className="text-[var(--brand)]">Smarter Decisions.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
              Build campaigns, measure what matters, and get actionable strategy suggestions from one focused workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/campaigns/new"
                className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[#20150e] transition hover:brightness-110"
              >
                Create Campaign
              </Link>
              <a
                href="#preview"
                className="rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand-soft)]"
              >
                View Analytics Preview
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <HeroChart />
            <motion.div
              className="surface absolute -left-4 -top-4 rounded-xl px-4 py-3"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            >
              <p className="text-xs text-[var(--text-muted)]">Engagement</p>
              <p className="text-lg font-semibold text-[var(--text)]">7.8%</p>
            </motion.div>
            <motion.div
              className="surface absolute -bottom-4 right-4 rounded-xl px-4 py-3"
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            >
              <p className="text-xs text-[var(--text-muted)]">Conversion</p>
              <p className="text-lg font-semibold text-[var(--text)]">4.6%</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="preview" className="section-shell mt-16 md:mt-24">
        <div className="surface rounded-2xl p-6 md:p-8">
          <p className="warm-label text-xs font-medium">Marketing Overview</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--text-muted)]">Campaigns</p>
              <CountUp value={12} />
            </div>
            <div className="rounded-xl border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--text-muted)]">Reach</p>
              <CountUp value={84200} suffix="" />
            </div>
            <div className="rounded-xl border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--text-muted)]">Engagement</p>
              <CountUp value={78} suffix="‰" />
            </div>
            <div className="rounded-xl border border-[var(--line)] p-4">
              <p className="text-sm text-[var(--text-muted)]">Conversion</p>
              <CountUp value={46} suffix="‰" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-shell mt-16 md:mt-24">
        <p className="warm-label text-xs font-medium">Features</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Built for modern marketing teams</h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              className="surface rounded-2xl p-5"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="how-it-works" className="section-shell mt-16 md:mt-24">
        <div className="surface rounded-2xl p-6 md:p-8">
          <p className="warm-label text-xs font-medium">How it works</p>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {flow.map((step, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-xl border border-[var(--line)] p-4"
              >
                <p className="text-xs text-[var(--brand-soft)]">Step {idx + 1}</p>
                <p className="mt-2 font-medium">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="section-shell mt-16 md:mt-24">
        <p className="warm-label text-xs font-medium">Business & marketing use cases</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {useCases.map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -14 : 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className="surface rounded-xl p-5"
            >
              <p className="text-sm text-[var(--text)]">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="cta" className="section-shell mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface rounded-2xl px-6 py-9 text-center md:px-10"
        >
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Ready to design your next winning campaign?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-muted)] md:text-base">
            Start with Campaign Builder, track performance in one dashboard, and scale with AI-backed strategy.
          </p>
          <Link
            href="/campaigns/new"
            className="mt-6 inline-block rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-[#1f120a] transition hover:brightness-110 active:translate-y-px"
          >
            Create Campaign
          </Link>
        </motion.div>
      </section>

      <footer className="section-shell mt-14 border-t border-[var(--line)] py-8">
        <div className="flex flex-col items-start justify-between gap-3 text-sm text-[var(--text-muted)] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} MarketMind</p>
          <p>Built for sharper marketing decisions.</p>
        </div>
      </footer>
    </main>
  );
}
