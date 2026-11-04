import Link from "next/link";
import { loginAction } from "@/app/auth/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main><nav className="nav wrap"><Link className="brand" href="/"><span>GW</span><strong>Garuda Wisata<br />Jaya</strong></Link><Link className="nav-cta" href="/daftar">Buat akun</Link></nav><section className="auth-layout wrap"><div><p className="eyebrow">Selamat datang kembali</p><h1>Masuk dan<br /><em>mulai menjelajah.</em></h1></div><form className="booking-form auth-form" action={loginAction}><h2>Masuk</h2>{error && <p className="form-error" role="alert">{error}</p>}<label>Email<input name="email" type="email" placeholder="nama@email.com" required /></label><label>Password<input name="password" type="password" placeholder="Minimal 8 karakter" required /></label><button className="button dark submit-booking" type="submit">Masuk <span>↗</span></button><p className="auth-switch">Belum punya akun? <Link href="/daftar">Daftar sekarang</Link></p></form></section></main>;
}
