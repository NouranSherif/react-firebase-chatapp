import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-100 bg-white border border-navy-100 rounded-xl px-8 py-9 shadow-[0_4px_24px_rgba(10,22,40,0.08)] relative overflow-hidden animate-card-in">
        <h2 className="font-display text-[1.4rem] font-bold text-navy-900 mb-6 text-center">
          Welcome back
        </h2>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3.5 py-2.5 text-xs text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-navy-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-navy-50 border border-navy-200 rounded-lg px-3.5 py-2.5 text-sm text-navy-900 placeholder-navy-300 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-200/60 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-navy-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-navy-50 border border-navy-200 rounded-lg px-3.5 py-2.5 text-sm text-navy-900 placeholder-navy-300 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-200/60 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-navy-800 hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-colors cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-[0.82rem] text-navy-400">
          No account?{" "}
          <Link
            to="/register"
            className="text-navy-700 font-semibold hover:text-navy-900 transition-colors"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
