// 测试数据库连接和查询用户
import { config } from 'dotenv';
import pg from 'pg';

config({ path: '.env.local' });

const { Client } = pg;

async function testDB() {
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    console.error('❌ POSTGRES_URL not found in .env.local');
    return;
  }

  console.log('✅ POSTGRES_URL found');
  console.log('🔗 Connecting to database...');

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // 检查 users 表是否存在
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('✅ users table exists');

      // 查询用户数量
      const countResult = await client.query('SELECT COUNT(*) FROM users');
      console.log(`📊 Total users: ${countResult.rows[0].count}`);

      // 查询最近的用户
      const usersResult = await client.query(`
        SELECT id, email, name, created_at, last_login_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);

      if (usersResult.rows.length > 0) {
        console.log('\n📝 Recent users:');
        usersResult.rows.forEach((user, i) => {
          console.log(`  ${i + 1}. ${user.email} (${user.name || 'No name'})`);
          console.log(`     Created: ${user.created_at}`);
          console.log(`     Last login: ${user.last_login_at || 'Never'}`);
        });
      } else {
        console.log('⚠️  No users found in database');
      }
    } else {
      console.log('❌ users table does not exist!');
      console.log('   Table needs to be created on first login.');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected from database');
  }
}

testDB();
