import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function AdminRoute() {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-fg-muted">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
