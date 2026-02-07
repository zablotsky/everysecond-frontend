import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  console.log(
    "[api/me] Authorization header:",
    authHeader
      ? `${authHeader.slice(0, 20)}… (len=${authHeader.length})`
      : "<missing>"
  );

  const backendUrl = process.env.BACKEND_URL

  const res = await fetch(`${backendUrl}/me`, {
    headers: authHeader ? { Authorization: authHeader } : {},
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  return NextResponse.json(
    typeof body === "string" ? { body } : body,
    { status: res.status }
  );
}
