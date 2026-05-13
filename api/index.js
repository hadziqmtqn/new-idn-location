const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Use Pool for Neon/PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon
  }
});

app.use(cors()); // Allow access from other applications
app.use(morgan('dev'));
app.use(express.json());

// API v1 Routes
const v1 = express.Router();

// 1. Stats Endpoint
v1.get('/stats', async (req, res) => {
  try {
    const provinceCount = await pool.query('SELECT COUNT(*) FROM provinces');
    const cityCount = await pool.query('SELECT COUNT(*) FROM cities');
    const districtCount = await pool.query('SELECT COUNT(*) FROM districts');
    const villageCount = await pool.query('SELECT COUNT(*) FROM villages');

    res.json({
      provinces: parseInt(provinceCount.rows[0].count),
      cities: parseInt(cityCount.rows[0].count),
      districts: parseInt(districtCount.rows[0].count),
      villages: parseInt(villageCount.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Province Endpoint (Matches Laravel structure)
v1.get('/provinces', async (req, res) => {
  try {
    const { q } = req.query;
    let query = 'SELECT code, name FROM provinces';
    const params = [];

    if (q) {
      query += ' WHERE name ILIKE $1';
      params.push(`%${q}%`);
    }

    query += ' ORDER BY name ASC';
    const result = await pool.query(query, params);
    
    // Explicit mapping to match Laravel collect()
    const response = result.rows.map(row => ({
      code: row.code,
      name: row.name
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. City Endpoint (Matches Laravel with('provinceCode'))
v1.get('/cities', async (req, res) => {
  try {
    const { province_code, q } = req.query;
    let query = `
      SELECT c.code, c.name, c.province_code, p.name as province_name 
      FROM cities c
      JOIN provinces p ON c.province_code = p.code
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (province_code) {
      query += ` AND c.province_code = $${paramCount++}`;
      params.push(province_code);
    }
    if (q) {
      query += ` AND c.name ILIKE $${paramCount++}`;
      params.push(`%${q}%`);
    }

    query += ' ORDER BY c.name ASC';
    const result = await pool.query(query, params);
    
    const response = result.rows.map(row => ({
      code: row.code,
      name: row.name,
      province_code: row.province_code,
      province: {
        code: row.province_code,
        name: row.province_name
      }
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. District Endpoint
v1.get('/districts', async (req, res) => {
  try {
    const { city_code, q } = req.query;
    let query = 'SELECT code, name, city_code FROM districts WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (city_code) {
      query += ` AND city_code = $${paramCount++}`;
      params.push(city_code);
    }
    if (q) {
      query += ` AND name ILIKE $${paramCount++}`;
      params.push(`%${q}%`);
    }

    query += ' ORDER BY name ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Village Endpoint
v1.get('/villages', async (req, res) => {
  try {
    const { district_code, district_name, q, limit = 100 } = req.query;
    let query = `
      SELECT v.code, v.name, v.district_code, d.name as district_name 
      FROM villages v
      JOIN districts d ON v.district_code = d.code
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (district_code) {
      query += ` AND v.district_code = $${paramCount++}`;
      params.push(district_code);
    }
    if (district_name) {
      query += ` AND d.name ILIKE $${paramCount++}`;
      params.push(`%${district_name}%`);
    }
    if (q) {
      query += ` AND v.name ILIKE $${paramCount++}`;
      params.push(`%${q}%`);
    }

    query += ` ORDER BY v.name ASC LIMIT $${paramCount}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use('/api/v1', v1);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'IDN Location API is running' });
});

module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
