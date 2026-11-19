import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth.jsx";
import { getRedirectFromAuthHash } from "../lib/cast.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";

/**
 * Receives Supabase auth hash tokens (e.g. CAST → Ten Talents SSO return)
 * and routes into the app once the session is established.
 */
export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [target] = useState(() => getRedirectFromAuthHash(window.location.hash));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setFailed(true);
      return undefined;
    }

    let active = true;
    const timeout = window.setTimeout(() => {
      if (active) setFailed(true);
    }, 8000);

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.session) {
        // detectSessionInUrl may still be processing; wait for AuthProvider.
        return;
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);

  if (!loading && user) {
    return <Navigate to={target} replace />;
  }

  if (failed) {
    return <Navigate to="/account/login" replace />;
  }

  return (
    <div className="grid min-h-[50vh] place-items-center px-5 text-sm text-fg-muted">
      {t("account.completingSignIn")}
    </div>
  );
}
