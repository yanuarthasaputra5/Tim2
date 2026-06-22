# PRD – Integrasi Fitur Promo (Frontend)

## Objective

Tambahkan fitur Promo ke aplikasi dengan cara mengintegrasikan frontend terhadap backend yang sudah tersedia.

Project saat ini sudah memiliki:

* Authentication
* Dashboard Admin
* Product Management
* Product Catalog User
* API Service Existing

AI TIDAK BOLEH langsung membuat asumsi endpoint atau struktur data promo.

AI WAJIB melakukan audit backend terlebih dahulu untuk memastikan fitur promo sudah tersedia dan dapat digunakan.

Jika backend promo sudah lengkap, lanjutkan implementasi frontend tanpa mengubah backend.

---

# Tahap 1 – Audit Backend (Wajib)

Sebelum membuat kode frontend:

## Analisis Struktur Backend

Periksa:

* Route Promo
* Controller Promo
* Service Promo
* DTO Request
* DTO Response
* Validation
* Database Schema
* Relasi Product ↔ Promo

Cari dan dokumentasikan:

### Endpoint yang tersedia

Contoh:

* GET /promo
* GET /promo/:id
* POST /promo
* PATCH /promo/:id
* DELETE /promo/:id

atau endpoint lain yang ditemukan.

### Struktur Response

Identifikasi response API sebenarnya.

Contoh:

```json
{
  "id": 1,
  "productId": 5,
  "discountPercentage": 20,
  "startDate": "...",
  "endDate": "...",
  "isActive": true
}
```

JANGAN mengasumsikan struktur data.

Gunakan struktur yang benar-benar ada pada backend.

---

## Validasi Backend

Evaluasi apakah backend sudah memenuhi kebutuhan frontend:

* CRUD Promo tersedia
* Relasi Product tersedia
* Response sudah lengkap
* Data promo dapat ditampilkan ke user
* Status promo tersedia
* Harga promo dapat dihitung atau sudah disediakan backend

Jika ada kekurangan kecil yang menghalangi frontend:

Jelaskan kekurangan tersebut terlebih dahulu sebelum melakukan perubahan.

---

# Tahap 2 – Analisis Frontend Existing (Wajib)

Sebelum implementasi:

Analisis seluruh struktur frontend.

Identifikasi:

* Framework
* Routing
* Layout Admin
* Sidebar Admin
* State Management
* Service Layer/API
* Reusable Components
* Product Pages
* Existing CRUD Pattern

Tujuan:

Seluruh implementasi promo harus mengikuti pola yang sudah digunakan project.

---

# Aturan Implementasi

## Penting

JANGAN:

* Membuat struktur folder baru tanpa alasan.
* Membuat design system baru.
* Membuat styling yang berbeda dari halaman lain.
* Membuat API service baru jika sudah ada pattern service.

HARUS:

* Mengikuti struktur project yang ada.
* Menggunakan komponen existing.
* Menggunakan styling existing.
* Menggunakan pattern CRUD existing.

Frontend promo harus terasa seperti fitur bawaan project, bukan fitur tambahan dari developer lain.

---

# Fitur Admin

## Menu Promo

Tambahkan menu:

Promo

ke sidebar admin menggunakan pola menu yang sudah ada.

Posisi menyesuaikan struktur menu saat ini.

---

## Halaman Promo

Buat halaman daftar promo menggunakan komponen tabel yang sudah dipakai pada halaman lain.

Kolom mengikuti data yang tersedia dari backend.

Contoh:

* Produk
* Diskon
* Harga Promo
* Tanggal Mulai
* Tanggal Berakhir
* Status
* Aksi

Jika backend memiliki field berbeda, sesuaikan.

---

## Tambah Promo

Gunakan form style yang sama dengan:

* Tambah Produk
* Edit Produk

atau form admin lain yang sudah tersedia.

Field mengikuti endpoint backend.

Jangan membuat field yang tidak ada pada backend.

---

## Edit Promo

Gunakan pola edit yang sama dengan CRUD lain.

---

## Hapus Promo

Gunakan dialog konfirmasi yang sudah digunakan pada project.

---

# Fitur User

Jika backend mengembalikan informasi promo pada produk:

Implementasikan:

## Product Card

* Badge Promo
* Persentase Diskon
* Harga Asli Dicoret
* Harga Promo

Mengikuti design card produk yang sudah ada.

---

## Detail Produk

Tampilkan informasi promo menggunakan komponen UI yang sudah digunakan pada halaman detail produk.

---

## Section Produk Promo

Jika API memungkinkan:

Tambahkan section:

"Produk Promo"

pada halaman produk.

Gunakan card produk yang sudah ada.

---

# UI Requirement

AI wajib mempelajari UI yang sudah ada terlebih dahulu.

Jangan membuat desain baru.

Harus:

* Warna mengikuti tema aplikasi.
* Spacing mengikuti halaman lain.
* Typography mengikuti halaman lain.
* Table mengikuti halaman admin lain.
* Form mengikuti halaman admin lain.
* Modal mengikuti modal existing.

Targetnya adalah pengguna tidak bisa membedakan apakah fitur promo dibuat belakangan atau sejak awal project dibuat.

---

# Deliverables

Sebelum coding tampilkan:

1. Hasil audit backend promo.
2. Endpoint yang ditemukan.
3. Struktur response yang ditemukan.
4. Kekurangan backend (jika ada).
5. Struktur frontend yang akan digunakan.
6. File yang akan dibuat.
7. File yang akan dimodifikasi.

Setelah itu baru lakukan implementasi.

---

# Acceptance Criteria

## Backend

* Endpoint promo berhasil ditemukan.
* Struktur data tervalidasi.
* Tidak ada asumsi endpoint.

## Admin

* Menu Promo muncul.
* CRUD Promo berfungsi.
* Terintegrasi dengan backend existing.

## User

* Produk promo tampil dengan benar.
* Harga promo tampil dengan benar.
* Badge promo tampil dengan benar.

## Code Quality

* Mengikuti struktur project existing.
* Tidak ada duplicate component.
* Tidak ada duplicate styling.
* Reuse component dan service yang sudah ada.
* Konsisten dengan arsitektur project.
