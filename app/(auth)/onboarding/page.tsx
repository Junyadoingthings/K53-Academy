"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Bike, Car, Truck, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { GridBackdrop, RoadLine } from "@/components/backgrounds";
import { useStore, type LicenseGoal, type VehicleCode } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { PROVINCES } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const authHydrated = useAuth((s) => s.hydrated);
  const currentUserId = useAuth((s) => s.currentUserId);

  React.useEffect(() => {
    if (authHydrated && !currentUserId) router.replace("/sign-up");
  }, [authHydrated, currentUserId, router]);
  const [step, setStep] = React.useState(0);
  const [license, setLicense] = React.useState<LicenseGoal>("learners");
  const [code, setCode] = React.useState<VehicleCode>("2");
  const [province, setProvince] = React.useState<string>("Gauteng");
  const [username, setUsername] = React.useState("");
  const [testDate, setTestDate] = React.useState("");

  const steps = ["Goal", "Vehicle", "Location", "You"];

  function finish() {
    setProfile({
      completed: true,
      license,
      code,
      province,
      username: username.trim() || "Driver",
      testDate: testDate || null,
    });
    router.push("/dashboard");
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <GridBackdrop />
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <Logo size={44} />
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border font-mono text-xs font-bold transition-all",
                  i < step
                    ? "border-grass bg-grass/20 text-grass"
                    : i === step
                    ? "border-cyan bg-cyan/20 text-cyan shadow-neon"
                    : "border-asphalt/15 text-ink-faint"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("h-0.5 w-6 rounded-full", i < step ? "bg-grass" : "bg-navy-700")} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-asphalt/[0.10] bg-navy-850/80 p-6 shadow-card backdrop-blur">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <StepShell title="What are you working towards?" subtitle="We'll build your path around it.">
                  <div className="grid gap-3">
                    {(
                      [
                        { id: "learners", label: "Learner's Licence", desc: "The written theory test" },
                        { id: "drivers", label: "Driver's Licence", desc: "Yard + road practical" },
                        { id: "both", label: "Both", desc: "Full journey, start to finish" },
                      ] as const
                    ).map((o) => (
                      <SelectCard
                        key={o.id}
                        active={license === o.id}
                        onClick={() => setLicense(o.id)}
                        icon={<GraduationCap className="h-5 w-5" />}
                        title={o.label}
                        desc={o.desc}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 1 && (
                <StepShell title="Which vehicle code?" subtitle="Your rooms and questions adapt to this.">
                  <div className="grid gap-3">
                    {(
                      [
                        { id: "1", icon: <Bike className="h-5 w-5" />, label: "Code 1", desc: "Motorcycles (A1/A)" },
                        { id: "2", icon: <Car className="h-5 w-5" />, label: "Code 2", desc: "Light vehicles (B) — cars & bakkies" },
                        { id: "3", icon: <Truck className="h-5 w-5" />, label: "Code 3", desc: "Heavy vehicles (C1/C/EC)" },
                      ] as const
                    ).map((o) => (
                      <SelectCard
                        key={o.id}
                        active={code === o.id}
                        onClick={() => setCode(o.id)}
                        icon={o.icon}
                        title={o.label}
                        desc={o.desc}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell title="Where are you based?" subtitle="For provincial leaderboards.">
                  <div className="grid grid-cols-2 gap-2">
                    {PROVINCES.map((p) => (
                      <button
                        key={p}
                        onClick={() => setProvince(p)}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-sm font-medium transition-all",
                          province === p
                            ? "border-cyan/50 bg-cyan/10 text-cyan shadow-neon"
                            : "border-asphalt/15 text-ink-muted hover:border-cyan/30"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="Last thing — your driver name" subtitle="This shows on the leaderboard.">
                  <label className="mb-1 block text-xs font-medium text-ink-muted">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. SpeedySipho"
                    maxLength={20}
                    className="w-full rounded-xl border border-asphalt/15 bg-navy-800/60 px-4 py-3 text-ink outline-none placeholder:text-ink-faint focus:border-cyan/50"
                  />
                  <label className="mb-1 mt-4 block text-xs font-medium text-ink-muted">
                    Test date (optional) — drives your streak urgency
                  </label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full rounded-xl border border-asphalt/15 bg-navy-800/60 px-4 py-3 text-ink outline-none focus:border-cyan/50 [color-scheme:light]"
                  />
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6">
            <RoadLine />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="success" onClick={finish}>
                Enter the Academy <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">{title}</h1>
      <p className="mb-5 mt-1 text-sm text-ink-muted">{subtitle}</p>
      {children}
    </div>
  );
}

function SelectCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all",
        active
          ? "border-cyan/50 bg-cyan/10 shadow-neon"
          : "border-asphalt/15 bg-navy-800/40 hover:border-cyan/30"
      )}
    >
      <span className={cn("grid h-10 w-10 place-items-center rounded-lg", active ? "bg-cyan/20 text-cyan" : "bg-navy-700 text-ink-muted")}>
        {icon}
      </span>
      <div className="flex-1">
        <div className={cn("font-heading font-semibold", active ? "text-cyan" : "text-ink")}>{title}</div>
        <div className="text-xs text-ink-muted">{desc}</div>
      </div>
      {active && <Check className="h-5 w-5 text-cyan" />}
    </button>
  );
}
