"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loadProgressForUser, detachProgress } from "./store";

/**
 * Local account system. Accounts + the active session persist to
 * localStorage, so users stay signed in and keep their progress across page
 * closes. This is a device-local demo of auth — for real cross-device
 * accounts, swap this for Supabase Auth (see lib/auth.ts). Passwords are
 * only obfuscated here, NOT securely hashed; never reuse a real password.
 */

export interface Account {
  id: string;
  name: string;
  email: string;
  pass: string; // obfuscated, not secure
  province: string;
  createdAt: number;
  guest?: boolean;
}

const obscure = (s: string) =>
  typeof window === "undefined" ? s : btoa(unescape(encodeURIComponent(s)));

interface AuthState {
  hydrated: boolean;
  accounts: Account[];
  currentUserId: string | null;
  setHydrated: () => void;
  signUp: (d: {
    name: string;
    email: string;
    password: string;
    province?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  continueAsGuest: () => Promise<void>;
  signOut: () => void;
  currentAccount: () => Account | null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      accounts: [],
      currentUserId: null,

      setHydrated: () => set({ hydrated: true }),

      currentAccount: () => {
        const s = get();
        return s.accounts.find((a) => a.id === s.currentUserId) ?? null;
      },

      signUp: async ({ name, email, password, province = "Gauteng" }) => {
        const clean = email.trim().toLowerCase();
        if (!clean || !password) return { ok: false, error: "Email and password are required." };
        if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters." };
        if (get().accounts.some((a) => a.email === clean))
          return { ok: false, error: "An account with that email already exists." };
        const acc: Account = {
          id: crypto.randomUUID(),
          name: name.trim() || "Driver",
          email: clean,
          pass: obscure(password),
          province,
          createdAt: Date.now(),
        };
        set((s) => ({ accounts: [...s.accounts, acc], currentUserId: acc.id }));
        await loadProgressForUser(acc.id);
        return { ok: true };
      },

      signIn: async (email, password) => {
        const clean = email.trim().toLowerCase();
        const acc = get().accounts.find((a) => a.email === clean);
        if (!acc) return { ok: false, error: "No account found for that email." };
        if (acc.pass !== obscure(password)) return { ok: false, error: "Incorrect password." };
        set({ currentUserId: acc.id });
        await loadProgressForUser(acc.id);
        return { ok: true };
      },

      continueAsGuest: async () => {
        let guest = get().accounts.find((a) => a.guest);
        if (!guest) {
          guest = {
            id: "guest",
            name: "Guest Driver",
            email: "guest@local",
            pass: "",
            province: "Gauteng",
            createdAt: Date.now(),
            guest: true,
          };
          set((s) => ({ accounts: [...s.accounts, guest!] }));
        }
        set({ currentUserId: guest.id });
        await loadProgressForUser(guest.id);
      },

      signOut: () => {
        detachProgress();
        set({ currentUserId: null });
      },
    }),
    {
      name: "k53-auth",
      partialize: (s) => ({ accounts: s.accounts, currentUserId: s.currentUserId }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);
