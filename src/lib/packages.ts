export type TravelPackage = {
  slug: string;
  place: string;
  title: string;
  days: string;
  price: number;
  category: string;
  image: string;
  description: string;
  departure: string;
  quota: number;
  meetingPoint: string;
  includes: string[];
  itinerary: string[];
};

export const packages: TravelPackage[] = [
  { slug: "bali-island-of-the-gods", place: "Bali", title: "Island of the Gods", days: "4 hari 3 malam", price: 3250000, category: "Open trip", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85", description: "Ritme pulau, laut yang tenang, dan pengalaman Bali yang lebih berkesan.", departure: "12–15 Desember 2026", quota: 8, meetingPoint: "Bandara Ngurah Rai", includes: ["Hotel 3 malam", "Transportasi selama tour", "Sarapan dan tiket wisata"], itinerary: ["Tiba di Bali, check-in dan sunset di Uluwatu", "Ubud: sawah, pura, dan makan siang lokal", "Nusa Penida dan waktu bebas", "Sarapan lalu perjalanan pulang"] },
  { slug: "bromo-sunrise-escape", place: "Jawa Timur", title: "Bromo Sunrise Escape", days: "3 hari 2 malam", price: 1850000, category: "Open trip", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85", description: "Mengejar matahari terbit dan lanskap vulkanik Jawa Timur.", departure: "20–22 November 2026", quota: 12, meetingPoint: "Surabaya", includes: ["Homestay 2 malam", "Jeep sunrise Bromo", "Transportasi dan dokumentasi"], itinerary: ["Berangkat dari Surabaya menuju Bromo", "Sunrise viewpoint, Kawah Bromo, dan savana", "Air terjun Madakaripura lalu pulang"] },
  { slug: "yogyakarta-heritage", place: "Yogyakarta", title: "Heritage & Slow Living", days: "3 hari 2 malam", price: 1650000, category: "Culture trip", image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=85", description: "Menikmati sejarah, rasa, dan keramahan Yogyakarta dengan tempo yang nyaman.", departure: "5–7 Januari 2027", quota: 10, meetingPoint: "Stasiun Tugu Yogyakarta", includes: ["Hotel 2 malam", "Transportasi lokal", "Tur kuliner dan tiket candi"], itinerary: ["Malioboro dan kuliner malam", "Borobudur sunrise dan desa wisata", "Keraton, Kotagede, lalu checkout"] },
  { slug: "labuan-bajo-sailing", place: "Labuan Bajo", title: "Sailing the Komodo Sea", days: "4 hari 3 malam", price: 4750000, category: "Sailing trip", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85", description: "Berlayar di antara pulau, menikmati laut jernih, dan bertemu komodo.", departure: "18–21 Februari 2027", quota: 6, meetingPoint: "Bandara Komodo", includes: ["Liveaboard 3 malam", "Makan selama sailing", "Tiket taman nasional"], itinerary: ["Check-in kapal dan sunset di Kalong", "Padar, Komodo, dan Pink Beach", "Manta Point dan snorkeling", "Kembali ke Labuan Bajo"] },
];

export const formatRupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
