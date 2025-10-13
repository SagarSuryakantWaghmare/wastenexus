"use client";
import { useState } from "react";
import Link from "next/link";

export default function SigninPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Signed in! Redirecting...");
        // Get role from response and redirect
        const role = data.user?.role;
        if (role === "user") window.location.href = "/citizen";
        else if (role === "worker") window.location.href = "/worker";
        else if (role === "champion") window.location.href = "/champions";
        else if (role === "government") window.location.href = "/government";
        else window.location.href = "/";
      } else {
        setError(data.message || "Sign in failed");
      }
    } catch (err) {
      setError("Sign in failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Sign In</h2>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="text-sm text-gray-600 mt-2">
          Don't have an account? <Link href="/signup" className="text-green-700 font-bold">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
