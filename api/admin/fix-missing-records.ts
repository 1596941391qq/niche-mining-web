import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureUserHasCreditsAndSubscription } from '../lib/db.js';

/**
 * 数据修复脚本：为现有用户补充缺失的 credits 和 subscriptions 记录
 * GET /api/admin/fix-missing-records
 *
 * ⚠️ 管理员端点：仅限开发环境或通过密钥认证
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 🔐 安全检查：需要管理员密钥或在开发环境
    const isDev = process.env.NODE_ENV !== 'production';
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;

    if (!isDev && adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Admin key required for this operation'
      });
    }

    console.log('🔧 Starting data repair process...');

    // 1. 查找所有用户
    const allUsers = await sql`
      SELECT id, email, name, created_at FROM users
      ORDER BY created_at DESC
    `;

    const totalUsers = allUsers.rows.length;
    console.log(`📊 Found ${totalUsers} total users`);

    // 2. 查找缺少 subscriptions 的用户
    const usersWithoutSubscriptions = await sql`
      SELECT u.id, u.email, u.name
      FROM users u
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
      WHERE us.id IS NULL
      ORDER BY u.created_at DESC
    `;

    // 3. 查找缺少 credits 的用户
    const usersWithoutCredits = await sql`
      SELECT u.id, u.email, u.name
      FROM users u
      LEFT JOIN user_credits uc ON u.id = uc.user_id
      WHERE uc.id IS NULL
      ORDER BY u.created_at DESC
    `;

    console.log(`❌ Users missing subscriptions: ${usersWithoutSubscriptions.rows.length}`);
    console.log(`❌ Users missing credits: ${usersWithoutCredits.rows.length}`);

    // 4. 获取所有需要修复的用户（去重）
    const usersToFix = new Map<string, { id: string; email: string; name: string | null }>();

    usersWithoutSubscriptions.rows.forEach(user => {
      usersToFix.set(user.id, user);
    });

    usersWithoutCredits.rows.forEach(user => {
      usersToFix.set(user.id, user);
    });

    const fixCount = usersToFix.size;
    console.log(`🔧 Total users to fix: ${fixCount}`);

    // 5. 为每个用户补充缺失的记录
    const fixResults = [];
    let successCount = 0;
    let errorCount = 0;

    for (const [userId, user] of usersToFix) {
      try {
        const result = await ensureUserHasCreditsAndSubscription(userId);

        fixResults.push({
          userId,
          email: user.email,
          name: user.name,
          subscriptionCreated: result.subscriptionCreated,
          creditsCreated: result.creditsCreated,
          success: true,
        });

        if (result.subscriptionCreated || result.creditsCreated) {
          successCount++;
          console.log(`✅ Fixed user: ${user.email} (Subscription: ${result.subscriptionCreated}, Credits: ${result.creditsCreated})`);
        }
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        fixResults.push({
          userId,
          email: user.email,
          name: user.name,
          subscriptionCreated: false,
          creditsCreated: false,
          success: false,
          error: errorMessage,
        });
        console.error(`❌ Failed to fix user ${user.email}:`, errorMessage);
      }
    }

    // 6. 再次检查修复后的状态
    const usersStillMissingSubscriptions = await sql`
      SELECT u.id, u.email
      FROM users u
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
      WHERE us.id IS NULL
    `;

    const usersStillMissingCredits = await sql`
      SELECT u.id, u.email
      FROM users u
      LEFT JOIN user_credits uc ON u.id = uc.user_id
      WHERE uc.id IS NULL
    `;

    // 7. 返回详细报告
    return res.status(200).json({
      success: true,
      message: 'Data repair completed',
      summary: {
        totalUsers,
        usersNeedingFix: fixCount,
        successfullyFixed: successCount,
        errors: errorCount,
      },
      before: {
        missingSubscriptions: usersWithoutSubscriptions.rows.length,
        missingCredits: usersWithoutCredits.rows.length,
      },
      after: {
        missingSubscriptions: usersStillMissingSubscriptions.rows.length,
        missingCredits: usersStillMissingCredits.rows.length,
      },
      details: fixResults,
      stillMissing: {
        subscriptions: usersStillMissingSubscriptions.rows.map(u => u.email),
        credits: usersStillMissingCredits.rows.map(u => u.email),
      },
    });
  } catch (error) {
    console.error('Data repair error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to repair data',
      details: errorMessage,
    });
  }
}
