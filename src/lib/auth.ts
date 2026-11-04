import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "gwj_session";
const secret = process.env.AUTH_SECRET ?? "development-only-change-this-secret";

type Session = { userId: string; expiresAt: number };
const sign = (value: string) => createHmac("sha256", secret).update(value).digest("base64url");

export async function hashPassword(password: string) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export function encodeSession(session: Session) { const payload = Buffer.from(JSON.stringify(session)).toString("base64url"); return `${payload}.${sign(payload)}`; }
export function decodeSession(value: string): Session | null { try { const [payload, signature] = value.split("."); if (!payload || !signature) return null; const expected = sign(payload); if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session; return session.expiresAt > Date.now() ? session : null; } catch { return null; } }
export async function setSession(userId: string) { const cookieStore = await cookies(); cookieStore.set(SESSION_COOKIE, encodeSession({ userId, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 }); }
export async function clearSession() { (await cookies()).delete(SESSION_COOKIE); }
export async function getCurrentUser() { const value = (await cookies()).get(SESSION_COOKIE)?.value; const session = value ? decodeSession(value) : null; if (!session) return null; return prisma.user.findUnique({ where: { id: session.userId } }); }
