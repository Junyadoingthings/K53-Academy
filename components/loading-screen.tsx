"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/brand/logo";

/**
 * Cinematic 0.5s splash shown on the first full page load. The root layout
 * persists across client-side navigations, so this fires once per hard load —
 * a quick, branded reveal (logo pop + traffic-light cycle + sweeping road line).
 */
export function LoadingScreen() {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setShow(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden asphalt-band"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {/* faint moving grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="drop-shadow-[0_12px_40px_rgba(228,0,43,0.5)]"
            >
              <LogoMark size={96} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 text-center"
            >
              <div className="font-heading text-2xl font-extrabold tracking-tight text-white">
                K53 <span className="text-[#FF3D53]">Academy</span>
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] text-white/60">
                Master the Road
              </div>
            </motion.div>

            {/* traffic-light cycle dots */}
            <div className="mt-6 flex items-center gap-2">
              {["#E4002B", "#FFC21A", "#12B767"].map((c, i) => (
                <motion.span
                  key={c}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: c }}
                  animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.25, 0.85] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>

            {/* sweeping road line */}
            <div className="relative mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 w-1/2 rounded-full bg-[#FFC21A]"
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
