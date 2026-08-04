import { useEffect, useState } from "react";
import { fetchPublishedTracks } from "../lib/tracksApi.js";
import { isSupabaseConfigured } from "../lib/supabase.js";

export function usePublishedTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setTracks([]);
      setLoading(false);
      return undefined;
    }

    let active = true;

    function load({ silent = false } = {}) {
      if (!silent) setLoading(true);
      return fetchPublishedTracks()
        .then((list) => {
          if (!active) return;
          setTracks(list);
          setError(null);
        })
        .catch((err) => {
          if (!active) return;
          setError(err);
          if (!silent) setTracks([]);
        })
        .finally(() => {
          if (active && !silent) setLoading(false);
        });
    }

    load();

    const onVisible = () => {
      if (document.visibilityState === "visible") load({ silent: true });
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  return { tracks, loading, error };
}
