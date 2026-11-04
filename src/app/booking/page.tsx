import Link from "next/link";
import BookingForm from "./booking-form";

export default function BookingPage() {
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><Link className="nav-cta" href="/paket">← Semua paket</Link></nav><BookingForm /><footer><div className="wrap footer-bottom"><span>© 2026 Garuda Wisata Jaya</span><span>Pembayaran simulasi — data demo</span></div></footer></main>;
}
