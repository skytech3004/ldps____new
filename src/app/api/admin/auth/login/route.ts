import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, getAdminPassword, signAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const expected = getAdminPassword();
    if (!expected) {
      return NextResponse.json({ error: "Admin password is not configured." }, { status: 500 });
    }
    if (!body.password || body.password !== expected) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, signAdminToken(), adminCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
