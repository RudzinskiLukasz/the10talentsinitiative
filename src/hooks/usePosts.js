import { useEffect, useState } from "react";
import {
  fetchPublishedPostBySlug,
  fetchPublishedPosts,
} from "../lib/postsApi.js";
import { isSupabaseConfigured } from "../lib/supabase.js";
import {
  getPostBySlug as getStaticPostBySlug,
  posts as staticPosts,
} from "../data/posts.js";

function staticList(category) {
  const list = category
    ? staticPosts.filter((p) => p.category === category)
    : [...staticPosts];
  return list;
}

export function usePublishedPosts({ category } = {}) {
  // Always start from the static archive so an empty/unseeded CMS never
  // flashes a blank Daily Reflections page.
  const [posts, setPosts] = useState(() => staticList(category));
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured) {
      setPosts(staticList(category));
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    fetchPublishedPosts({ category })
      .then((list) => {
        if (!active) return;
        setPosts(list);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setPosts(staticList(category));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category]);

  return { posts, loading, error };
}

export function usePublishedPost(slug) {
  const [post, setPost] = useState(() => getStaticPostBySlug(slug) || null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(() => !getStaticPostBySlug(slug));

  useEffect(() => {
    let active = true;
    setNotFound(false);

    if (!isSupabaseConfigured) {
      const staticPost = getStaticPostBySlug(slug) || null;
      setPost(staticPost);
      setNotFound(!staticPost);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    // Show static immediately while CMS resolves (same slug).
    setPost(getStaticPostBySlug(slug) || null);

    fetchPublishedPostBySlug(slug)
      .then((row) => {
        if (!active) return;
        setPost(row);
        setNotFound(!row);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        const staticPost = getStaticPostBySlug(slug) || null;
        setPost(staticPost);
        setNotFound(!staticPost);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return { post, loading, error, notFound };
}
