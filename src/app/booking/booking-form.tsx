"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { formatRupiah, packages } from "@/lib/packages";
import { createDemoBooking } from "./actions";

export default function BookingForm({ initialPackage }: { initialPackage?: string }) {
  const selected = packages.find((item) => item.slug === initialPackage) ?? packages[0];
  const [packageSlug, setPackageSlug] = useState(selected.slug);
  const [people, setPeople] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<{ bookingNumber: string; deposit: number } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const pack = packages.find((item) => item.slug === packageSlug) ?? packages[0];
  const total = pack.price * people;
  const deposit = Math.round(total * 0.3);
  const remaining = total - deposit;
  const valid = useMemo(() => name.trim().length >= 3 && phone.trim().length >= 8, [name, phone]);
  const submit = () => startTransition(async () => { setError(""); const response = await createDemoBooking({ packageSlug, name, phone, people }); if (response.ok) setResult({ bookingNumber: response.bookingNumber, deposit: response.deposit }); else setError(response.message); });
  if (result) { const whatsappText = encodeURIComponent(`Halo Garuda Wisata Jaya, saya ingin konfirmasi booking demo ${result.bookingNumber}. Paket: ${pack.title}, jadwal: ${pack.departure}, peserta: ${people}, DP simulasi: ${formatRupiah(result.deposit)}.`); return <section className="confirmation wrap"><div className="confirmation-mark">✓</div><p className="eyebrow">Booking berhasil dibuat</p><h1>Perjalananmu<br /><em>dimulai di sini.</em></h1><p>Booking <strong>{result.bookingNumber}</strong> telah tersimpan ke database demo. Tidak ada uang sungguhan yang diproses.</p><div className="summary-box"><span>{pack.title} · {people} peserta</span><strong>DP simulasi {formatRupiah(result.deposit)}</strong></div><div className="hero-actions"><a className="button dark" href={`https://wa.me/6281234567890?text=${whatsappText}`} target="_blank" rel="noreferrer">Lanjutkan ke WhatsApp <span>↗</span></a><Link className="text-link" href="/paket">Kembali ke katalog</Link></div></section>; }
  return <section className="booking-layout wrap"><div><p className="eyebrow">Booking paket reguler</p><h1>Siapkan<br /><em>perjalananmu.</em></h1><p className="hero-text">Isi data singkat di bawah ini. Pembayaran yang ditampilkan hanya simulasi demo.</p><Link className="text-link" href={`/paket/${pack.slug}`}>← Lihat detail paket</Link></div><form className="booking-form" onSubmit={(event) => { event.preventDefault(); if (valid && !isPending) submit(); }}><label>Pilih paket<select value={packageSlug} onChange={(event) => setPackageSlug(event.target.value)}>{packages.map((item) => <option key={item.slug} value={item.slug}>{item.title} — {formatRupiah(item.price)}</option>)}</select></label><label>Nama pemesan<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama lengkap" required /></label><label>Nomor WhatsApp<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="08xxxxxxxxxx" required /></label><label>Jumlah peserta<div className="stepper"><button type="button" onClick={() => setPeople(Math.max(1, people - 1))}>−</button><strong>{people}</strong><button type="button" onClick={() => setPeople(Math.min(pack.quota, people + 1))}>+</button></div></label><div className="booking-summary"><div><span>Total harga</span><strong>{formatRupiah(total)}</strong></div><div><span>DP simulasi (30%)</span><strong>{formatRupiah(deposit)}</strong></div><div><span>Sisa pembayaran</span><strong>{formatRupiah(remaining)}</strong></div></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button dark submit-booking" type="submit" disabled={!valid || isPending}>{isPending ? "Menyimpan booking..." : "Simulasikan pembayaran DP"} <span>↗</span></button><small className="form-disclaimer">Dengan melanjutkan, kamu memahami bahwa ini bukan transaksi pembayaran nyata.</small></form></section>;
}
