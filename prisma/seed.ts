import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const demoPackages = [
  { slug: "bali-island-of-the-gods", place: "Bali", title: "Island of the Gods", category: "Open trip", price: 3250000, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85", description: "Ritme pulau, laut yang tenang, dan pengalaman Bali yang lebih berkesan.", departure: new Date("2026-12-12T00:00:00+07:00"), capacity: 8, meetingPoint: "Bandara Ngurah Rai" },
  { slug: "bromo-sunrise-escape", place: "Jawa Timur", title: "Bromo Sunrise Escape", category: "Open trip", price: 1850000, image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85", description: "Mengejar matahari terbit dan lanskap vulkanik Jawa Timur.", departure: new Date("2026-11-20T00:00:00+07:00"), capacity: 12, meetingPoint: "Surabaya" },
  { slug: "yogyakarta-heritage", place: "Yogyakarta", title: "Heritage & Slow Living", category: "Culture trip", price: 1650000, image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85", description: "Menikmati sejarah, rasa, dan keramahan Yogyakarta dengan tempo yang nyaman.", departure: new Date("2027-01-05T00:00:00+07:00"), capacity: 10, meetingPoint: "Stasiun Tugu Yogyakarta" },
  { slug: "labuan-bajo-sailing", place: "Labuan Bajo", title: "Sailing the Komodo Sea", category: "Sailing trip", price: 4750000, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85", description: "Berlayar di antara pulau, menikmati laut jernih, dan bertemu komodo.", departure: new Date("2027-02-18T00:00:00+07:00"), capacity: 6, meetingPoint: "Bandara Komodo" },
];

async function main() {
  for (const item of demoPackages) {
    const destination = await prisma.destination.upsert({ where: { name: item.place }, update: {}, create: { name: item.place, description: `Destinasi demo ${item.place}.` } });
    const travelPackage = await prisma.travelPackage.upsert({ where: { slug: item.slug }, update: { title: item.title, category: item.category, price: item.price, image: item.image, description: item.description }, create: { slug: item.slug, title: item.title, category: item.category, price: item.price, image: item.image, description: item.description, destinationId: destination.id } });
    await prisma.schedule.upsert({ where: { packageId_departureDate: { packageId: travelPackage.id, departureDate: item.departure } }, update: { capacity: item.capacity, meetingPoint: item.meetingPoint }, create: { packageId: travelPackage.id, departureDate: item.departure, capacity: item.capacity, meetingPoint: item.meetingPoint } });
  }
  const adminPasswordHash = await bcrypt.hash("DemoAdmin123!", 12);
  await prisma.user.upsert({ where: { email: "admin@garudawisatajaya.demo" }, update: { role: "ADMIN", passwordHash: adminPasswordHash }, create: { name: "Admin Garuda Wisata", email: "admin@garudawisatajaya.demo", passwordHash: adminPasswordHash, role: "ADMIN" } });
}

main().finally(() => prisma.$disconnect());
