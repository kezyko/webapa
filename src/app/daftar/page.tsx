import Link from "next/link";
import { registerAction } from "@/app/auth/actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><Link className="nav-cta" href="/masuk">Sudah punya akun?</Link></nav><section className="auth-layout wrap"><div><p className="eyebrow">Buat akun pelanggan</p><h1>Rencanakan<br /><em>cerita berikutnya.</em></h1></div><form className="booking-form auth-form" action={registerAction}><h2>Daftar</h2>{error && <p className="form-error" role="alert">{error}</p>}<label>Nama lengkap<input name="name" placeholder="Nama lengkap" required /></label><label>Email<input name="email" type="email" placeholder="nama@email.com" required /></label><label>Nomor WhatsApp<input name="phone" placeholder="08xxxxxxxxxx" required /></label><label>Password<input name="password" type="password" placeholder="Minimal 8 karakter" required /></label><button className="button dark submit-booking" type="submit">Buat akun <span>↗</span></button><p className="auth-switch">Sudah punya akun? <Link href="/masuk">Masuk</Link></p></form></section></main>;
}
