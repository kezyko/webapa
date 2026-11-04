# Deployment Garuda Wisata Jaya

Panduan ini untuk server Ubuntu baru yang menjalankan aplikasi Next.js dengan MySQL.

## Arsitektur production

```text
Internet
  ↓
Nginx :80/:443
  ↓
Next.js + PM2 :3000
  ↓
MySQL :3306 (localhost only)
```

Aplikasi menggunakan:

- Next.js
- Node.js LTS
- Prisma ORM
- MySQL
- PM2
- Nginx
- Certbot / Let's Encrypt

> Jalankan perintah sebagai user deploy biasa yang memiliki akses `sudo`. Jangan menjalankan aplikasi sebagai `root`.

## 1. Prasyarat

Siapkan:

- VPS Ubuntu 22.04 atau 24.04 LTS
- Domain yang sudah mengarah ke IP server
- Repository GitHub: `https://github.com/kezyko/webapa.git`
- Kredensial MySQL production
- Nomor WhatsApp bisnis
- Email untuk SSL Let's Encrypt

Ganti nilai contoh berikut:

```text
DOMAIN=travel.example.com
APP_DIR=/var/www/garuda-wisata
DB_NAME=garuda_wisata
DB_USER=garuda_app
```

## 2. Update server dan firewall

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git unzip ufw nginx mysql-server

sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

Jangan membuka port MySQL ke internet. Port `3306` cukup listen di localhost.

## 3. Buat user deploy

Jika server masih memakai user root, buat user aplikasi:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
su - deploy
```

Login berikutnya gunakan user `deploy`.

## 4. Install Node.js LTS

Gunakan Node.js LTS melalui NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

Versi Node harus mengikuti requirement Next.js yang sedang dipakai. Jika build memberi peringatan versi, gunakan Node.js LTS terbaru.

## 5. Amankan MySQL dan buat database

Jalankan hardening bawaan:

```bash
sudo mysql_secure_installation
```

Buat database dan user aplikasi:

```bash
sudo mysql
```

Di prompt MySQL:

```sql
CREATE DATABASE garuda_wisata
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'garuda_app'@'localhost'
  IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_DATABASE_YANG_PANJANG';

GRANT ALL PRIVILEGES ON garuda_wisata.* TO 'garuda_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Password database harus disimpan di password manager, bukan di Git.

Verifikasi MySQL hanya listen lokal:

```bash
sudo ss -lntp | grep 3306
```

Jika konfigurasi MySQL membuka `0.0.0.0:3306`, ubah `bind-address` menjadi `127.0.0.1`, lalu restart:

```bash
sudo systemctl restart mysql
```

## 6. Clone aplikasi

```bash
sudo mkdir -p /var/www
sudo chown -R deploy:deploy /var/www
cd /var/www
git clone https://github.com/kezyko/webapa.git garuda-wisata
cd /var/www/garuda-wisata
```

Pastikan branch production:

```bash
git checkout main
git pull origin main
```

## 7. Buat environment production

Buat file `.env` di root aplikasi:

```bash
cd /var/www/garuda-wisata
nano .env
```

Isi minimal:

```env
NODE_ENV=production

DATABASE_URL="mysql://garuda_app:PASSWORD_DATABASE@localhost:3306/garuda_wisata"

AUTH_SECRET="ISI_DENGAN_SECRET_RANDOM_MINIMAL_32_KARAKTER"

NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"
```

Generate secret yang kuat:

```bash
openssl rand -base64 48
```

Atur permission:

```bash
chmod 600 .env
```

Jangan pernah commit `.env` ke repository.

## 8. Install dependency dan build

```bash
npm ci
npx prisma generate
npm run build
```

Jika build gagal karena koneksi database saat prerender, pastikan `DATABASE_URL` valid dan MySQL aktif:

```bash
sudo systemctl status mysql
```

## 9. Migrasi database

Untuk server production, gunakan migration yang sudah direview:

```bash
npx prisma migrate deploy
```

Seed hanya untuk instalasi demo baru:

```bash
npm run db:seed
```

Akun admin demo dari seed:

```text
Email: admin@garudawisatajaya.demo
Password: DemoAdmin123!
```

Segera ganti atau hapus akun/password demo setelah login pertama. Jangan menjalankan seed berulang pada database yang sudah berisi data bisnis tanpa review isi seed.

Jika belum ada folder migration, buat migration dari development pada database development, commit folder `prisma/migrations`, lalu jalankan `migrate deploy` di server. Jangan memakai `prisma db push` sebagai prosedur deployment production.

## 10. Jalankan dengan PM2

Install PM2:

```bash
sudo npm install -g pm2
```

Jalankan aplikasi:

```bash
cd /var/www/garuda-wisata
pm2 start npm --name garuda-wisata -- start
pm2 save
pm2 startup systemd
```

Perintah `pm2 startup systemd` mencetak satu perintah `sudo ...`. Salin dan jalankan perintah tersebut, lalu:

```bash
pm2 save
pm2 status
pm2 logs garuda-wisata --lines 100
```

Aplikasi harus listen di `127.0.0.1:3000` atau port default Next.js.

## 11. Konfigurasi Nginx

Buat konfigurasi:

```bash
sudo nano /etc/nginx/sites-available/garuda-wisata
```

