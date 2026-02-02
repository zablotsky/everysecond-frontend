import { NextResponse } from "next/server";
import { supabase } from "../supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Try to get token from incoming request first
  const authHeader = request.headers.get("authorization");
  let accessToken = authHeader?.replace(/^Bearer\s+/i, "");

  // Fallback to Supabase server client session (may fail during static export)
  if (!accessToken) {
    try {
      const session = await supabase.auth.getSession();
      accessToken = session.data.session?.access_token;
    } catch (err) {
      // ignore — will return 401 below
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

  const data = await res.json();
  console.log(data);

  return NextResponse.json(data);
}
