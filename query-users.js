// 查询用户详细信息
import { config } from 'dotenv';
import pg from 'pg';

config({ path: '.env.local' });

const { Client } = pg;

async function queryUsers() {
  const connectionString = process.env.POSTGRES_URL;
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // 查询所有用户
    const result = await client.query(`
      SELECT
        id,
        email,
        name,
        picture,
        google_id,
        created_at,
        updated_at,
        last_login_at
      FROM users
      ORDER BY created_at DESC
    `);

    console.log('\n📊 所有用户：\n');
    console.table(result.rows);

  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await client.end();
  }
}

queryUsers();
