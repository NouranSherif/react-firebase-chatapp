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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center mb-6">
          Create an Account
        </h2>

        {error && (
          <div className="mb-4 text-xs font-medium text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* User Name Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              User Name
            </label>
            <input
              id="username"
              className="w-full bg-slate-50 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-900 transition"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full bg-slate-50 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-900 transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full bg-slate-50 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-900 transition"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPass"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Password Confirmation
            </label>
            <input
              id="confirmPass"
              className="w-full bg-slate-50 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-900 transition"
              type="password"
              value={confirmedPass}
              onChange={(e) => setConfirmedPass(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-medium text-sm py-2.5 px-4 rounded-lg mt-2 tracking-wide hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-700"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
