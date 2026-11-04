"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const packageSchema = z.object({ title: z.string().trim().min(3).max(120), slug: z.string().trim().regex(/^[a-z0-9-]+$/), destination: z.string().trim().min(2).max(80), category: z.string().trim().min(2).max(60), price: z.coerce.number().int().positive(), capacity: z.coerce.number().int().positive(), meetingPoint: z.string().trim().min(2).max(120), departureDate: z.string().min(10), description: z.string().trim().min(10), image: z.string().url() });

export async function savePackage(formData: FormData) {
  await requireAdmin();
  const parsed = packageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const data = parsed.data;
  const destination = await prisma.destination.upsert({ where: { name: data.destination }, update: {}, create: { name: data.destination } });
  const pack = await prisma.travelPackage.upsert({ where: { slug: data.slug }, update: { title: data.title, category: data.category, price: data.price, description: data.description, image: data.image, destinationId: destination.id }, create: { slug: data.slug, title: data.title, category: data.category, price: data.price, description: data.description, image: data.image, destinationId: destination.id } });
  await prisma.schedule.create({ data: { packageId: pack.id, departureDate: new Date(data.departureDate), capacity: data.capacity, meetingPoint: data.meetingPoint } });
  revalidatePath("/admin/paket");
  revalidatePath("/paket");
}
