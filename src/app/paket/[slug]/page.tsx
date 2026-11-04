import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRupiah, packages } from "@/lib/packages";

export function generateStaticParams() { return packages.map((item) => ({ slug: item.slug })); }
export default async function PackageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = packages.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><Link className="nav-cta" href="/paket">← Semua paket</Link></nav><section className="detail wrap"><div className="detail-image" style={{ backgroundImage: `url(${item.image})` }}><span className="tag">{item.category}</span></div><div className="detail-copy"><p className="eyebrow">{item.place} · {item.days}</p><h1>{item.title}</h1><p className="detail-description">{item.description}</p><div className="detail-price"><small>Mulai dari</small><strong>{formatRupiah(item.price)} <em>/ orang</em></strong></div><div className="detail-meta"><div><small>Keberangkatan</small><b>{item.departure}</b></div><div><small>Sisa kuota</small><b>{item.quota} peserta</b></div><div><small>Titik kumpul</small><b>{item.meetingPoint}</b></div></div><Link className="button dark booking-button" href={`/booking?package=${item.slug}`}>Pesan paket ini <span>↗</span></Link><p className="demo-note">Pembayaran pada demo ini bersifat simulasi.</p></div></section><section className="detail-lower wrap"><div><p className="eyebrow">Rencana perjalanan</p><h2>Hari-hari yang<br /><em>akan diingat.</em></h2>{item.itinerary.map((day, index) => <div className="itinerary-row" key={day}><span>0{index + 1}</span><p>{day}</p></div>)}</div><div className="included"><p className="eyebrow">Termasuk dalam paket</p>{item.includes.map((entry) => <p key={entry}>✓ {entry}</p>)}<p className="demo-note">Detail paket, harga, dan jadwal adalah konten demo.</p></div></section></main>;
}
