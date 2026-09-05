"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Login failed.");
      router.replace(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090E] px-6 text-white">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-[#0A0E17] p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">LPS Vidyawadi</p>
        <h1 className="text-2xl font-black">Admin sign in</h1>
        <label className="block space-y-2 text-sm font-semibold text-white/70">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#07090E] px-3 py-2 text-white"
          />
        </label>
        {error ? <p className="text-sm font-semibold text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-2.5 text-sm font-black uppercase text-primary disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
