"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Trophy,
  Flame,
  ShieldCheck,
  OctagonAlert,
  ArrowRight,
  Bike,
  Car,
  Truck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { GridBackdrop, RoadLine } from "@/components/backgrounds";
import { SIGNS } from "@/lib/data/signs";

const iconBox = {
  cyan: "bg-cyan/10 text-cyan",
  amber: "bg-amber/10 text-amber",
  grass: "bg-grass/10 text-grass",
  signal: "bg-signal/10 text-signal-soft",
} as const;

const iconPlain = {
  cyan: "text-cyan",
  amber: "text-amber",
  grass: "text-grass",
  signal: "text-signal-soft",
} as const;

const features = [
  { icon: Zap, title: "Earn XP on everything", body: "Every question, room and streak day levels you up. Watch the counters tick.", tone: "cyan" },
  { icon: OctagonAlert, title: "Master every road sign", body: "The full SA sign library, drawn to SARTSM spec, with flashcards & Sign Rush.", tone: "signal" },
  { icon: ShieldCheck, title: "The K53 system, gamified", body: "Observe · Signal · Manoeuvre — the defensive driving method examiners score.", tone: "grass" },
  { icon: Trophy, title: "Climb the leaderboard", body: "Global, provincial and friends rankings. Prove you're the sharpest driver in Mzansi.", tone: "amber" },
] as const;

const codes = [
  { icon: Bike, code: "Code 1", label: "Motorcycles", tone: "amber" },
  { icon: Car, code: "Code 2", label: "Light vehicles", tone: "cyan" },
  { icon: Truck, code: "Code 3", label: "Heavy vehicles", tone: "signal" },
] as const;

export default function LandingPage() {
  const previewSigns = SIGNS.slice(0, 7);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GridBackdrop />

      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 lg:px-8">
        <Logo size={40} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 text-center lg:px-8 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <Pill tone="cyan" className="mx-auto mb-5 w-fit">
            <Sparkles className="h-3 w-3" /> Learner's & Driver's · Code 1 · 2 · 3
          </Pill>
          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Pass your K53 like it's{" "}
            <span className="text-gradient neon-text">a game</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
            K53 Academy turns the South African learner's and driver's syllabus into rooms, paths, XP
            and streaks. Study smarter, not harder — and actually enjoy it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="shine">
                Start free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline">
                Explore the dashboard
              </Button>
            </Link>
          </div>
          <div className="mx-auto mt-8 max-w-lg">
            <RoadLine />
          </div>
        </motion.div>

        {/* Floating signs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          {previewSigns.map((sign, i) => (
            <motion.div
              key={sign.id}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            >
              <RoadSignSVG sign={sign} size={64} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Codes */}
      <section className="mx-auto max-w-6xl px-4 pb-16 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {codes.map((c, i) => (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card glow={c.tone} className="text-center">
                <CardBody className="p-6">
                  <c.icon className={`mx-auto h-10 w-10 ${iconPlain[c.tone]}`} />
                  <div className="mt-3 font-heading text-xl font-bold text-ink">{c.code}</div>
                  <div className="text-sm text-ink-muted">{c.label}</div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
        <h2 className="mb-8 text-center font-heading text-3xl font-bold text-ink">
          Built to keep you coming back
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card glow={f.tone} className="h-full">
                <CardBody className="flex gap-4 p-6">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${iconBox[f.tone]}`}
                  >
                    <f.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-ink">{f.title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{f.body}</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-24 lg:px-8">
        <Card glow="cyan" className="relative overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-0 bg-radial-cyan" />
          <CardBody className="relative p-10">
            <Flame className="mx-auto h-10 w-10 text-amber" />
            <h2 className="mt-3 font-heading text-3xl font-bold text-ink">
              Your streak starts today
            </h2>
            <p className="mx-auto mt-2 max-w-md text-ink-muted">
              Join thousands of South Africans levelling up their road knowledge. Free to start —
              premium from just R79/month.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="mt-6">
                Create your driver <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardBody>
        </Card>
      </section>

      <footer className="border-t border-asphalt/[0.10] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center lg:px-8">
          <Logo size={34} />
          <p className="max-w-xl text-xs text-ink-faint">
            Educational content based on the K53 / SARTSM syllabus framework. Not affiliated with the
            RTMC, AA South Africa or Arrive Alive — partner logos shown only with official approval.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 opacity-40">
            {["RTMC", "AA South Africa", "Arrive Alive"].map((partner) => (
              <span
                key={partner}
                className="rounded-md border border-dashed border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint"
              >
                {partner} · pending
              </span>
            ))}
          </div>
          <p className="text-xs text-ink-muted">
            Created by <span className="font-semibold text-ink">Stanford (Junya) Mazibuko</span>
          </p>
          <p className="font-mono text-[10px] text-ink-faint">© {new Date().getFullYear()} K53 Academy · Master the Road</p>
        </div>
      </footer>
    </div>
  );
}
