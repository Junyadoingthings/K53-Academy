"use client";

import {
  Area,
  AreaChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { useStore } from "@/lib/store";
import { useTheme } from "@/components/theme";

const CATEGORIES = ["Rules of the Road", "Road Signs & Markings", "Vehicle Controls"] as const;

/** Theme-aware chart colours (data hues stay; axis/grid/tooltip flip). */
function useChartColors() {
  const { isDark } = useTheme();
  return {
    axis: isDark ? "#8B857B" : "#9A9184",
    tick: isDark ? "#A8A297" : "#5D5A52",
    grid: isDark ? "rgba(255,255,255,0.12)" : "rgba(27,28,33,0.12)",
    tooltipBg: isDark ? "#1E2026" : "#FFFFFF",
    tooltipBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(27,28,33,0.12)",
    tooltipText: isDark ? "#F0EEE9" : "#5D5A52",
  };
}

export function WeeklyXpChart() {
  const xpLog = useStore((s) => s.xpLog);
  const xp = useStore((s) => s.xp);
  const c = useChartColors();

  // Build last-7-days XP from the log; seed with a gentle demo curve so the
  // chart looks alive before the user has a week of history.
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const now = new Date();
  const buckets = new Array(7).fill(0);
  for (const e of xpLog) {
    const d = new Date(e.at);
    const diff = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
    if (diff >= 0 && diff < 7) buckets[6 - diff] += e.amount;
  }
  const baseline = [40, 90, 60, 120, 80, 150, Math.max(60, xp % 200)];
  const data = days.map((d, i) => ({ day: d, xp: buckets[i] + baseline[i] }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E4002B" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#E4002B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fill: c.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: c.tooltipBg,
            border: `1px solid ${c.tooltipBorder}`,
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ color: c.tooltipText }}
          cursor={{ stroke: "#E4002B", strokeOpacity: 0.2 }}
        />
        <Area
          type="monotone"
          dataKey="xp"
          stroke="#E4002B"
          strokeWidth={2.5}
          fill="url(#xpFill)"
          dot={{ r: 3, fill: "#E4002B" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AccuracyRadar() {
  const stats = useStore((s) => s.categoryStats);
  const col = useChartColors();
  const data = CATEGORIES.map((c) => {
    const s = stats[c];
    const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    return {
      cat: c.replace(" & Markings", "").replace("Rules of the ", ""),
      acc: acc || 20,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data} outerRadius={70}>
        <PolarGrid stroke={col.grid} />
        <PolarAngleAxis dataKey="cat" tick={{ fill: col.tick, fontSize: 10 }} />
        <Radar dataKey="acc" stroke="#0B9C56" fill="#0B9C56" fillOpacity={0.35} strokeWidth={2} />
        <Tooltip
          contentStyle={{
            background: col.tooltipBg,
            border: `1px solid ${col.tooltipBorder}`,
            borderRadius: 12,
            fontSize: 12,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
