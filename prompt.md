Prompt

Saya ingin Anda bertindak sebagai Senior Frontend Architect & Technical Lead.

Jangan langsung membuat kode.

Tugas Anda adalah membuat Implementation Plan / Technical Blueprint yang sangat detail sebelum proses development dimulai.

Project yang akan dibuat adalah:

Frontend: React JS (Vite, React versi terbaru)
Backend: Laravel 13 REST API (sudah selesai)
Fokus fitur: Authentication dan Admin Panel
Backend dan Frontend framework sudah terinstall
Tugas Anda hanya merancang struktur dan rencana implementasi frontend
Ketentuan Struktur Frontend

Frontend harus memiliki struktur terorganisir seperti berikut:

src/
│
├── components/
│   ├── auth/
│   ├── admin/
│   └── common/
│
├── layouts/
│   ├── auth/
│   └── admin/
│
├── pages/
│   ├── auth/
│   └── admin/
│       ├── dashboard/
│       ├── profile/
│       ├── roles/
│       ├── permissions/
│       └── user-roles/
│
├── services/
│
├── routes/
│
├── App.jsx
└── main.jsx
Ketentuan Arsitektur
Gunakan React versi terbaru
Gunakan React Router DOM
Gunakan Axios
Gunakan Tailwind CSS
Gunakan React Hook Form
Gunakan Zod Validation
Gunakan React Hot Toast
Gunakan Lucide React

Jangan gunakan:

Redux
Zustand
Context API
Custom Hooks
Utils Folder

State management cukup menggunakan:

useState
useEffect
localStorage
Backend API Sudah Tersedia

Silakan analisis endpoint berikut dan gunakan sebagai dasar perencanaan:

Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
POST /api/auth/logout
POST /api/auth/logout-all
Roles
GET /api/admin/roles
POST /api/admin/roles
PUT /api/admin/roles/{id}
DELETE /api/admin/roles/{id}
Permissions
GET /api/admin/permissions
POST /api/admin/permissions
DELETE /api/admin/permissions/{id}
User Roles
POST /api/admin/users/{userId}/assign-role
POST /api/admin/users/{userId}/revoke-role
Yang Harus Anda Kerjakan

Jangan membuat source code.

Buat dokumen planning lengkap yang mencakup:

1. Analisis Kebutuhan
Breakdown seluruh fitur yang harus dibuat
Identifikasi kebutuhan halaman
Identifikasi kebutuhan komponen
Identifikasi kebutuhan service API
2. Perancangan Struktur Folder

Jelaskan struktur folder final secara detail.

Untuk setiap folder dan file jelaskan:

tujuan
tanggung jawab
alasan dibuat
3. Perancangan Routing

Buat mapping seluruh route.

Jelaskan:

guest route
protected route
redirect logic
unauthorized flow
logout flow
4. Perancangan Layout

Jelaskan:

Auth Layout
Admin Layout
Struktur Sidebar
Struktur Navbar
Content Area
5. Perancangan Pages

Untuk setiap halaman jelaskan:

tujuan halaman
fitur halaman
endpoint yang digunakan
komponen yang digunakan
state yang dibutuhkan
validasi yang dibutuhkan
6. Perancangan Components

Kelompokkan menjadi:

Auth Components
Admin Components
Common Components

Jelaskan fungsi dan tanggung jawab masing-masing.

7. Perancangan Service Layer

Jelaskan service yang perlu dibuat.

Contoh:

api service
auth service
role service
permission service
user role service

Jelaskan method yang dimiliki masing-masing service.

8. Authentication Flow

Jelaskan secara rinci:

login flow
register flow
profile flow
logout flow
logout all devices flow
9. Authorization Flow

Jelaskan bagaimana frontend akan:

menyimpan token
membaca role user
membaca permission user
melindungi halaman admin
10. Dashboard Planning

Karena endpoint dashboard tidak tersedia, buat rekomendasi dashboard berdasarkan data yang dapat diperoleh dari:

profile
roles
permissions

Jelaskan widget dan card yang akan ditampilkan.

11. Form Validation Planning

Jelaskan validasi Zod yang akan digunakan pada:

Login
Register
Create Role
Edit Role
Create Permission
Assign Role
Revoke Role
12. API Error Handling Strategy

Jelaskan standar handling untuk:

400
401
403
404
422
500
13. UI/UX Planning

Jelaskan:

user journey
navigation flow
loading states
empty states
confirmation dialog
success/error feedback
14. Development Roadmap

Tambahan Requirement (User Management, Roles & Permissions)

Tambahkan bagian berikut ke prompt:

15. Access Control Module Planning

Lakukan analisis menyeluruh terhadap modul:

User Management
Role Management
Permission Management
User Role Assignment

Berdasarkan endpoint backend yang tersedia.

User Management Analysis

Analisis apakah backend saat ini sudah mendukung:

List Users
Detail User
Create User
Update User
Delete User
Search User
Pagination User
User Profile Management
    