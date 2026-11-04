"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({ name: z.string().trim().min(3).max(120), phone: z.string().trim().min(8).max(30), destination: z.string().trim().min(2).max(120), travelDates: z.string().trim().min(3).max(120), participants: z.coerce.number().int().min(1).max(500), notes: z.string().trim().min(5).max(2000) });
export async function createItineraryRequest(formData: FormData) { const parsed = requestSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return; await prisma.customItineraryRequest.create({ data: parsed.data }); }
