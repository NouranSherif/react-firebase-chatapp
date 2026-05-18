import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPass, setConfirmedPass] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmedPass) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password, userName);
      navigate("/login");
    } catch (error) {
      setError("Failed to create an account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-100 bg-white border border-navy-100 rounded-xl px-8 py-9 shadow-[0_4px_24px_rgba(10,22,40,0.08)] relative overflow-hidden animate-card-in">
        <h2 className="font-display text-[1.4rem] font-bold text-navy-900 mb-6 text-center">
          Create an account
        </h2>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3.5 py-2.5 text-xs text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-navy-400"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="your handle"
              required
              className="w-full bg-navy-50 border border-navy-200 rounded-lg px-3.5 py-2.5 text-sm text-navy-900 placeholder-navy-300 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-200/60 transition-all"
            />
          </div>

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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPass"
              className="text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-navy-400"
            >
              Confirm password
            </label>
            <input
              id="confirmPass"
              type="password"
              value={confirmedPass}
              onChange={(e) => setConfirmedPass(e.target.value)}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-[0.82rem] text-navy-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-navy-700 font-semibold hover:text-navy-900 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
