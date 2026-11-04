import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header"><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><div className="navlinks"><Link href="/paket">Paket wisata</Link><Link href="/galeri">Galeri</Link><Link href="/promo">Promo</Link><Link href="/itinerary">Itinerary khusus</Link></div><div className="header-actions"><Link className="header-account" href="/akun">Akun</Link><Link className="nav-cta" href="/paket">Jelajahi paket <span>↗</span></Link></div></nav></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="wrap footer-grid"><div><Link className="brand light" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><p>Perjalanan Indonesia,<br />dibuat dengan hati.</p></div><div><p className="footer-label">Jelajahi</p><Link href="/paket">Paket wisata</Link><Link href="/galeri">Galeri perjalanan</Link><Link href="/promo">Promo</Link><Link href="/itinerary">Itinerary khusus</Link></div><div><p className="footer-label">Hubungi kami</p><a href="https://wa.me/6281234567890">WhatsApp</a><a href="mailto:halo@garudawisatajaya.demo">halo@garudawisatajaya.demo</a><p className="demo-note">Semua informasi pada website ini adalah data demo.</p></div></div><div className="wrap footer-bottom"><span>© 2026 Garuda Wisata Jaya</span><span>Made for meaningful journeys.</span></div></footer>;
}
