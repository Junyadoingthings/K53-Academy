"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bike,
  Bot,
  Car,
  Check,
  ClipboardCheck,
  Clock,
  LineChart,
  OctagonAlert,
  Repeat,
  Truck,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { SIGNS, signById } from "@/lib/data/signs";
import type { RoadSign } from "@/lib/data/types";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
} as const;

const TEST_SECTIONS = [
  { name: "Rules of the road", questions: 30, pass: 22 },
  { name: "Signs, signals & markings", questions: 30, pass: 23 },
  { name: "Vehicle controls", questions: 8, pass: 6 },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Short, focused lessons",
    body: "Every topic in the learner's syllabus, broken into 10–15 minute lessons with worked examples and exam tips.",
  },
  {
    icon: OctagonAlert,
    title: "The official sign library",
    body: `${SIGNS.length} signs reproduced from the SADC Road Traffic Signs Manual, with flashcards and a 60-second recognition drill.`,
  },
  {
    icon: ClipboardCheck,
    title: "Mock tests in exam format",
    body: "Timed papers that follow the real three-section structure and pass marks, so test day feels familiar.",
  },
  {
    icon: Repeat,
    title: "Practice that adapts",
    body: "Spaced repetition brings back the questions you got wrong until they stick.",
  },
  {
    icon: LineChart,
    title: "Know when you're ready",
    body: "Accuracy by section, weak-area tracking and a countdown to your test date.",
  },
  {
    icon: Bot,
    title: "Ask the instructor",
    body: "Stuck on a rule? Ask in plain language and get an answer with the reference behind it.",
  },
];

const CODES = [
  {
    icon: Bike,
    code: "Code 1",
    label: "Motorcycles",
    body: "Balance, slow riding, protective gear and motorcycle-specific controls.",
  },
  {
    icon: Car,
    code: "Code 2",
    label: "Light motor vehicles",
    body: "The most common licence — cars and bakkies, including the yard test manoeuvres.",
  },
  {
    icon: Truck,
    code: "Code 3",
    label: "Heavy motor vehicles",
    body: "Air brakes, load safety, pre-trip inspections and heavy-vehicle limits.",
  },
];

const FAQ = [
  {
    q: "Is this the official learner's licence test?",
    a: "No. K53 Academy is an independent study tool. Our mock tests follow the published structure of the computerised learner's test — three sections, 68 questions, a pass mark per section — but the real test is written at a Driving Licence Testing Centre (DLTC).",
  },
  {
    q: "What do I need to pass?",
    a: "You need at least 22/30 for rules of the road, 23/30 for signs, signals and road markings, and 6/8 for vehicle controls. Each section is marked separately, so a strong score in one can't make up for a weak score in another.",
  },
  {
    q: "Is it free?",
    a: "Yes — lessons, the full sign library and practice are free to start. Premium (R79/month) adds unlimited mock tests and detailed analytics.",
  },
  {
    q: "Do I need to create an account?",
    a: "You can start as a guest and your progress is saved on your device. Create an account to keep your progress under your name.",
  },
  {
    q: "Which code should I study for?",
    a: "Code 1 for motorcycles, Code 2 for cars and light vehicles, and Code 3 for heavy vehicles such as trucks and buses. You can switch at any time.",
  },
];

function pick(ids: string[]): RoadSign[] {
  return ids.map(signById).filter((s): s is RoadSign => Boolean(s));
}

