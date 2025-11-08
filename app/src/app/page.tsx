"use client";

import { useMemo, useState } from "react";
import {
  FocusTheme,
  Preferences,
  RiskAppetite,
  rankCompanies,
} from "@/lib/scoring";

const focusOptions: { label: string; value: FocusTheme; description: string }[] =
  [
    { label: "Digital India", value: "digital", description: "SaaS, cloud, AI services" },
    { label: "Manufacturing 4.0", value: "manufacturing", description: "Capital goods & specialty manufacturing" },
    { label: "Consumption", value: "consumer", description: "Organized retail & discretionary demand" },
    { label: "Export Alpha", value: "exports", description: "Global revenue mix & FX tailwinds" },
    { label: "Defence", value: "defence", description: "Indigenisation, defence offset order book" },
    { label: "Green Energy", value: "green", description: "Energy transition & decarbonisation" },
    { label: "Healthcare", value: "healthcare", description: "Specialised care & pharma ingredients" },
  ];

const riskLabels: Record<RiskAppetite, string> = {
  low: "Conservative",
  medium: "Balanced",
  high: "Aggressive",
};

const defaultPreferences: Preferences = {
  risk: "medium",
  horizon: 5,
  focus: ["digital", "exports"],
  minMarketCap: 5000,
  maxMarketCap: 150000,
};

export default function Home() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const evaluations = useMemo(
    () => rankCompanies(preferences, 8),
    [preferences],
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-16 pt-14 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
            Bharat Multibagger Radar
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Agentic screener to surface next-decade Indian multibagger
            candidates.
          </h1>
          <p className="max-w-3xl text-sm text-slate-300">
            Combines growth durability, capital efficiency, valuation comfort,
            and structural tailwinds to highlight companies with asymmetrical
            upside potential. Tune the agent for your risk profile and focus
            themes, and it recalibrates conviction in real-time.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr]">
          <aside className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
            <h2 className="text-lg font-semibold text-emerald-200">
              Agent Controls
            </h2>
            <section className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-300">
                <span>Risk Mode</span>
                <span className="text-slate-100">{riskLabels[preferences.risk]}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {(["low", "medium", "high"] as RiskAppetite[]).map((risk) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({ ...prev, risk }))
                    }
                    className={`rounded-lg border px-3 py-2 transition ${
                      preferences.risk === risk
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-300/60 hover:text-emerald-50"
                    }`}
                  >
                    {riskLabels[risk]}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-300">
                <span>Holding Horizon</span>
                <span className="text-slate-100">{preferences.horizon} years</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                value={preferences.horizon}
                onChange={(event) =>
                  setPreferences((prev) => ({
                    ...prev,
                    horizon: Number(event.target.value),
                  }))
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-400"
              />
              <p className="text-xs text-slate-400">
                Longer horizons tilt weight towards secular growth and structural
                tailwinds over near-term valuation comfort.
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-300">
                <span>Focus Themes</span>
                <span className="text-slate-300">
                  {preferences.focus.length} selected
                </span>
              </div>
              <div className="space-y-2">
                {focusOptions.map((theme) => {
                  const active = preferences.focus.includes(theme.value);
                  return (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => {
                        setPreferences((prev) => {
                          const focus = active
                            ? prev.focus.filter((item) => item !== theme.value)
                            : [...prev.focus, theme.value];
                          return { ...prev, focus };
                        });
                      }}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-emerald-400 bg-emerald-500/25 text-emerald-50"
                          : "border-white/10 bg-white/5 text-slate-200 hover:border-emerald-300/60"
                      }`}
                    >
                      <p className="font-medium">{theme.label}</p>
                      <p className="text-xs text-slate-300">{theme.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-300">
                <span>Market Cap Window</span>
                <span className="text-slate-100">
                  ₹{preferences.minMarketCap.toLocaleString()} – ₹
                  {preferences.maxMarketCap.toLocaleString()} Cr
                </span>
              </div>
              <div className="space-y-3">
                <label className="block text-xs text-slate-300">
                  Lower bound
                  <input
                    type="range"
                    min={3000}
                    max={80000}
                    step={1000}
                    value={preferences.minMarketCap}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setPreferences((prev) => ({
                        ...prev,
                        minMarketCap: Math.min(value, prev.maxMarketCap - 1000),
                      }));
                    }}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-400"
                  />
                </label>
                <label className="block text-xs text-slate-300">
                  Upper bound
                  <input
                    type="range"
                    min={10000}
                    max={200000}
                    step={5000}
                    value={preferences.maxMarketCap}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setPreferences((prev) => ({
                        ...prev,
                        maxMarketCap: Math.max(value, prev.minMarketCap + 1000),
                      }));
                    }}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-400"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-400">
                Raises or narrows the liquidity sweet spot the agent will scout.
              </p>
            </section>

            <section className="rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-100">
              <p className="font-semibold text-emerald-200">Important</p>
              <p>
                This agent blends heuristics and curated data. It is not
                investment advice. Always validate with detailed diligence before
                acting.
              </p>
            </section>
          </aside>

          <main className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-300">
                  Top Convictions
                </p>
                <h2 className="text-2xl font-semibold">
                  {evaluations.length} high-probability ideas surfaced
                </h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-slate-300">
                Risk: {riskLabels[preferences.risk]} • Horizon: {preferences.horizon}Y
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {evaluations.map((evaluation, index) => (
                <CompanyCard
                  key={evaluation.company.ticker}
                  evaluation={evaluation}
                  position={index + 1}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

type CompanyCardProps = {
  evaluation: ReturnType<typeof rankCompanies>[number];
  position: number;
};

function CompanyCard({ evaluation, position }: CompanyCardProps) {
  const conviction = Math.round(evaluation.score * 100);
  const { company, breakdown, insights, suitability } = evaluation;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-5 shadow-lg shadow-emerald-500/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/80 bg-emerald-500/20 text-sm font-semibold text-emerald-100">
              #{position}
            </span>
            <p className="text-sm uppercase tracking-widest text-emerald-300">
              Conviction {conviction}%
            </p>
          </div>
          <h3 className="text-xl font-semibold text-white">
            {company.name}{" "}
            <span className="text-sm font-normal text-slate-400">
              • {company.ticker}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {company.sector} • Market cap ₹{company.marketCapCr.toLocaleString()} Cr
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Revenue CAGR: {company.revenueGrowth3Y}%</p>
          <p>EPS CAGR: {company.epsGrowth3Y}%</p>
          <p>ROE: {company.roe}%</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs text-slate-300">
        {Object.entries(breakdown).map(([label, value]) => (
          <div key={label} className="space-y-1">
            <dt className="flex items-center justify-between uppercase tracking-wide">
              <span>{label}</span>
              <span>{Math.round(value * 100)}%</span>
            </dt>
            <dd className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400/80"
                style={{ width: `${Math.max(6, Math.round(value * 100))}%` }}
              />
            </dd>
          </div>
        ))}
      </dl>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
        <p className="font-semibold text-emerald-200">Agent Thesis</p>
        <p className="mt-1 text-sm leading-relaxed">{company.narrative}</p>
        <ul className="mt-3 space-y-1 text-xs text-slate-300">
          {insights.map((insight) => (
            <li key={insight} className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-xs text-emerald-100">
        {suitability}
      </p>
    </article>
  );
}
