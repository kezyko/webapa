import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/packages";
import { logoutAction } from "@/app/auth/actions";
import { savePackage } from "../packages-actions";

export default async function AdminPackagesPage() {
  await requireAdmin();
  const packages = await prisma.travelPackage.findMany({ include: { destination: true, schedules: { orderBy: { departureDate: "asc" } } }, orderBy: { createdAt: "desc" } });
  return <main><nav className="nav wrap"><Link className="brand" href="/admin"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><div className="admin-nav"><Link className="nav-cta" href="/admin">Dashboard</Link><form action={logoutAction}><button className="nav-cta logout-button" type="submit">Keluar</button></form></div></nav><section className="admin wrap"><p className="eyebrow">Admin · Katalog dan jadwal</p><h1>Kelola<br /><em>perjalanan.</em></h1><div className="admin-editor"><p className="eyebrow">Tambah paket atau jadwal</p><form action={savePackage} className="package-editor"><input name="title" placeholder="Nama paket" required /><input name="slug" placeholder="slug-paket" required /><input name="destination" placeholder="Destinasi" required /><input name="category" placeholder="Kategori" required /><input name="price" type="number" placeholder="Harga / orang" required /><input name="capacity" type="number" placeholder="Kuota" required /><input name="meetingPoint" placeholder="Titik kumpul" required /><input name="departureDate" type="datetime-local" required /><input name="image" type="url" placeholder="URL foto" required /><textarea name="description" placeholder="Deskripsi paket" required /><button className="button dark" type="submit">Simpan paket <span>↗</span></button></form></div><div className="admin-section-head"><h2>Paket aktif</h2><span>{packages.length} paket</span></div><div className="package-admin-list">{packages.map((item) => <article key={item.id}><div><p className="eyebrow">{item.destination.name} · {item.category}</p><h3>{item.title}</h3><p>{formatRupiah(item.price)} / orang</p></div><div>{item.schedules.map((schedule) => <p key={schedule.id}>{schedule.departureDate.toLocaleDateString("id-ID")} · {schedule.capacity} kuota · {schedule.meetingPoint}</p>)}</div></article>)}</div></section></main>;
}