function ProductPreview() {
  const sign = signById("speed-hump") ?? SIGNS[0];
  const options = [
    "Uneven road surface ahead",
    "Speed hump ahead",
    "Steep descent ahead",
    "Narrow bridge ahead",
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[28px] dot-grid opacity-60" aria-hidden />
      <div className="overflow-hidden rounded-2xl border border-asphalt/[0.1] bg-navy-850 shadow-pop">
        <div className="flex items-center justify-between border-b border-asphalt/[0.08] px-5 py-3">
          <div className="text-xs font-medium text-ink-muted">Mock test · Signs, signals & markings</div>
          <div className="flex items-center gap-1.5 text-xs tabular text-ink-muted">
            <Clock className="h-3.5 w-3.5" /> 41:12
          </div>
        </div>
        <div className="h-1 bg-navy-800">
          <div className="h-full w-[38%] bg-cyan" />
        </div>
        <div className="p-5 sm:p-6">
          <div className="text-xs font-medium text-ink-faint">Question 26 of 68</div>
          <div className="mt-1.5 text-[15px] font-semibold text-ink">What does this sign tell you?</div>
          <div className="my-5 grid place-items-center rounded-xl bg-navy-800/60 py-6">
            <RoadSignSVG sign={sign} size={112} />
          </div>
          <div className="grid gap-2">
            {options.map((o, i) => {
              const right = i === 1;
              return (
                <div
                  key={o}
                  className={
                    right
                      ? "flex items-center justify-between rounded-lg border border-grass/40 bg-grass/[0.07] px-3.5 py-2.5 text-sm font-medium text-ink"
                      : "rounded-lg border border-asphalt/[0.1] px-3.5 py-2.5 text-sm text-ink-muted"
                  }
                >
                  <span>
                    <span className="mr-2 text-ink-faint">{String.fromCharCode(65 + i)}.</span>
                    {o}
                  </span>
                  {right && <Check className="h-4 w-4 text-grass" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const showcase = pick([
    "stop",
    "yield",
    "no-entry",
    "speed-60",
    "no-overtaking",
    "no-u-turn",
    "keep-left",
    "roundabout",
    "sharp-curve-left",
    "traffic-signal-ahead",
    "pedestrian-crossing-ahead",
    "children-ahead",
    "railway-crossing-ahead",
    "slippery-road",
    "freeway",
    "roadworks",
  ]);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="glass sticky top-0 z-40 border-b border-asphalt/[0.06]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="K53 Academy home">
            <Logo size={28} />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
            <a href="#test" className="hover:text-ink">The test</a>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#signs" className="hover:text-ink">Road signs</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/sign-in" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-asphalt/[0.1] bg-navy-850 py-1 pl-1 pr-3 text-xs text-ink-muted shadow-card">
            <span className="rounded-full bg-cyan/10 px-2 py-0.5 font-medium text-cyan">New</span>
            All {SIGNS.length} official SADC road signs
          </div>
          <h1 className="mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[56px]">
            Pass your K53 learner's test the first time.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
            Structured lessons, every road sign and timed mock tests that follow the real exam — for
            Code 1, 2 and 3. Study on your phone, a few minutes a day.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start learning free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                I already have an account
              </Button>
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            {["Free to start", "No card required", "Built for South Africa"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-grass" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <ProductPreview />
        </motion.div>
      </section>

      {/* Test format */}
      <section id="test" className="scroll-mt-20 border-y border-asphalt/[0.06] bg-navy-850">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <motion.div {...fade} className="max-w-2xl">
            <div className="eyebrow">Know the test</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              68 questions. Three sections. Pass all three.
            </h2>
            <p className="mt-4 text-ink-muted">
              The learner's test is marked section by section. Our mock tests use the same structure and
              pass marks, so you'll know exactly where you stand before you book.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {TEST_SECTIONS.map((s, i) => (
              <motion.div
                key={s.name}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.06 }}
                className="rounded-xl border border-asphalt/[0.09] bg-navy-900 p-6"
              >
                <div className="text-sm font-medium text-ink">{s.name}</div>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="tabular text-4xl font-semibold tracking-tight text-ink">{s.pass}</span>
                  <span className="tabular text-lg text-ink-faint">/ {s.questions}</span>
                </div>
                <div className="mt-1 text-sm text-ink-muted">correct answers needed</div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-navy-700">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${(s.pass / s.questions) * 100}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <motion.div {...fade} className="max-w-2xl">
          <div className="eyebrow">How you'll learn</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything in the syllabus, nothing you don't need.
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fade} transition={{ ...fade.transition, delay: (i % 3) * 0.05 }}>
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-asphalt/[0.1] bg-navy-850 text-ink shadow-card">
                <f.icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Signs showcase */}
      <section id="signs" className="scroll-mt-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-asphalt-900 text-white">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.15fr] lg:p-14">
            <motion.div {...fade}>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-white/50">Road sign library</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Learn the signs exactly as you'll see them.
              </h2>
              <p className="mt-4 text-white/70">
                Every sign is reproduced from the SADC Road Traffic Signs Manual used in South Africa, grouped
                the way the manual groups them — control, command, prohibition, warning and more.
              </p>
              <Link href="/sign-up" className="mt-8 inline-block">
                <Button variant="outline" className="border-white/15 bg-white text-asphalt-950 hover:bg-white/90">
                  Browse all signs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {showcase.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.025, duration: 0.3 }}
                  className="grid aspect-square place-items-center rounded-xl bg-white/[0.06] p-2 ring-1 ring-white/[0.06]"
                  title={`${s.name} (${s.code})`}
                >
                  <RoadSignSVG sign={s} size={64} className="h-auto w-[78%]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Codes */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <motion.div {...fade} className="max-w-2xl">
          <div className="eyebrow">Every licence code</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A path for whatever you'll be driving.
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {CODES.map((c, i) => (
            <motion.div
              key={c.code}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.06 }}
              className="rounded-xl border border-asphalt/[0.09] bg-navy-850 p-6 shadow-card"
            >
              <c.icon className="h-6 w-6 text-ink" />
              <div className="mt-6 text-sm font-medium text-cyan">{c.code}</div>
              <div className="mt-0.5 text-lg font-semibold text-ink">{c.label}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-asphalt/[0.06]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:py-28">
          <motion.div {...fade}>
            <div className="eyebrow">FAQ</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Questions, answered.</h2>
          </motion.div>
          <div className="divide-y divide-asphalt/[0.08] border-y border-asphalt/[0.08]">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-asphalt/[0.12] text-ink-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-10 text-sm leading-relaxed text-ink-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <motion.div
          {...fade}
          className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-asphalt/[0.09] bg-navy-850 p-8 shadow-card sm:p-12 md:flex-row md:items-center"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Ready when you are.</h2>
            <p className="mt-2 text-ink-muted">Start with a 15-minute lesson. Your progress is saved automatically.</p>
          </div>
          <Link href="/sign-up">
            <Button size="lg">
              Start learning free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-asphalt/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Logo size={24} />
            <p className="mt-4 text-xs leading-relaxed text-ink-faint">
              K53 Academy is an independent study tool and is not affiliated with the RTMC, the Department of
              Transport or any licensing authority. Road sign artwork is reproduced from the public-domain SADC
              road sign set. Always confirm requirements with your local DLTC.
            </p>
          </div>
          <div className="text-xs text-ink-faint md:text-right">
            <div>
              Built by <span className="text-ink-muted">Stanford (Junya) Mazibuko</span>
            </div>
            <div className="mt-1">© {new Date().getFullYear()} K53 Academy</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
