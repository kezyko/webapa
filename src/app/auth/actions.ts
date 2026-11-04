"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clearSession, hashPassword, setSession, verifyPassword } from "@/lib/auth";

const credentialsSchema = z.object({ email: z.string().trim().email().max(160), password: z.string().min(8).max(100) });
const registrationSchema = credentialsSchema.extend({ name: z.string().trim().min(3).max(120), phone: z.string().trim().min(8).max(30) });

export async function registerAction(formData: FormData) {
  const parsed = registrationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/daftar?error=Data+registrasi+belum+valid");
  const { name, email, phone, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) redirect("/masuk?error=Email+sudah+terdaftar");
  const user = await prisma.user.create({ data: { name, email, phone, passwordHash: await hashPassword(password) } });
  await setSession(user.id);
  redirect("/akun");
}

export async function loginAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/masuk?error=Email+atau+password+belum+valid");
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) redirect("/masuk?error=Email+atau+password+salah");
  await setSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/akun");
}

export async function logoutAction() { await clearSession(); redirect("/"); }
