import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? process.env.ADMIN_JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-admin-jwt-secret";
  throw new Error("JWT_SECRET is not configured.");
}

function base64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function sign(input: string) {
  return createHmac("sha256", getJwtSecret()).update(input).digest("base64url");
}

export function getAdminPassword() {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  return fromEnv || "admin";
}

export function signAdminToken() {
  const header = base64UrlJson({ alg: "HS256", typ: "JWT" });
  const payload = base64UrlJson({
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  });
  const body = `${header}.${payload}`;
  return `${body}.${sign(body)}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, payload, signature] = parts;
  const expected = sign(`${header}.${payload}`);
  const actualBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
    return false;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number; role?: string };
    if (data.role !== "admin") return false;
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  };
}

export async function isAdminRequest() {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  if (await isAdminRequest()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
