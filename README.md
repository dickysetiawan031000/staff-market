
# 🛒 Staff Market

**Staff Market** adalah aplikasi CRUD berbasis Laravel dan React JS untuk mengelola transaksi pembelian barang oleh karyawan. Aplikasi ini mendukung tampilan responsif dan dapat diakses sebagai Progressive Web App (PWA).

---

## 📌 Deskripsi Project

Staff Market memungkinkan admin untuk:
- Mengelola data karyawan (Employee)
- Mengelola data master barang (Item)
- Mencatat dan mengelola transaksi pembelian oleh karyawan
- Melihat status pembayaran transaksi
- Mencari transaksi berdasarkan karyawan atau item

Aplikasi ini dirancang sebagai aplikasi monolith Laravel dengan frontend React yang di-*embed* melalui Vite.

---

## 🚀 Fitur

- CRUD Karyawan
- CRUD Barang
- CRUD Transaksi Pembelian
- Filter dan pencarian transaksi
- Status pembayaran (lunas/belum)
- Autentikasi pengguna
- Dukungan PWA (installable di perangkat mobile)

---

## 🛠️ Teknologi yang Digunakan

| Layer     | Teknologi               |
|-----------|--------------------------|
| Backend   | Laravel 11 (PHP 8.2+)   |
| Frontend  | React JS (tanpa TS)     |
| Database  | PostgreSQL              |
| UI        | Blade + Tailwind CSS    |
| PWA       | vite-plugin-pwa (React) |
| Auth      | Laravel Breeze          |
| Role/Permission | Spatie Laravel Permission |

---

## ⚙️ Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/staff-market.git
cd staff-market
```

### 2. Install Dependency
```bash
composer install
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Konfigurasi Database PostgreSQL
Buat database `staff_market` terlebih dahulu via PgAdmin/DataGrip atau CLI:
```sql
CREATE DATABASE staff_market;
```

Ubah konfigurasi `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=staff_market
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 5. Jalankan Migration & Seeder
```bash
php artisan migrate --seed
```
Seeder akan mengisi data awal untuk employee dan item.

### 6. Jalankan Server
```bash
php artisan serve
npm run dev
```

Akses di `http://localhost:8000`

---

## 👥 Akun Login

Silakan buat akun melalui halaman register, atau gunakan data yang ada dari seeder.

🔐 Admin

    Email: admin@staffmarket.com

    Password: password

👷 Employee/User

Employee One

    Email: employee1@staffmarket.com

    Password: password

Employee Two

    Email: employee2@staffmarket.com

    Password: password

---


---

## 📱 PWA Support

Aplikasi dapat di-*install* di perangkat seperti mobile melalui fitur PWA


---
