import { NextResponse } from "next/server";
import { supabase } from "../supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    let accessToken = authHeader?.replace(/^Bearer\s+/i, "");

    if (!accessToken) {
      try {
        const session = await supabase.auth.getSession();
        accessToken = session.data.session?.access_token;
      } catch (err) {
        // ignore — we will return 401 below
      }
    }

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";
    const res = await fetch(`${backendUrl}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "Upstream error", details: text }, { status: res.status });
    }

    const data = await res.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("/me route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
