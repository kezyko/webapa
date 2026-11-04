"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const gallerySchema = z.object({ title: z.string().trim().min(2), destination: z.string().trim().min(2), imageUrl: z.string().url(), altText: z.string().trim().min(5) });
const promoSchema = z.object({ title: z.string().trim().min(2), description: z.string().trim().min(5), code: z.string().trim().optional(), validUntil: z.string().min(10) });

export async function createGalleryImage(formData: FormData) { await requireAdmin(); const data = gallerySchema.parse(Object.fromEntries(formData)); await prisma.galleryImage.create({ data }); revalidatePath("/admin/konten"); revalidatePath("/galeri"); }
export async function createPromotion(formData: FormData) { await requireAdmin(); const data = promoSchema.parse(Object.fromEntries(formData)); await prisma.promotion.create({ data: { ...data, validUntil: new Date(data.validUntil) } }); revalidatePath("/admin/konten"); revalidatePath("/promo"); }
