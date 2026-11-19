import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function AdminRoute() {
  const { user, loading, configured, isAdmin } = useAuth();
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

  // Public member accounts must not reach the CMS.
  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}
