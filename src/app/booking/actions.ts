"use server";

import { BookingStatus, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bookingSchema = z.object({ packageSlug: z.string().min(1), name: z.string().trim().min(3).max(120), phone: z.string().trim().min(8).max(30), people: z.coerce.number().int().min(1).max(100) });
export type BookingActionResult = { ok: true; bookingNumber: string; deposit: number } | { ok: false; message: string };

export async function createDemoBooking(input: unknown): Promise<BookingActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { ok: false, message: "Silakan masuk sebelum membuat booking." };
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Periksa kembali nama, nomor WhatsApp, dan jumlah peserta." };
  const { packageSlug, name, phone, people } = parsed.data;
  try {
    return await prisma.$transaction(async (tx) => {
      const travelPackage = await tx.travelPackage.findUnique({ where: { slug: packageSlug }, include: { schedules: true } });
      if (!travelPackage || travelPackage.schedules.length === 0) throw new Error("Paket atau jadwal tidak tersedia.");
      const schedule = travelPackage.schedules[0];
      const used = await tx.booking.aggregate({ _sum: { participantQty: true }, where: { scheduleId: schedule.id, status: { not: BookingStatus.CANCELLED } } });
      if ((used._sum.participantQty ?? 0) + people > schedule.capacity) throw new Error("Kuota paket tidak mencukupi.");
      const totalAmount = travelPackage.price * people;
      const depositAmount = Math.round(totalAmount * travelPackage.depositPercent / 100);
      const bookingNumber = `GWJ-${Date.now().toString(36).toUpperCase()}`;
      const booking = await tx.booking.create({ data: { bookingNumber, userId: currentUser.id, packageId: travelPackage.id, scheduleId: schedule.id, participantQty: people, totalAmount, depositAmount, remainingAmount: totalAmount - depositAmount, status: BookingStatus.SIMULATED_DEPOSIT_RECORDED, paymentStatus: PaymentStatus.SIMULATED_DEPOSIT, participants: { create: Array.from({ length: people }, (_, index) => ({ name: index === 0 ? name : `Peserta ${index + 1}`, phone: index === 0 ? phone : null })) }, payment: { create: { amount: depositAmount, status: PaymentStatus.SIMULATED_DEPOSIT } } } });
      return { ok: true, bookingNumber: booking.bookingNumber, deposit: depositAmount };
    });
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Booking gagal disimpan." }; }
}
