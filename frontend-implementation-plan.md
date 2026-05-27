# Frontend Implementation Plan
## React + Vite — Authentication & Admin Panel

> **Stack:** React (Vite), React Router DOM, Axios, Tailwind CSS, React Hook Form, Zod, React Hot Toast, Lucide React  
> **Backend:** Laravel 13 REST API (sudah selesai)  
> **Tanggal:** 2026-05-24

---

## Daftar Isi

1. [Analisis Kebutuhan](#1-analisis-kebutuhan)
2. [Struktur Folder](#2-struktur-folder)
3. [Perancangan Routing](#3-perancangan-routing)
4. [Perancangan Layout](#4-perancangan-layout)
5. [Perancangan Pages](#5-perancangan-pages)
6. [Perancangan Components](#6-perancangan-components)
7. [Perancangan Service Layer](#7-perancangan-service-layer)
8. [Authentication Flow](#8-authentication-flow)
9. [Authorization Flow](#9-authorization-flow)
10. [Dashboard Planning](#10-dashboard-planning)
11. [Form Validation Planning](#11-form-validation-planning)
12. [API Error Handling Strategy](#12-api-error-handling-strategy)
13. [UI/UX Planning](#13-uiux-planning)
14. [Development Roadmap](#14-development-roadmap)
15. [Access Control Module Planning](#15-access-control-module-planning)

---

## 1. Analisis Kebutuhan

### Fitur yang Harus Dibuat

**Authentication:**
- Register user baru (dengan pilihan role)
- Login dengan email & password
- Lihat profile user yang sedang login
- Logout (token aktif saja)
- Logout semua perangkat

**Role Management (Admin only):**
- List semua role beserta permissions-nya
- Buat role baru + assign permissions sekaligus
- Edit role (nama + sync permissions)
- Hapus role (kecuali `admin` dan `user` — backend sudah proteksi)

**Permission Management (Admin only):**
- List semua permission
- Buat permission baru
- Hapus permission

**User Role Assignment (Admin only):**
- Assign role ke user berdasarkan `userId`
- Revoke role dari user berdasarkan `userId`

### Identifikasi Halaman

| Halaman | Route | Akses |
|---------|-------|-------|
| Login | `/login` | Guest |
| Register | `/register` | Guest |
| Dashboard | `/admin/dashboard` | Admin |
| Profile | `/admin/profile` | Admin |
| Roles | `/admin/roles` | Admin |
| Permissions | `/admin/permissions` | Admin |
| User Roles | `/admin/user-roles` | Admin |

### Gap Analysis — User Management

> **Catatan penting:** Backend saat ini **tidak menyediakan** endpoint User Management
> (list users, detail, create, update, delete, search, pagination).
> Endpoint yang ada hanya `assign-role` dan `revoke-role` yang membutuhkan `userId`.

**Implikasi untuk frontend:**
- Halaman User Roles tidak bisa menampilkan daftar user
- Solusi sementara: input manual `userId` di form assign/revoke
- Rekomendasi: minta backend tambahkan `GET /api/admin/users` minimal untuk list user dengan id & nama

---

## 2. Struktur Folder

```
src/
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx          # Form login dengan validasi Zod
│   │   └── RegisterForm.jsx       # Form register dengan validasi Zod
│   │
│   ├── admin/
│   │   ├── roles/
│   │   │   ├── RoleTable.jsx          # Tabel list roles + tombol aksi
│   │   │   ├── RoleForm.jsx           # Form create/edit role + checkbox permissions
│   │   │   └── RoleDeleteModal.jsx    # Konfirmasi hapus role
│   │   ├── permissions/
│   │   │   ├── PermissionTable.jsx
│   │   │   ├── PermissionForm.jsx
│   │   │   └── PermissionDeleteModal.jsx
│   │   ├── user-roles/
│   │   │   ├── AssignRoleForm.jsx     # Form assign role ke userId
│   │   │   └── RevokeRoleForm.jsx     # Form revoke role dari userId
│   │   └── dashboard/
│   │       ├── StatsCard.jsx          # Card statistik (jumlah role, permission)
│   │       └── ProfileCard.jsx        # Card info user yang login
│   │
│   └── common/
│       ├── Navbar.jsx             # Top navbar admin
│       ├── Sidebar.jsx            # Sidebar navigasi admin
│       ├── Button.jsx             # Reusable button dengan variant
│       ├── Modal.jsx              # Reusable modal wrapper
│       ├── Table.jsx              # Reusable table wrapper
│       ├── Badge.jsx              # Badge untuk role/permission label
│       ├── LoadingSpinner.jsx     # Spinner loading state
│       └── EmptyState.jsx         # Tampilan saat data kosong
│
├── layouts/
│   ├── auth/
│   │   └── AuthLayout.jsx         # Layout untuk halaman login/register
│   └── admin/
│       └── AdminLayout.jsx        # Layout dengan sidebar + navbar
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   └── admin/
│       ├── dashboard/
│       │   └── DashboardPage.jsx
│       ├── profile/
│       │   └── ProfilePage.jsx
│       ├── roles/
│       │   └── RolesPage.jsx
│       ├── permissions/
│       │   └── PermissionsPage.jsx
│       └── user-roles/
│           └── UserRolesPage.jsx
│
├── services/
│   ├── api.js                     # Axios instance + interceptor
│   ├── authService.js             # Semua call endpoint /auth
│   ├── roleService.js             # Semua call endpoint /admin/roles
│   ├── permissionService.js       # Semua call endpoint /admin/permissions
│   └── userRoleService.js         # Semua call endpoint /admin/users/{id}/...
│
├── routes/
│   └── AppRoutes.jsx              # Definisi semua route + guard logic
│
├── App.jsx                        # Root component, render AppRoutes
└── main.jsx                       # Entry point, render App ke DOM
```

### Penjelasan Per Folder

| Folder/File | Tujuan | Tanggung Jawab |
|-------------|--------|----------------|
| `components/auth/` | Komponen khusus halaman auth | Form login & register dengan validasi |
| `components/admin/` | Komponen khusus fitur admin | Tabel, form, modal per modul |
| `components/common/` | Komponen reusable global | UI primitif yang dipakai di mana saja |
| `layouts/` | Wrapper struktur halaman | Menentukan shell visual (sidebar, navbar) |
| `pages/` | Halaman utama aplikasi | Orkestrasi state + komponen per halaman |
| `services/` | Lapisan komunikasi API | Semua Axios call, dipisah per domain |
| `routes/` | Konfigurasi routing | Guard logic, redirect, route definition |

---

## 3. Perancangan Routing

### Mapping Route

| Path | Komponen | Tipe | Keterangan |
|------|----------|------|------------|
| `/` | — | Redirect | → `/login` atau `/admin/dashboard` |
| `/login` | `LoginPage` | Guest | Redirect ke dashboard jika sudah login |
| `/register` | `RegisterPage` | Guest | Redirect ke dashboard jika sudah login |
| `/admin/dashboard` | `DashboardPage` | Protected | Halaman utama admin |
| `/admin/profile` | `ProfilePage` | Protected | Profil user login |
| `/admin/roles` | `RolesPage` | Protected | Manajemen role |
| `/admin/permissions` | `PermissionsPage` | Protected | Manajemen permission |
| `/admin/user-roles` | `UserRolesPage` | Protected | Assign/revoke role |
| `*` | — | Redirect | → `/login` |

### Guard Logic

**`GuestRoute`** — membungkus `/login` dan `/register`:
- Cek `localStorage.getItem('token')`
- Jika token **ada** → redirect ke `/admin/dashboard`
- Jika token **tidak ada** → render halaman

**`ProtectedRoute`** — membungkus semua `/admin/*`:
- Cek `localStorage.getItem('token')`
- Jika token **tidak ada** → redirect ke `/login`
- Jika token **ada** → render halaman

### Redirect Logic

```
Login sukses          → navigate('/admin/dashboard')
Register sukses       → navigate('/admin/dashboard')
Logout                → hapus localStorage → navigate('/login')
Token expired (401)   → hapus localStorage → navigate('/login')  [via interceptor]
Akses /login saat sudah login → navigate('/admin/dashboard')
Route tidak ditemukan → navigate('/login')
```

### Unauthorized Flow (403)

- Tampilkan toast error `"Akses ditolak"`
- Tidak redirect, tetap di halaman
- Sembunyikan tombol aksi yang tidak diizinkan

---

## 4. Perancangan Layout

### AuthLayout

```
┌─────────────────────────────────┐
│                                 │
│         [Logo / Brand]          │
│                                 │
│   ┌─────────────────────────┐   │
│   │                         │   │
│   │      Form Content       │   │
│   │                         │   │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

- Background: gradient atau solid color
- Card form di tengah layar (centered, max-w-md)
- Tidak ada sidebar/navbar

### AdminLayout

```
┌──────────────────────────────────────────────────┐
│  [Logo]   Nama Aplikasi    [User Info] [Logout]  │  ← Navbar (fixed top, h-16)
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  Sidebar   │         Content Area                │
│  (w-64)    │         (flex-1, overflow-y-auto)   │
│            │                                     │
│ ▸ Dashboard│                                     │
│ ▸ Profile  │                                     │
│ ▸ Roles    │                                     │
│ ▸ Perms    │                                     │
│ ▸ Users    │                                     │
│            │                                     │
└────────────┴─────────────────────────────────────┘
```

### Struktur Navbar

| Posisi | Konten |
|--------|--------|
| Kiri | Hamburger toggle + nama aplikasi |
| Kanan | Nama user + badge role + tombol Logout |

### Struktur Sidebar

| Item | Icon (Lucide) | Route |
|------|---------------|-------|
| Dashboard | `LayoutDashboard` | `/admin/dashboard` |
| Profile | `User` | `/admin/profile` |
| Roles | `Shield` | `/admin/roles` |
| Permissions | `Key` | `/admin/permissions` |
| User Roles | `Users` | `/admin/user-roles` |

- Active state: highlight background + teks bold
- Collapsible di mobile (toggle via hamburger)

### Content Area

- Padding: `p-6`
- Breadcrumb di atas konten
- Scrollable secara independen dari sidebar

---

## 5. Perancangan Pages

### LoginPage

| Aspek | Detail |
|-------|--------|
| Tujuan | Autentikasi user |
| Endpoint | `POST /api/auth/login` |
| State | `loading`, `error` |
| Komponen | `LoginForm`, `AuthLayout` |
| Validasi | Email valid, password min 8 karakter |
| Flow | Submit → simpan token & user ke localStorage → redirect dashboard |

### RegisterPage

| Aspek | Detail |
|-------|--------|
| Tujuan | Daftar akun baru |
| Endpoint | `POST /api/auth/register` |
| State | `loading`, `error` |
| Komponen | `RegisterForm`, `AuthLayout` |
| Validasi | Name required, email valid & unik, password min 8 + confirmed, role optional |
| Flow | Submit → simpan token & user ke localStorage → redirect dashboard |

### DashboardPage

| Aspek | Detail |
|-------|--------|
| Tujuan | Overview sistem |
| Endpoint | `GET /api/auth/profile`, `GET /api/admin/roles`, `GET /api/admin/permissions` |
| State | `profile`, `roles`, `permissions`, `loading` |
| Komponen | `StatsCard`, `ProfileCard`, `AdminLayout` |
| Widget | Total Roles, Total Permissions, Info User, My Roles, My Permissions, Recent Roles |

### ProfilePage

| Aspek | Detail |
|-------|--------|
| Tujuan | Lihat detail profil user yang sedang login |
| Endpoint | `GET /api/auth/profile` |
| State | `profile`, `loading` |
| Komponen | `AdminLayout` |
| Tampilan | Nama, email, roles, permissions, tanggal daftar |

### RolesPage

| Aspek | Detail |
|-------|--------|
| Tujuan | CRUD role |
| Endpoint | `GET`, `POST`, `PUT`, `DELETE /api/admin/roles` |
| State | `roles`, `permissions`, `loading`, `modalOpen`, `editTarget` |
| Komponen | `RoleTable`, `RoleForm`, `RoleDeleteModal`, `Modal` |
| Fitur | List roles + permissions, tambah, edit + sync permissions, hapus dengan konfirmasi |

### PermissionsPage

| Aspek | Detail |
|-------|--------|
| Tujuan | CRUD permission |
| Endpoint | `GET`, `POST`, `DELETE /api/admin/permissions` |
| State | `permissions`, `loading`, `modalOpen` |
| Komponen | `PermissionTable`, `PermissionForm`, `PermissionDeleteModal` |
| Fitur | List permissions, tambah, hapus dengan konfirmasi |

### UserRolesPage

| Aspek | Detail |
|-------|--------|
| Tujuan | Assign/revoke role ke user |
| Endpoint | `POST /api/admin/users/{userId}/assign-role`, `POST /api/admin/users/{userId}/revoke-role` |
| State | `roles`, `loading` |
| Komponen | `AssignRoleForm`, `RevokeRoleForm` |
| Catatan | Input userId manual karena backend belum ada endpoint list users |

---

## 6. Perancangan Components

### Auth Components

| Komponen | Fungsi | Tanggung Jawab |
|----------|--------|----------------|
| `LoginForm` | Form email + password | Submit ke `authService.login`, tampilkan error validasi per field |
| `RegisterForm` | Form name/email/password/role | Submit ke `authService.register`, konfirmasi password |

### Admin Components

| Komponen | Fungsi | Tanggung Jawab |
|----------|--------|----------------|
| `RoleTable` | Tabel list roles | Render data roles + permissions, tombol Edit & Delete per baris |
| `RoleForm` | Form create/edit role | Input nama role, checkbox list permissions dari API |
| `RoleDeleteModal` | Konfirmasi hapus role | Tampilkan nama role yang akan dihapus, tombol konfirmasi merah |
| `PermissionTable` | Tabel list permissions | Render data permissions, tombol Delete per baris |
| `PermissionForm` | Form tambah permission | Input nama permission baru |
| `PermissionDeleteModal` | Konfirmasi hapus permission | Tampilkan nama permission yang akan dihapus |
| `AssignRoleForm` | Form assign role | Input userId + dropdown role, submit assign |
| `RevokeRoleForm` | Form revoke role | Input userId + dropdown role, submit revoke |
| `StatsCard` | Card statistik | Angka + icon + label (Total Roles, Total Permissions) |
| `ProfileCard` | Card info user | Nama, email, roles, permissions user yang login |

### Common Components

| Komponen | Fungsi | Tanggung Jawab |
|----------|--------|----------------|
| `Navbar` | Top bar | Info user, badge role, tombol logout |
| `Sidebar` | Navigasi menu | Menu items dengan icon, active state highlight |
| `Button` | Tombol reusable | Variant: primary/danger/ghost, loading state, disabled state |
| `Modal` | Wrapper modal | Open/close, backdrop click, slot untuk konten |
| `Table` | Wrapper tabel | Header, body, empty state terintegrasi |
| `Badge` | Label kecil | Warna berbeda per role/permission, rounded pill |
| `LoadingSpinner` | Animasi loading | Spinner saat fetch data, bisa inline atau fullscreen |
| `EmptyState` | Tampilan data kosong | Icon + pesan + optional CTA button |

---

## 7. Perancangan Service Layer

### `api.js` — Axios Instance

```
Konfigurasi:
- baseURL  : import.meta.env.VITE_API_URL
- headers  : { Accept: 'application/json', Content-Type: 'application/json' }

Request Interceptor:
- Baca token dari localStorage('token')
- Inject header: Authorization: Bearer {token}

Response Interceptor:
- Status 401 → localStorage.clear() → window.location = '/login'
- Status lain → teruskan response atau lempar error
```

### `authService.js`

| Method | HTTP | Endpoint | Parameter |
|--------|------|----------|-----------|
| `login(email, password)` | POST | `/api/auth/login` | `{ email, password }` |
| `register(name, email, password, password_confirmation, role?)` | POST | `/api/auth/register` | form data |
| `getProfile()` | GET | `/api/auth/profile` | — |
| `logout()` | POST | `/api/auth/logout` | — |
| `logoutAll()` | POST | `/api/auth/logout-all` | — |

### `roleService.js`

| Method | HTTP | Endpoint | Parameter |
|--------|------|----------|-----------|
| `getRoles()` | GET | `/api/admin/roles` | — |
| `createRole(name, permissions?)` | POST | `/api/admin/roles` | `{ name, permissions[] }` |
| `updateRole(id, name?, permissions?)` | PUT | `/api/admin/roles/{id}` | `{ name, permissions[] }` |
| `deleteRole(id)` | DELETE | `/api/admin/roles/{id}` | — |

### `permissionService.js`

| Method | HTTP | Endpoint | Parameter |
|--------|------|----------|-----------|
| `getPermissions()` | GET | `/api/admin/permissions` | — |
| `createPermission(name)` | POST | `/api/admin/permissions` | `{ name }` |
| `deletePermission(id)` | DELETE | `/api/admin/permissions/{id}` | — |

### `userRoleService.js`

| Method | HTTP | Endpoint | Parameter |
|--------|------|----------|-----------|
| `assignRole(userId, role)` | POST | `/api/admin/users/{userId}/assign-role` | `{ role }` |
| `revokeRole(userId, role)` | POST | `/api/admin/users/{userId}/revoke-role` | `{ role }` |

---

## 8. Authentication Flow

### Login Flow

```
1. User isi form email + password
2. React Hook Form + Zod validasi client-side
3. Submit → authService.login(email, password)
4. Loading state aktif, tombol disabled
5. [Sukses]
   - localStorage.setItem('token', response.data.access_token)
   - localStorage.setItem('user', JSON.stringify(response.data.user))
   - toast.success('Login berhasil')
   - navigate('/admin/dashboard')
6. [Gagal]
   - toast.error(pesan dari API)
   - Loading state nonaktif
```

### Register Flow

```
1. User isi form name/email/password/password_confirmation/role
2. Zod validasi + cek password === password_confirmation
3. Submit → authService.register(...)
4. [Sukses]
   - Simpan token & user ke localStorage
   - toast.success('Registrasi berhasil')
   - navigate('/admin/dashboard')
5. [Gagal 422 - email sudah ada, dll]
   - Tampilkan error per field dari response.errors
   - Set error ke React Hook Form via setError()
```

### Profile Flow

```
1. Halaman mount → useEffect
2. authService.getProfile()
3. Loading spinner tampil
4. [Sukses] → setState(profile) → render data
5. [Gagal 401] → interceptor otomatis redirect /login
```

### Logout Flow

```
1. User klik tombol Logout di Navbar
2. authService.logout() → POST /api/auth/logout
3. localStorage.removeItem('token')
4. localStorage.removeItem('user')
5. toast.success('Logout berhasil')
6. navigate('/login')
```

### Logout All Devices Flow

```
1. User klik "Logout Semua Perangkat"
2. Tampilkan Modal konfirmasi
3. [Konfirmasi] → authService.logoutAll()
4. Hapus semua localStorage
5. toast.success('Logout dari semua perangkat berhasil')
6. navigate('/login')
```

---

## 9. Authorization Flow

### Menyimpan Token & User

```javascript
// Setelah login/register sukses
localStorage.setItem('token', response.data.access_token)
localStorage.setItem('user', JSON.stringify(response.data.user))
```

### Membaca Role & Permission User

```javascript
const user = JSON.parse(localStorage.getItem('user'))
const roles       = user?.roles       // contoh: ["admin"]
const permissions = user?.permissions // contoh: ["manage-products"]
```

### Melindungi Halaman Admin — ProtectedRoute

```jsx
// routes/AppRoutes.jsx
function ProtectedRoute() {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}
```

### Mencegah Akses Guest ke Halaman Auth — GuestRoute

```jsx
function GuestRoute() {
  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/admin/dashboard" replace />
  return <Outlet />
}
```

### Axios Interceptor — Token Expired

```javascript
// services/api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 10. Dashboard Planning

Karena tidak ada endpoint khusus dashboard, data diambil dari 3 endpoint yang tersedia:

| Widget | Data Source | Tampilan |
|--------|-------------|----------|
| Welcome Card | `localStorage('user')` | "Selamat datang, {nama}" + badge role |
| Stats: Total Roles | `GET /api/admin/roles` | Angka besar + icon `Shield` |
| Stats: Total Permissions | `GET /api/admin/permissions` | Angka besar + icon `Key` |
| My Roles | `localStorage('user').roles` | List badge role user yang login |
| My Permissions | `localStorage('user').permissions` | List badge permission user yang login |
| Recent Roles | `GET /api/admin/roles` | Tabel 5 role terbaru dengan permissions-nya |

### Layout Dashboard

```
┌──────────────────────────────────────────────────┐
│  Welcome Card — "Selamat datang, {nama}"         │
├──────────────┬───────────────────────────────────┤
│ Total Roles  │  Total Permissions                │
│    [12]      │       [24]                        │
├──────────────┴───────────────────────────────────┤
│  My Roles          │  My Permissions             │
│  [admin] [manager] │  [manage-products] [...]    │
├────────────────────────────────────────────────  ┤
│  Recent Roles (tabel 5 baris)                    │
└──────────────────────────────────────────────────┘
```

---

## 11. Form Validation Planning

### Login

```javascript
z.object({
  email:    z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
})
```

### Register

```javascript
z.object({
  name:                  z.string().min(1, "Nama wajib diisi").max(255),
  email:                 z.string().email("Email tidak valid").max(255),
  password:              z.string().min(8, "Password minimal 8 karakter"),
  password_confirmation: z.string(),
  role:                  z.enum(["admin", "manager", "user"]).optional(),
}).refine(
  (data) => data.password === data.password_confirmation,
  { message: "Konfirmasi password tidak cocok", path: ["password_confirmation"] }
)
```

### Create / Edit Role

```javascript
z.object({
  name:        z.string().min(1, "Nama role wajib diisi").max(255),
  permissions: z.array(z.string()).optional(),
})
```

### Create Permission

```javascript
z.object({
  name: z.string().min(1, "Nama permission wajib diisi").max(255),
})
```

### Assign / Revoke Role

```javascript
z.object({
  userId: z.string().min(1, "User ID wajib diisi"),
  role:   z.string().min(1, "Role wajib dipilih"),
})
```

---

## 12. API Error Handling Strategy

| Status | Handling | Implementasi |
|--------|----------|--------------|
| `400` | Toast error umum | `toast.error("Request tidak valid")` |
| `401` | Redirect ke login | Axios interceptor → `localStorage.clear()` → `/login` |
| `403` | Toast akses ditolak | `toast.error("Akses ditolak. Anda tidak memiliki izin.")` |
| `404` | Toast data tidak ditemukan | `toast.error("Data tidak ditemukan")` |
| `422` | Error per field | `setError()` React Hook Form dari `response.data.errors` |
| `500` | Toast server error | `toast.error("Terjadi kesalahan server. Coba lagi nanti.")` |
| Network Error | Toast koneksi | `toast.error("Tidak dapat terhubung ke server")` |

### Strategi Implementasi

```javascript
// Contoh pattern di service
try {
  const response = await api.post('/auth/login', data)
  return response.data
} catch (error) {
  const status  = error.response?.status
  const message = error.response?.data?.message

  if (status === 422) {
    // Lempar errors ke form handler
    throw error.response.data
  }

  // Error lain ditangani interceptor atau toast
  throw new Error(message || 'Terjadi kesalahan')
}
```

---

## 13. UI/UX Planning

### User Journey

```
Guest
  └─→ /login → isi form → [sukses] → /admin/dashboard
                                          │
                                          ├─→ Sidebar: Roles → CRUD roles
                                          ├─→ Sidebar: Permissions → CRUD permissions
                                          ├─→ Sidebar: User Roles → Assign/Revoke
                                          ├─→ Sidebar: Profile → Lihat profil
                                          └─→ Navbar: Logout → /login
```

### Loading States

| Kondisi | Tampilan |
|---------|----------|
| Fetch data halaman | `LoadingSpinner` di tengah content area |
| Submit form | Tombol disabled + spinner di dalam tombol |
| Delete action | Tombol konfirmasi disabled saat proses |

### Empty States

| Halaman | Pesan |
|---------|-------|
| Roles kosong | "Belum ada role. Klik 'Tambah Role' untuk memulai." |
| Permissions kosong | "Belum ada permission. Klik 'Tambah Permission' untuk memulai." |
| Permissions di RoleForm | "Belum ada permission tersedia." |

### Confirmation Dialog

- Hapus role → Modal: "Apakah Anda yakin ingin menghapus role **{nama}**?"
- Hapus permission → Modal: "Apakah Anda yakin ingin menghapus permission **{nama}**?"
- Logout all → Modal: "Ini akan logout dari semua perangkat. Lanjutkan?"
- Tombol konfirmasi: merah (danger variant)
- Tombol batal: ghost variant

### Success/Error Feedback

| Event | Feedback |
|-------|----------|
| Login/Register sukses | `toast.success("Login berhasil")` |
| CRUD sukses | `toast.success("Role berhasil dibuat")` |
| Error API | `toast.error(pesan dari API)` |
| Validasi form | Pesan merah di bawah field terkait |

- Posisi toast: top-right
- Durasi: 3 detik
- Warna: hijau (sukses), merah (error)

---

## 14. Development Roadmap

### Phase 1 — Foundation
- [ ] Setup Vite + React + Tailwind CSS
- [ ] Install semua dependencies
- [ ] Buat struktur folder lengkap
- [ ] Setup `api.js` dengan Axios instance + interceptor
- [ ] Setup `.env` dengan `VITE_API_URL`
- [ ] Setup `AppRoutes.jsx` dengan `GuestRoute` & `ProtectedRoute`

### Phase 2 — Authentication
- [ ] Buat `AuthLayout`
- [ ] Buat `LoginPage` + `LoginForm` + Zod schema
- [ ] Buat `RegisterPage` + `RegisterForm` + Zod schema
- [ ] Implementasi `authService.js`
- [ ] Test login → simpan token → redirect dashboard
- [ ] Test register → simpan token → redirect dashboard

### Phase 3 — Admin Shell
- [ ] Buat `AdminLayout`
- [ ] Buat `Navbar` dengan info user + logout
- [ ] Buat `Sidebar` dengan navigasi + active state
- [ ] Buat `DashboardPage` dengan stats cards
- [ ] Buat `ProfilePage`

### Phase 4 — Common Components
- [ ] `Button` (primary, danger, ghost, loading state)
- [ ] `Modal` (reusable wrapper)
- [ ] `Table` (reusable wrapper)
- [ ] `Badge` (role/permission label)
- [ ] `LoadingSpinner`
- [ ] `EmptyState`

### Phase 5 — Role Management
- [ ] Implementasi `roleService.js`
- [ ] Buat `RoleTable`
- [ ] Buat `RoleForm` dengan checkbox permissions
- [ ] Buat `RoleDeleteModal`
- [ ] Rakit `RolesPage`
- [ ] Test CRUD roles end-to-end

### Phase 6 — Permission Management
- [ ] Implementasi `permissionService.js`
- [ ] Buat `PermissionTable`
- [ ] Buat `PermissionForm`
- [ ] Buat `PermissionDeleteModal`
- [ ] Rakit `PermissionsPage`
- [ ] Test CRUD permissions end-to-end

### Phase 7 — User Role Assignment
- [ ] Implementasi `userRoleService.js`
- [ ] Buat `AssignRoleForm`
- [ ] Buat `RevokeRoleForm`
- [ ] Rakit `UserRolesPage`
- [ ] Test assign/revoke end-to-end

### Phase 8 — Polish & QA
- [ ] Loading states di semua halaman
- [ ] Empty states di semua tabel
- [ ] Error handling konsisten (toast + form errors)
- [ ] Responsive mobile (sidebar collapsible)
- [ ] Test semua flow: login, register, logout, CRUD

---

## 15. Access Control Module Planning

### User Management — Gap Analysis

| Fitur | Backend Support | Solusi Sementara |
|-------|:--------------:|------------------|
| List Users | ❌ | Input manual `userId` di form |
| Detail User | ❌ | Tampilkan dari response assign/revoke |
| Create User | ✅ via `/auth/register` | Arahkan ke halaman register |
| Update User | ❌ | Belum bisa diimplementasi |
| Delete User | ❌ | Belum bisa diimplementasi |
| Search User | ❌ | Belum bisa diimplementasi |
| Pagination User | ❌ | Belum bisa diimplementasi |
| Assign Role | ✅ | Implementasi penuh |
| Revoke Role | ✅ | Implementasi penuh |

### Rekomendasi Endpoint Backend Tambahan

Untuk User Management yang lengkap, backend perlu menambahkan:

```
GET    /api/admin/users              → list users (dengan pagination & search)
GET    /api/admin/users/{id}         → detail user
PUT    /api/admin/users/{id}         → update user (nama, email)
DELETE /api/admin/users/{id}         → hapus user
```

Tanpa endpoint ini, halaman User Roles hanya bisa menerima input `userId` secara manual,
yang tidak ideal untuk UX produksi.

### Role Management — Analisis Lengkap

| Fitur | Backend Support | Catatan |
|-------|:--------------:|---------|
| List Roles + Permissions | ✅ | Response sudah include permissions |
| Create Role + Assign Permissions | ✅ | `permissions[]` opsional di create |
| Edit Role + Sync Permissions | ✅ | `syncPermissions` mengganti semua permissions |
| Delete Role | ✅ | Backend proteksi role `admin` & `user` |

### Permission Management — Analisis Lengkap

| Fitur | Backend Support | Catatan |
|-------|:--------------:|---------|
| List Permissions | ✅ | Return array nama permission |
| Create Permission | ✅ | Nama harus unik |
| Delete Permission | ✅ | Hapus berdasarkan ID |
| Edit Permission | ❌ | Tidak tersedia, perlu tambah di backend jika diperlukan |

---

## Dependencies yang Dibutuhkan

```bash
npm install react-router-dom axios react-hook-form @hookform/resolvers zod react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Versi yang Direkomendasikan

| Package | Versi |
|---------|-------|
| react | ^19.x |
| react-router-dom | ^7.x |
| axios | ^1.x |
| react-hook-form | ^7.x |
| @hookform/resolvers | ^3.x |
| zod | ^3.x |
| react-hot-toast | ^2.x |
| lucide-react | ^0.x (latest) |
| tailwindcss | ^3.x |

---

## Environment Variables

```env
# .env
VITE_API_URL=http://localhost/Tim4/backend/public/api
```

---

*Dokumen ini adalah blueprint teknis untuk implementasi frontend. Tidak ada source code yang dibuat di dokumen ini.*
