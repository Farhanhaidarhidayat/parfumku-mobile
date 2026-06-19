# ParfumKu

**ParfumKu** adalah aplikasi mobile penjualan parfum online berbasis **React Native** dan **Expo**. Aplikasi ini dibuat untuk memenuhi tugas Final Project mata kuliah **Pemrograman Mobile 2**.

## Identitas Project

* Judul Project: ParfumKu
* Deskripsi: Marketplace Penjualan Parfum
* Kelas: I243C
* Project ID: 3
* Framework: React Native + Expo
* API: https://shop.tandurkarya.com

## Anggota Kelompok

1. Mochamad Riki Aditya Saputra
2. Farhan Haidar Hidayat
3. Kevin Athallah Putra
4. Eliza Putri

## Fitur Aplikasi

* Registrasi akun
* Login
* Home produk
* Kategori produk
* Pencarian produk
* Detail produk
* Keranjang belanja
* Checkout
* Riwayat pembelian
* Profil pengguna
* Logout

## Teknologi yang Digunakan

* React Native
* Expo
* Expo Router
* TypeScript
* REST API
* AsyncStorage
* GitHub

## Cara Menjalankan Project

1. Install dependency:

```bash
npm install
```

2. Jalankan aplikasi:

```bash
npx expo start
```

3. Scan QR Code menggunakan aplikasi **Expo Go** di Android.

## Struktur Folder Utama

```bash
app/
├── (tabs)/
│   ├── index.tsx
│   ├── cart.tsx
│   └── profile.tsx
├── checkout.tsx
├── product/
│   └── [id].tsx
└── _layout.tsx

components/
├── ProductCard.tsx
├── CartItemCard.tsx
└── OrderCard.tsx

context/
└── ShopContext.tsx
```

## Screenshot Aplikasi

Tambahkan screenshot aplikasi di bagian ini:

### Login / Register

![Login](./screenshots/login.png)

### Home

![Home](./screenshots/home.png)

### Detail Produk

![Detail Produk](./screenshots/detail-produk.png)

### Keranjang

![Keranjang](./screenshots/cart.png)

### Checkout

![Checkout](./screenshots/checkout.png)

### Profile / Riwayat

![Profile](./screenshots/profile.png)

## Video Demo

Link video demo:

```txt
Masukkan link Google Drive video demo di sini
```

## Repository

Link repository GitHub:

```txt
Masukkan link repository GitHub public di sini
```

## Kesimpulan

ParfumKu merupakan aplikasi mobile penjualan parfum online yang dibuat menggunakan React Native dan Expo. Aplikasi ini memanfaatkan API untuk proses registrasi, login, pengambilan produk, keranjang belanja, checkout, dan riwayat pembelian.
