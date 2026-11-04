export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } });
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><Link className="nav-cta" href="/paket">Jelajahi paket</Link></nav><section className="catalog-head wrap"><p className="eyebrow">Dokumentasi perjalanan</p><h1>Potongan kecil<br /><em>dari perjalanan.</em></h1><p className="hero-text">Foto-foto demo dari destinasi yang kami jelajahi.</p></section><section className="gallery-grid wrap">{images.length ? images.map((image) => <figure key={image.id}><img src={image.imageUrl} alt={image.altText} /><figcaption>{image.title}<small>{image.destination}</small></figcaption></figure>) : <div className="empty-state"><h2>Galeri segera hadir.</h2><p>Dokumentasi demo akan ditambahkan oleh admin.</p></div>}</section></main>;
}
