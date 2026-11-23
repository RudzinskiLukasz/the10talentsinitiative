import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const wide = pathname.startsWith("/admin/code");
  const shell = wide ? "max-w-[1400px]" : "max-w-5xl";

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b border-border bg-surface-nav">
        <div className={`mx-auto flex ${shell} flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8`}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/admin" className="font-display text-lg font-semibold text-fg">
              Admin
            </Link>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-accent" : "text-fg-muted hover:text-fg"}`
              }
            >
              Posts
            </NavLink>
            <NavLink
              to="/admin/homepage"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-accent" : "text-fg-muted hover:text-fg"}`
              }
            >
              Homepage
            </NavLink>
            <NavLink
              to="/admin/tracks"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-accent" : "text-fg-muted hover:text-fg"}`
              }
            >
              Records
            </NavLink>
            <NavLink
              to="/admin/code"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-accent" : "text-fg-muted hover:text-fg"}`
              }
            >
              Code
            </NavLink>
            <Link to="/" className="text-sm text-fg-muted hover:text-fg">
              View site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-fg-subtle sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-border-strong bg-surface px-4 py-2 text-xs font-semibold text-fg transition hover:bg-surface-hover"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className={`mx-auto ${shell} px-5 py-8 sm:px-8`}>
        <Outlet />
      </main>
    </div>
  );
}
