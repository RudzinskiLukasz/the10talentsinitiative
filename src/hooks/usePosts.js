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

export function usePublishedPosts({ category } = {}) {
  const [posts, setPosts] = useState(() => {
    if (isSupabaseConfigured) return [];
    const list = category
      ? staticPosts.filter((p) => p.category === category)
      : [...staticPosts];
    return list;
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    fetchPublishedPosts({ category })
      .then((list) => {
        if (!active) return;
        setPosts(list);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        const list = category
          ? staticPosts.filter((p) => p.category === category)
          : [...staticPosts];
        setPosts(list);
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
  const [post, setPost] = useState(() =>
    isSupabaseConfigured ? null : getStaticPostBySlug(slug) || null
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(
    () => !isSupabaseConfigured && !getStaticPostBySlug(slug)
  );

  useEffect(() => {
    let active = true;
    setLoading(isSupabaseConfigured);
    setNotFound(false);

    if (!isSupabaseConfigured) {
      const staticPost = getStaticPostBySlug(slug) || null;
      setPost(staticPost);
      setNotFound(!staticPost);
      setLoading(false);
      return undefined;
    }

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
