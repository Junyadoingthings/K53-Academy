"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Users,
  BookOpen,
  HelpCircle,
  OctagonAlert,
  TrendingDown,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, DifficultyPill } from "@/components/ui/pill";
import { GridBackdrop } from "@/components/backgrounds";
import { QUESTIONS } from "@/lib/data/questions";
import { ROOMS } from "@/lib/data/rooms";
import { SIGNS } from "@/lib/data/signs";

// Demo analytics — in production these come from QuestionAttempt aggregates.
const MOST_FAILED = [
  { id: "veh-004", label: "Air-brake pressure drop", failRate: 62 },
  { id: "ror-008", label: "Heavy vehicle freeway speed", failRate: 54 },
  { id: "sign-005", label: "No stopping vs no parking", failRate: 48 },
  { id: "veh-007", label: "Skid recovery", failRate: 41 },
];

export default function AdminPage() {
  const [preview, setPreview] = React.useState({ prompt: "", a: "", b: "", c: "", d: "" });

  const stats = [
    { icon: Users, label: "Active users (30d)", value: "4,281", tone: "cyan" },
    { icon: BookOpen, label: "Rooms", value: ROOMS.length, tone: "grass" },
    { icon: HelpCircle, label: "Questions", value: QUESTIONS.length, tone: "amber" },
    { icon: OctagonAlert, label: "Road signs", value: SIGNS.length, tone: "signal" },
  ] as const;

  const toneBox = {
    cyan: "bg-cyan/10 text-cyan",
    grass: "bg-grass/10 text-grass",
    amber: "bg-amber/10 text-amber",
    signal: "bg-signal/10 text-signal-soft",
  } as const;

  return (
    <div className="relative min-h-screen">
      <GridBackdrop />
      <header className="border-b border-asphalt/[0.10] bg-navy-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo size={36} showText={false} />
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-ink">Admin</span>
              <Pill tone="signal"><ShieldAlert className="h-3 w-3" /> Staff only</Pill>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" /> Exit admin
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardBody className="p-4">
                  <span className={`grid h-9 w-9 place-items-center rounded-xl ${toneBox[s.tone]}`}>
                    <s.icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="mt-3 font-heading text-2xl font-bold text-ink">{s.value}</div>
                  <div className="text-xs text-ink-muted">{s.label}</div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Most failed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-signal-soft" /> Most-failed questions
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {MOST_FAILED.map((q) => (
                <div key={q.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-ink">{q.label}</span>
                    <span className="font-mono text-signal-soft">{q.failRate}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-navy-700">
                    <div className="h-full rounded-full bg-signal" style={{ width: `${q.failRate}%` }} />
                  </div>
                </div>
              ))}
              <p className="pt-1 text-xs text-ink-faint">
                Flag these for review or add clearer explanations to reduce drop-off.
              </p>
            </CardBody>
          </Card>

          {/* Add question (demo) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-cyan" /> Add a question
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <input
                value={preview.prompt}
                onChange={(e) => setPreview((p) => ({ ...p, prompt: e.target.value }))}
                placeholder="Question prompt…"
                className="w-full rounded-lg border border-asphalt/15 bg-navy-800/60 px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-cyan/50"
              />
              <div className="grid grid-cols-2 gap-2">
                {(["a", "b", "c", "d"] as const).map((k) => (
                  <input
                    key={k}
                    value={preview[k]}
                    onChange={(e) => setPreview((p) => ({ ...p, [k]: e.target.value }))}
                    placeholder={`Option ${k.toUpperCase()}`}
                    className="rounded-lg border border-asphalt/15 bg-navy-800/60 px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-cyan/50"
                  />
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() => alert("Demo only — wire to POST /api/admin/questions (Prisma).")}
              >
                Save question
              </Button>
              <p className="text-xs text-ink-faint">
                Persists via Prisma in production (see <span className="font-mono">prisma/schema.prisma</span>).
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Content table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-grass" /> Rooms
            </CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-asphalt/[0.06]">
              {ROOMS.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-medium text-ink">{r.title}</div>
                    <div className="font-mono text-[11px] text-ink-faint">
                      {r.questionIds.length} questions · {r.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DifficultyPill level={r.difficulty} />
                    <Pill tone="cyan">{r.xp} XP</Pill>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
