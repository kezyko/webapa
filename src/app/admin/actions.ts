"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const statusSchema = z.nativeEnum(BookingStatus);

export async function updateBookingStatus(formData: FormData) {
  await requireAdmin();
  const bookingId = String(formData.get("bookingId") ?? "");
  const parsedStatus = statusSchema.safeParse(formData.get("status"));
  if (!bookingId || !parsedStatus.success) return;
  await prisma.booking.update({ where: { id: bookingId }, data: { status: parsedStatus.data } });
  revalidatePath("/admin");
  revalidatePath("/akun");
}
