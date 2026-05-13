# IDN Location (New)

Migration of IDN Location to Express.js and React.

## Stack
- **Backend**: Express.js
- **Frontend**: React + Vite + Shadcn UI
- **Database**: Supabase
- **Deployment**: Vercel

## Setup

1. **Install Dependencies** (Root)
   Run `npm install` di folder root untuk menginstal semua dependensi (API & Frontend).

2. **Environment Variables**
   Buat file `.env` di folder `api/` berdasarkan `.env.example`.

3. **Running Locally**
   - Jalankan `npm run dev` di folder root untuk menjalankan API dan Frontend secara bersamaan.
   - Atau jalankan `npm run api:dev` / `npm run frontend:dev` secara terpisah.

## Database
- Buat tabel berikut di Supabase: `provinces`, `cities`, `districts`, `villages`.
- Impor data dari database MySQL lama.

## Deployment
- Push to GitHub and connect to Vercel.
- The `vercel.json` in the root will handle the routing and builds.
