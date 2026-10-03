"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useStore } from "@/lib/store";
import { useTheme } from "@/components/theme";
import { cn } from "@/lib/utils";

/** Learner's test sections and their official pass marks. */
export const EXAM_SECTIONS = [
  { cat: "Rules of the Road", label: "Rules of the road", pass: 22, of: 30 },
  { cat: "Road Signs & Markings", label: "Signs, signals & markings", pass: 23, of: 30 },
  { cat: "Vehicle Controls", label: "Vehicle controls", pass: 6, of: 8 },
] as const;

function useChartColors() {
  const { isDark } = useTheme();
  return {
    bar: isDark ? "#ECEDEF" : "#141518",
    today: isDark ? "#F0444A" : "#D61F26",
    axis: isDark ? "#70747C" : "#84878F",
    tooltipBg: isDark ? "#1C1E22" : "#FFFFFF",
    tooltipBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(20,21,24,0.1)",
    tooltipText: isDark ? "#ECEDEF" : "#141518",
  };
}

/** XP earned per day over the last 7 days — real activity only. */
export function WeeklyXpChart() {
  const xpLog = useStore((s) => s.xpLog);
  const c = useChartColors();

  const now = new Date();
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return { key: d.toDateString(), day: d.toLocaleDateString("en-ZA", { weekday: "short" }), xp: 0 };
  });
  for (const e of xpLog) {
    const slot = data.find((d) => d.key === new Date(e.at).toDateString());
    if (slot) slot.xp += e.amount;
  }
  const total = data.reduce((a, d) => a + d.xp, 0);

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="tabular text-2xl font-semibold tracking-tight text-ink">{total}</span>
        <span className="text-sm text-ink-muted">XP this week</span>
      </div>
      {total === 0 ? (
        <div className="grid h-[150px] place-items-center rounded-lg border border-dashed border-asphalt/[0.14] px-6 text-center text-sm text-ink-faint">
          Complete a lesson or practice round to start your chart.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(127,127,127,0.08)" }}
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.tooltipBorder}`,
                borderRadius: 8,
                fontSize: 12,
                color: c.tooltipText,
              }}
              formatter={(v: number) => [`${v} XP`, ""]}
              separator=""
            />
            <Bar dataKey="xp" radius={[4, 4, 0, 0]} maxBarSize={36} fill={c.bar} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/** Accuracy per exam section vs. the pass mark you need on the day. */
export function ExamReadiness({ className }: { className?: string }) {
  const stats = useStore((s) => s.categoryStats);
  return (
    <div className={cn("space-y-5", className)}>
      {EXAM_SECTIONS.map((sec) => {
        const s = stats[sec.cat];
        const answered = s?.total ?? 0;
        const acc = answered > 0 ? Math.round((s!.correct / answered) * 100) : null;
        const need = Math.round((sec.pass / sec.of) * 100);
        const ready = acc != null && acc >= need && answered >= 10;
        return (
          <div key={sec.cat}>
            <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium text-ink">{sec.label}</span>
              <span className="tabular shrink-0 whitespace-nowrap text-xs text-ink-muted">
                {acc == null ? (
                  "—"
                ) : (
                  <>
                    <span className={cn("font-semibold", ready ? "text-grass" : "text-ink")}>{acc}%</span>
                    <span className="text-ink-faint"> · {answered} Qs</span>
                  </>
                )}
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-navy-700">
              <div
                className={cn("h-full rounded-full transition-[width] duration-700", ready ? "bg-grass" : "bg-ink")}
                style={{ width: `${acc ?? 0}%` }}
              />
              <div
                className="absolute -top-1 h-4 w-0.5 rounded bg-cyan"
                style={{ left: `${need}%` }}
                title={`Pass mark: ${sec.pass}/${sec.of} (${need}%)`}
              />
            </div>
            <div className="mt-1.5 text-[11px] text-ink-faint">
              Pass mark {sec.pass}/{sec.of} ({need}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}
