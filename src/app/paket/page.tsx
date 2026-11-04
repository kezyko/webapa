import Link from "next/link";
import CatalogClient from "./catalog-client";

export default function PaketPage() {
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><div className="navlinks"><Link href="/paket">Paket wisata</Link><Link href="/#tentang">Tentang kami</Link><Link href="/#kontak">Kontak</Link></div><Link className="nav-cta" href="/">Kembali ke beranda</Link></nav><section className="catalog-head wrap"><p className="eyebrow">Katalog perjalanan</p><h1>Temukan tempat<br /><em>untuk dikenang.</em></h1><p className="hero-text">Paket demo dengan jadwal, kuota, fasilitas, dan itinerary yang transparan.</p></section><CatalogClient /><footer><div className="wrap footer-bottom"><span>© 2026 Garuda Wisata Jaya</span><span>Semua informasi adalah data demo.</span></div></footer></main>;
}
