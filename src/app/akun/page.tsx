import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/packages";
import { logoutAction } from "@/app/auth/actions";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?error=Silakan+masuk+untuk+melihat+akun");
  const bookings = await prisma.booking.findMany({ where: { userId: user.id }, include: { package: true, schedule: true, payment: true }, orderBy: { createdAt: "desc" } });
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><form action={logoutAction}><button className="nav-cta logout-button" type="submit">Keluar</button></form></nav><section className="account wrap"><p className="eyebrow">Akun pelanggan</p><h1>Halo, {user.name.split(" ")[0]}.<br /><em>Siap berangkat?</em></h1><div className="account-head"><p>Riwayat booking kamu</p><Link className="button dark" href="/paket">Cari paket <span>↗</span></Link></div>{bookings.length ? <div className="account-list">{bookings.map((booking) => <article className="account-booking" key={booking.id}><div><p className="eyebrow">{booking.bookingNumber}</p><h2>{booking.package.title}</h2><p>{booking.schedule.departureDate.toLocaleDateString("id-ID")} · {booking.participantQty} peserta</p></div><div className="account-status"><span>{booking.status.replaceAll("_", " ")}</span><strong>{formatRupiah(booking.depositAmount)} <small>DP simulasi</small></strong></div></article>)}</div> : <div className="empty-state"><h2>Belum ada booking.</h2><p>Temukan perjalanan pertamamu dari katalog paket.</p></div>}</section></main>;
}
