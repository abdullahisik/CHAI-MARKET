"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@chaimarket.co.uk");
  const [password, setPassword] = useState("Admin12345!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed.");
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">Admin Login</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to manage CHAI MARKET
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="admin@chaimarket.co.uk"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-white font-semibold hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}