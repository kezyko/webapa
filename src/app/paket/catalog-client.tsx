"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatRupiah, packages } from "@/lib/packages";

export default function CatalogClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const filtered = useMemo(() => packages.filter((item) => `${item.title} ${item.place}`.toLowerCase().includes(query.toLowerCase()) && (!category || item.category === category)), [query, category]);
  return <section className="catalog wrap"><div className="filter-bar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari destinasi atau paket..." /><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Semua kategori</option>{[...new Set(packages.map((item) => item.category))].map((item) => <option key={item}>{item}</option>)}</select><button className="button dark" type="button">Cari paket</button></div><p className="result-count">{filtered.length} paket tersedia <span>Data demo</span></p>{filtered.length ? <div className="package-grid">{filtered.map((item) => <article className="package-card" key={item.slug}><Link href={`/paket/${item.slug}`}><div className="package-image" style={{ backgroundImage: `url(${item.image})` }}><span className="tag">{item.category}</span></div><div className="package-info"><p>{item.place} <span>·</span> {item.days}</p><h3>{item.title}</h3><strong>{formatRupiah(item.price)} <small>/ orang</small></strong></div></Link></article>)}</div> : <div className="empty-state"><h2>Paket belum ditemukan.</h2><p>Coba gunakan kata kunci atau kategori lain.</p></div>}</section>;
}
