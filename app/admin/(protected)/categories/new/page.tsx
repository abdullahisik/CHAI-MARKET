"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewCategoryPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create category.");
      return;
    }

    setSuccess("Category created successfully.");

    setTimeout(() => {
      window.location.href = "/admin/categories";
    }, 700);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Category</h2>
          <p className="text-sm text-neutral-500">
            Create a new category for this store.
          </p>
        </div>

        <Link
          href="/admin/categories"
          className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium hover:bg-neutral-50"
        >
          Back to Categories
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Category Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
            placeholder="e.g. Rice"
            required
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>

          <Link
            href="/admin/categories"
            className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}