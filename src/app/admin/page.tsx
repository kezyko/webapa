import Link from "next/link";
import { BookingStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/packages";
import { logoutAction } from "@/app/auth/actions";
import { updateBookingStatus } from "./actions";

const statusLabels: Record<BookingStatus, string> = { WAITING_DEPOSIT: "Menunggu DP", SIMULATED_DEPOSIT_RECORDED: "DP Simulasi Tercatat", CONFIRMED: "Dikonfirmasi Admin", COMPLETED: "Selesai", CANCELLED: "Dibatalkan" };

export default async function AdminPage() {
  const admin = await requireAdmin();
  const [bookings, total, pending, simulated] = await Promise.all([prisma.booking.findMany({ include: { user: true, package: true, schedule: true, payment: true }, orderBy: { createdAt: "desc" } }), prisma.booking.count(), prisma.booking.count({ where: { status: "WAITING_DEPOSIT" } }), prisma.booking.aggregate({ _sum: { depositAmount: true }, where: { paymentStatus: "SIMULATED_DEPOSIT" } })]);
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><div className="admin-nav"><span>{admin.name}</span><form action={logoutAction}><button className="nav-cta logout-button" type="submit">Keluar</button></form></div></nav><section className="admin wrap"><p className="eyebrow">Dashboard admin · Data demo</p><h1>Ringkasan<br /><em>perjalanan.</em></h1><div className="stats-grid"><div><small>Total booking</small><strong>{total}</strong></div><div><small>Menunggu DP</small><strong>{pending}</strong></div><div><small>DP simulasi tercatat</small><strong>{formatRupiah(simulated._sum.depositAmount ?? 0)}</strong></div></div><div className="admin-section-head"><h2>Booking terbaru</h2><span>{bookings.length} record</span></div><div className="admin-table">{bookings.length ? bookings.map((booking) => <article className="admin-booking" key={booking.id}><div><p className="eyebrow">{booking.bookingNumber}</p><h3>{booking.package.title}</h3><p>{booking.user.name} · {booking.user.phone ?? "Tanpa nomor"}</p><small>{booking.schedule.departureDate.toLocaleDateString("id-ID")} · {booking.participantQty} peserta</small></div><div className="admin-money"><span>{formatRupiah(booking.depositAmount)} DP simulasi</span><strong>{statusLabels[booking.status]}</strong></div><form className="status-form" action={updateBookingStatus}><input type="hidden" name="bookingId" value={booking.id} /><select name="status" defaultValue={booking.status}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="text-link" type="submit">Simpan</button></form></article>) : <div className="empty-state"><h2>Belum ada booking.</h2><p>Booking pelanggan akan muncul di sini.</p></div>}</div></section></main>;
}
