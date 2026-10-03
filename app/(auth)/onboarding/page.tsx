"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Bike, Car, Truck, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
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
  const accountName = useAuth((s) => s.currentAccount()?.name ?? "");
  const [username, setUsername] = React.useState("");
  React.useEffect(() => {
    if (accountName && accountName !== "Driver") setUsername((u) => u || accountName);
  }, [accountName]);
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
    <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10">
      <div className="flex items-center justify-between">
        <Logo size={28} />
        <span className="text-sm text-ink-faint">
          Step {step + 1} of {steps.length}
        </span>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <div className="mb-8 flex gap-1.5" aria-hidden>
          {steps.map((s, i) => (
            <div key={s} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-ink" : "bg-navy-700")} />
          ))}
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <StepShell title="What are you studying for?" subtitle="We'll build your learning path around it.">
                  <div className="grid gap-3">
                    {(
                      [
                        { id: "learners", label: "Learner's licence", desc: "The computerised theory test" },
                        { id: "drivers", label: "Driver's licence", desc: "The yard test and road test" },
                        { id: "both", label: "Both", desc: "From learner's to driver's" },
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
                <StepShell title="Which licence code?" subtitle="Lessons and questions adapt to your vehicle. You can change this later.">
                  <div className="grid gap-3">
                    {(
                      [
                        { id: "1", icon: <Bike className="h-5 w-5" />, label: "Code 1", desc: "Motorcycles" },
                        { id: "2", icon: <Car className="h-5 w-5" />, label: "Code 2", desc: "Light motor vehicles — cars and bakkies" },
                        { id: "3", icon: <Truck className="h-5 w-5" />, label: "Code 3", desc: "Heavy motor vehicles — trucks and buses" },
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
                <StepShell title="Which province are you in?" subtitle="Used for the provincial leaderboard.">
                  <div className="grid grid-cols-2 gap-2">
                    {PROVINCES.map((p) => (
                      <button
                        key={p}
                        onClick={() => setProvince(p)}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                          province === p
                            ? "border-ink bg-navy-850 font-medium text-ink ring-1 ring-ink"
                            : "border-asphalt/[0.12] bg-navy-850 text-ink-muted hover:border-asphalt/25 hover:text-ink"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="Almost done" subtitle="Your display name appears on the leaderboard.">
                  <label htmlFor="ob-name" className="mb-1.5 block text-sm font-medium text-ink">Display name</label>
                  <input
                    id="ob-name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Sipho M"
                    maxLength={20}
                    className="h-11 w-full rounded-lg border border-asphalt/[0.14] bg-navy-850 px-3.5 text-ink shadow-card outline-none placeholder:text-ink-faint focus:border-cyan/60 focus:ring-2 focus:ring-cyan/15"
                  />
                  <label htmlFor="ob-date" className="mb-1.5 mt-5 block text-sm font-medium text-ink">
                    Test date <span className="font-normal text-ink-faint">(optional)</span>
                  </label>
                  <input
                    id="ob-date"
                    type="date"
                    value={testDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="h-11 w-full rounded-lg border border-asphalt/[0.14] bg-navy-850 px-3.5 text-ink shadow-card outline-none focus:border-cyan/60 focus:ring-2 focus:ring-cyan/15"
                  />
                  <p className="mt-1.5 text-xs text-ink-faint">We'll show a countdown and pace your revision.</p>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
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
              <Button onClick={finish}>
                Start learning <ArrowRight className="h-4 w-4" />
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
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mb-6 mt-1.5 text-sm text-ink-muted">{subtitle}</p>
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
        "flex items-center gap-3 rounded-lg border bg-navy-850 px-4 py-3.5 text-left shadow-card transition-colors",
        active ? "border-ink ring-1 ring-ink" : "border-asphalt/[0.12] hover:border-asphalt/25"
      )}
    >
      <span className={cn("grid h-10 w-10 place-items-center rounded-md", active ? "bg-ink text-navy-900" : "bg-navy-800 text-ink-muted")}>
        {icon}
      </span>
      <div className="flex-1">
        <div className="font-medium text-ink">{title}</div>
        <div className="text-[13px] text-ink-muted">{desc}</div>
      </div>
      <span className={cn("grid h-5 w-5 place-items-center rounded-full border", active ? "border-ink bg-ink text-navy-900" : "border-asphalt/20")}>
        {active && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