Isi:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name travel.example.com www.travel.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Ganti `travel.example.com` dengan domain sebenarnya, lalu aktifkan:

```bash
sudo ln -s /etc/nginx/sites-available/garuda-wisata /etc/nginx/sites-enabled/garuda-wisata
sudo nginx -t
sudo systemctl reload nginx
```

Jika konfigurasi default mengganggu:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Tes dari server:

```bash
curl -I http://127.0.0.1:3000
curl -I http://travel.example.com
```

## 12. Aktifkan HTTPS

Pastikan DNS domain sudah mengarah ke IP server, lalu:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d travel.example.com -d www.travel.example.com
```

Tes renewal:

```bash
sudo certbot renew --dry-run
```

HTTPS wajib digunakan karena aplikasi memakai session cookie autentikasi.

## 13. Prosedur update aplikasi

Jalankan sebagai user `deploy`:

```bash
cd /var/www/garuda-wisata
git fetch origin
git checkout main
git pull --ff-only origin main
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload garuda-wisata --update-env
pm2 status
```

Jika build gagal, jangan reload PM2. Perbaiki error terlebih dahulu atau kembalikan commit:

```bash
git log --oneline -5
git checkout <commit-yang-diketahui-aman>
npm ci
npm run build
pm2 reload garuda-wisata --update-env
```

## 14. Backup MySQL

Buat folder backup yang tidak dapat diakses publik:

```bash
sudo mkdir -p /var/backups/garuda-wisata
sudo chown deploy:deploy /var/backups/garuda-wisata
```

Backup manual:

```bash
mysqldump --single-transaction --routines --triggers \
  -u garuda_app -p garuda_wisata \
  | gzip > /var/backups/garuda-wisata/garuda-$(date +%F-%H%M).sql.gz
```

Simpan backup di server lain atau object storage. Backup di server yang sama bukan disaster recovery.

Contoh cleanup backup lokal lebih dari 14 hari:

```bash
find /var/backups/garuda-wisata -type f -name '*.sql.gz' -mtime +14 -delete
```

Uji restore secara berkala ke database terpisah. Backup yang belum pernah direstore belum terbukti dapat dipakai.

## 15. Log dan monitoring

```bash
pm2 status
pm2 logs garuda-wisata --lines 100
sudo journalctl -u nginx -n 100 --no-pager
sudo tail -f /var/log/nginx/error.log
sudo systemctl status mysql
```

Pantau minimal:

- PM2 online
- Nginx aktif
- MySQL aktif
- Disk tidak penuh
- RAM tidak habis
- HTTPS belum kedaluwarsa
- Backup terakhir berhasil

## 16. Checklist smoke test production

Setelah deployment:

- [ ] Homepage dapat dibuka melalui HTTPS
- [ ] `/paket` menampilkan katalog
- [ ] Detail paket dapat dibuka
- [ ] Registrasi pelanggan berhasil
- [ ] Login pelanggan berhasil
- [ ] Booking tanpa login ditolak
- [ ] Booking login tersimpan ke MySQL
- [ ] Booking muncul di `/akun`
- [ ] Login admin berhasil
- [ ] `/admin` hanya dapat dibuka admin
- [ ] Admin dapat mengubah status booking
- [ ] Status baru terlihat di akun pelanggan
- [ ] `/admin/paket` dapat membuat paket dan jadwal
- [ ] `/admin/konten` dapat menyimpan galeri dan promo
- [ ] `/itinerary` menyimpan permintaan
- [ ] `/galeri` dan `/promo` membaca data MySQL
- [ ] Nomor WhatsApp production sudah benar
- [ ] Tidak ada password atau secret demo yang tersisa
- [ ] HTTPS valid
- [ ] Backup database dapat dibuat

## 17. Aturan untuk agent AI di server

Agent AI yang mengelola server harus mengikuti aturan ini:

1. Jangan menjalankan `git reset --hard`, `git clean -fd`, atau `rm -rf` tanpa backup dan persetujuan eksplisit.
2. Jangan menjalankan `prisma db push` di production.
3. Jangan mengubah atau menghapus migration yang sudah pernah dijalankan.
4. Selalu jalankan `git pull --ff-only origin main` sebelum update.
5. Jalankan `npm run build` sebelum reload PM2.
6. Jangan reload aplikasi jika build gagal.
7. Backup database sebelum migration yang mengubah struktur atau data.
8. Jangan mencetak isi `.env`, password, token, atau private key ke log/chat.
9. Jangan membuka port MySQL ke internet.
10. Gunakan perubahan kecil, commit jelas, dan catat rollback commit.
11. Setelah perubahan, jalankan smoke test URL dan alur yang terdampak.
12. Jika migration gagal, hentikan deployment dan jangan memaksa dengan `db push`.

## 18. Rollback aplikasi

Rollback hanya kode aplikasi:

```bash
cd /var/www/garuda-wisata
git fetch origin
git log --oneline -10
git checkout <commit-aman>
npm ci
npx prisma generate
npm run build
pm2 reload garuda-wisata --update-env
```

Rollback migration database tidak otomatis aman. Untuk perubahan schema destruktif, siapkan migration rollback atau restore backup yang sudah diuji sebelum deployment.
