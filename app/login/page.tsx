"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/site-header";
import { useAuth } from "../providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      login(data.user);
      router.push("/account");
    } catch {
      setMessage("Login failed.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />

      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="rounded bg-white p-8 shadow">
          <h1 className="mb-6 text-4xl font-bold">Login</h1>

          <form onSubmit={handleLogin} className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Email</label>
              <input
                type="email"
                className="w-full rounded border px-4 py-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Password</label>
              <input
                type="password"
                className="w-full rounded border px-4 py-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {message && <p className="font-semibold text-red-600">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded bg-[#102418] px-6 py-3 font-semibold text-white disabled:bg-gray-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}