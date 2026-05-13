const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { parse } = require('csv-parse/sync');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function importCSV(tableName, filePath) {
  console.log(`Importing ${tableName} from ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const record of records) {
      // Clean up record (convert empty string to null for JSONB)
      const meta = record.meta && record.meta.trim() !== '' ? record.meta : null;
      
      const columns = Object.keys(record);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const vals = columns.map(col => col === 'meta' ? meta : record[col]);

      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, meta = EXCLUDED.meta`;
      await client.query(query, vals);
    }
    await client.query('COMMIT');
    console.log(`Successfully imported ${records.length} records into ${tableName}`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.log(`Error importing ${tableName}:`, e.message);
  } finally {
    client.release();
  }
}

async function run() {
  try {
    // Modify these paths as needed
    const baseDir = '/Users/meowpush/Projects/idn-location/database/imports';
    
    // await importCSV('provinces', path.join(baseDir, 'indonesia_provinces.csv'));
    // Tambahkan tabel lain jika sudah ada CSV-nya:
    // await importCSV('cities', path.join(baseDir, 'indonesia_cities.csv'));
    // await importCSV('districts', path.join(baseDir, 'indonesia_districts.csv'));
    // await importCSV('villages', path.join(baseDir, 'indonesia_villages.csv'));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
