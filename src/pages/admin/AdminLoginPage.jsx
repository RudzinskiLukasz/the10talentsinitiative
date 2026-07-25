import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function AdminLoginPage() {
  const { user, loading, configured, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-fg">Admin sign in</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Manage posts for The Ten Talents Initiative.
        </p>

        {!configured && (
          <p className="mt-4 rounded-xl border border-border-subtle bg-bg/60 p-3 text-sm text-fg-muted">
            Supabase is not configured. Set{" "}
            <code className="text-accent">VITE_SUPABASE_URL</code> and{" "}
            <code className="text-accent">VITE_SUPABASE_ANON_KEY</code> in{" "}
            <code className="text-accent">.env</code>, then restart the dev server.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-fg">Email</span>
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!configured || submitting}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-fg">Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!configured || submitting}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!configured || submitting}
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link to="/" className="mt-6 inline-flex text-sm text-primary-soft hover:text-accent">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
