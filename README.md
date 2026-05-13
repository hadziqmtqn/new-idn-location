# IDN Location (Modern Stack)

A fast, serverless-ready API and Dashboard for Indonesian administrative regions (Provinces, Cities, Districts, Villages).

## 🚀 Technology Stack

- **Backend / API**: [Express.js](https://expressjs.com/) (Node.js) 
- **Frontend / Dashboard**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom Shadcn-inspired UI with [Lucide React](https://lucide.dev/) icons
- **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **Deployment**: [Vercel](https://vercel.com/) (Monorepo setup with Serverless Functions)

## 📦 Project Structure (Monorepo)

This project uses `npm workspaces` to manage both backend and frontend in a single repository.

- `/api` - The Express.js backend exposing the `/v1` endpoints.
- `/frontend` - The React Vite application for the Admin Dashboard.
- `vercel.json` - Configuration for Vercel deployment (Routes `/v1/*` to the API, and the rest to the frontend).

## ⚙️ Setup & Installation

1. **Install Dependencies** (Root)
   Run `npm install` in the root folder. This will install dependencies for both the API and Frontend automatically using workspaces.

2. **Environment Variables**
   Create a `.env` file in the `api/` folder based on `api/.env.example`.
   ```env
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
   ```

3. **Database Migration & Data Import**
   - Execute the SQL schema found in `neon_schemas.sql` in your Neon SQL Editor.
   - Run the import script to seed data from CSV:
     ```bash
     cd api
     node scripts/import-csv.js
     ```

## 💻 Running Locally

Run both the API and Frontend concurrently from the root directory:

```bash
npm run dev
```

- **Dashboard**: `http://localhost:5173`
- **API Server**: `http://localhost:3001`

## 🔗 API v1 Endpoints

- `GET /v1/provinces` - Get all provinces. (Accepts `?q=name` for search)
- `GET /v1/cities?province_code={code}` - Get cities by province code.
- `GET /v1/districts?city_code={code}` - Get districts by city code.
- `GET /v1/villages?district_code={code}` - Get villages by district code.
- `GET /v1/stats` - Get summary statistics of all regions.
