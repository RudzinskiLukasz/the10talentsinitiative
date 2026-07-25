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
    setLoading(true);

    fetchPublishedTracks()
      .then((list) => {
        if (!active) return;
        setTracks(list);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setTracks([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { tracks, loading, error };
}
