import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to top on route changes (works with BrowserRouter; unlike ScrollRestoration). */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
