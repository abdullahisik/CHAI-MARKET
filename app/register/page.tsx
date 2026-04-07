"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/site-header";
import { useAuth } from "../providers/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          address,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Register failed.");
        setLoading(false);
        return;
      }

      login(data.user);
      router.push("/account");
    } catch {
      setMessage("Register failed.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded bg-white p-8 shadow">
          <h1 className="mb-6 text-4xl font-bold">Create Account</h1>

          <form onSubmit={handleRegister} className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Full Name</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

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

            <div>
              <label className="mb-2 block text-sm font-semibold">Phone</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Address</label>
              <textarea
                rows={4}
                className="w-full rounded border px-4 py-3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {message && <p className="font-semibold text-red-600">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded bg-[#102418] px-6 py-3 font-semibold text-white disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}