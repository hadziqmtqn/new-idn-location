-- 1. Tabel Provinsi
CREATE TABLE IF NOT EXISTS provinces (
    code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Kota/Kabupaten
CREATE TABLE IF NOT EXISTS cities (
    code VARCHAR(4) PRIMARY KEY,
    province_code VARCHAR(2) NOT NULL REFERENCES provinces(code) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Kecamatan
CREATE TABLE IF NOT EXISTS districts (
    code VARCHAR(7) PRIMARY KEY,
    city_code VARCHAR(4) NOT NULL REFERENCES cities(code) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Kelurahan/Desa
CREATE TABLE IF NOT EXISTS villages (
    code VARCHAR(10) PRIMARY KEY,
    district_code VARCHAR(7) NOT NULL REFERENCES districts(code) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    meta JSONB, -- Optional: untuk menyimpan data tambahan jika ada
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat Index untuk mempercepat pencarian nama dan filtering by parent
CREATE INDEX IF NOT EXISTS idx_provinces_name ON provinces (name);
CREATE INDEX IF NOT EXISTS idx_cities_province_code ON cities (province_code);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities (name);
CREATE INDEX IF NOT EXISTS idx_districts_city_code ON districts (city_code);
CREATE INDEX IF NOT EXISTS idx_districts_name ON districts (name);
CREATE INDEX IF NOT EXISTS idx_villages_district_code ON villages (district_code);
CREATE INDEX IF NOT EXISTS idx_villages_name ON villages (name);

-- (Optional) Aktifkan Row Level Security (RLS) jika diperlukan
-- ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

-- Buat Policy agar data bisa dibaca secara publik (Anonym)
-- CREATE POLICY "Public Access" ON provinces FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON cities FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON districts FOR SELECT USING (true);
-- CREATE POLICY "Public Access" ON villages FOR SELECT USING (true);
