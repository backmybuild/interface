"use client";
import { NextPage } from "next";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchUserAnalytics } from "./fetch-analytics";
import { useParams } from "next/navigation";
import { getUserInfo } from "../../get-user-info";
import { Header } from "@components/header";

// ---------- Types ----------
type Tip = {
  timestamp: Date | string;
  amount: number;
  fromUser?: string | null;
  message?: string | null;
};

type Analytics = {
  user: {
    identity: string;
    avatar: string;
    displayName: string;
    totalTips: number;
    totalView: number;
    totalEarnings: number;
  };
  tips: Tip[];
};

// ---------- Chart bucketing utils ----------
type Range = "7d" | "1m" | "6m" | "1y";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0=Sun
  const offset = (day + 6) % 7; // Monday as first day
  x.setDate(x.getDate() - offset);
  return x;
}
function startOfMonth(d: Date) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function addWeeks(d: Date, n: number) {
  return addDays(d, 7 * n);
}
function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function rangeConfig(range: Range) {
  const now = startOfDay(new Date());
  if (range === "7d")
    return {
      granularity: "day" as const,
      start: addDays(now, -6),
      step: addDays,
      steps: 7,
    };
  if (range === "1m")
    return {
      granularity: "week" as const,
      start: startOfWeek(addDays(now, -27)), // ~4 weeks window
      step: addWeeks,
      steps: 4,
    };
  if (range === "6m")
    return {
      granularity: "month" as const,
      start: startOfMonth(addMonths(now, -5)),
      step: addMonths,
      steps: 6,
    };
  // 1y
  return {
    granularity: "month" as const,
    start: startOfMonth(addMonths(now, -11)),
    step: addMonths,
    steps: 12,
  };
}

function normalizeToBucketStart(d: Date, granularity: "day" | "week" | "month") {
  if (granularity === "day") return startOfDay(d);
  if (granularity === "week") return startOfWeek(d);
  return startOfMonth(d);
}

function formatLabel(d: Date, range: Range, granularity: "day" | "week" | "month") {
  if (granularity === "day")
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
  if (granularity === "week") {
    const end = addDays(d, 6);
    return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })}–${end.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })}`;
  }
  // month
  return d.toLocaleDateString("en-GB", {
    month: "short",
    year: range === "1y" ? "2-digit" : undefined,
  });
}

function buildEarningsFromTips(tips: Tip[], range: Range) {
  const { granularity, start, step, steps } = rangeConfig(range);

  // zero-filled buckets
  const buckets: Record<string, number> = {};
  const keys: string[] = [];
  let cursor = new Date(start);
  for (let i = 0; i < steps; i++) {
    const key = normalizeToBucketStart(cursor, granularity).toISOString();
    buckets[key] = 0;
    keys.push(key);
    cursor = step(cursor, 1);
  }

  // aggregate tips by bucket
  for (const t of tips) {
    const ts = new Date(t.timestamp);
    const k = normalizeToBucketStart(ts, granularity).toISOString();
    if (k in buckets) buckets[k] += t.amount || 0;
  }

  // to chart format
  return keys.map((k) => {
    const d = new Date(k);
    return {
      label: formatLabel(d, range, granularity),
      value: Math.round((buckets[k] + Number.EPSILON) * 100) / 100,
    };
  });
}

// ---------- Page ----------
const AnalyticPage: NextPage = () => {
  const params = useParams();
  const identity = params.identity as string;

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [range, setRange] = useState<Range>("7d");

  useEffect(() => {
    (async () => {
      if (!identity) return;
      const data = await fetchUserAnalytics(identity);
      const userInfo = await getUserInfo(identity);
      setAnalytics({
        user: {
          identity: data.user?.identity || identity,
          avatar: userInfo?.avatar || `https://effigy.im/a/${identity}.png`,
          displayName: userInfo?.displayName || identity,
          totalTips: data.user?.totalTips || 0,
          totalView: data.user?.totalView || 0,
          totalEarnings: data.user?.totalEarnings || 0,
        },
        tips: (data.tips || []).map((t: any) => ({
          timestamp: t.timestamp,
          amount: Number(t.amount) || 0,
          fromUser: t.fromUser ?? null,
          message: t.message ?? null,
        })),
      });
    })();
  }, [identity]);

  const earnings = useMemo(() => {
    const tips = analytics?.tips ?? [];
    return buildEarningsFromTips(tips, range);
  }, [analytics?.tips, range]);

  if (!analytics) {
    return (
      <main className="min-h-svh grid place-items-center">
        <div className="text-gray-500">Loading analytics...</div>
      </main>
    );
  }

  const avgTip =
    analytics.user.totalTips > 0
      ? (analytics.user.totalEarnings / analytics.user.totalTips).toFixed(2)
      : "0.00";

  return (
    <main className="min-h-svh">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 mt-20">
        {/* User summary */}
        <section className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src={
                analytics.user.avatar ||
                "https://www.gravatar.com/avatar/[email_hash]?s=200&d=identicon"
              }
              alt={`${analytics.user.displayName} avatar`}
              width={80}
              height={80}
              className="h-20 w-20 rounded-3xl object-cover ring-1 ring-gray-200"
            />
            <div>
              <div className="text-lg font-semibold">{analytics.user.displayName}</div>
              <div className="text-sm text-gray-500 underline">
                <Link href={`/${analytics.user.identity}`}>
                  https://backmybuild.com/{analytics.user.identity}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPI title="View count" value={analytics.user.totalView.toString()} hint="All-time" />
          <KPI title="Total tips (count)" value={analytics.user.totalTips.toString()} hint="All-time" />
          <KPI title="Total tips (USD)" value={`$${analytics.user.totalEarnings.toString()}`} hint="All-time" />
          <KPI title="Avg. tip" value={`$${avgTip}`} hint="Per tip" />
        </section>

        {/* Earnings Chart */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Earnings</h2>
            <div className="flex items-center gap-2">
              {(["7d", "1m", "6m", "1y"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-3 py-1 text-sm border ${
                    range === r
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earnings} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`$${v}`, "Earnings"]} />
                <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Tips */}
        <section className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Recent tips</h2>
            <div className="text-sm text-gray-500">
              Showing last {analytics.tips.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-3 py-2 font-medium">From</th>
                  <th className="px-3 py-2 font-medium">Message</th>
                  <th className="px-3 py-2 font-medium">Amount (USD)</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.tips.map((t, index) => {
                  const d = new Date(t.timestamp);
                  return (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="font-medium">{t.fromUser || "Anonymous"}</div>
                      </td>
                      <td className="px-3 py-3 max-w-[420px]">
                        <span className="line-clamp-2">{t.message || "-"}</span>
                      </td>
                      <td className="px-3 py-3">${Number(t.amount || 0).toLocaleString()}</td>
                      <td className="px-3 py-3">{d.toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

function KPI({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  );
}

export default AnalyticPage;
