import pg from 'pg';

const connectionString = 'postgresql://postgres:%23Twilightworld99@db.ranmwhlxwtdrwuwsrjgd.supabase.co:5432/postgres';

const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connection successful!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();
