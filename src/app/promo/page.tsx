export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PromoPage() {
  const promotions = await prisma.promotion.findMany({ where: { active: true, validUntil: { gte: new Date() } }, orderBy: { validUntil: "asc" } });
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><Link className="nav-cta" href="/paket">Jelajahi paket</Link></nav><section className="catalog-head wrap"><p className="eyebrow">Penawaran demo</p><h1>Alasan lain<br /><em>untuk berangkat.</em></h1></section><section className="promo-grid wrap">{promotions.length ? promotions.map((promo) => <article key={promo.id}><p className="eyebrow">Berlaku sampai {promo.validUntil.toLocaleDateString("id-ID")}</p><h2>{promo.title}</h2><p>{promo.description}</p>{promo.code && <strong>{promo.code}</strong>}</article>) : <div className="empty-state"><h2>Belum ada promo aktif.</h2><p>Promo demo akan muncul di halaman ini.</p></div>}</section></main>;
}
