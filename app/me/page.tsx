"use client";

import { useEffect, useState } from "react";
import { supabase } from "./../supabase";

export default function MePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMe = async (accessToken?: string) => {
      if (!accessToken) {
        if (!isMounted) return;
        setData(null);
        setError("Not logged in");
        setLoading(false);
        return;
      }

      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            (json && (json.message || json.detail || json.details))
              ? JSON.stringify(json)
              : `API error: ${res.status}`
          );
        }

        if (!isMounted) return;
        setData(json);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || "Request failed");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      fetchMe(data.session?.access_token);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchMe(session?.access_token);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
    <div>
      <h1>Me Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <div>
          <h2>User Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
    </>
  );
}
