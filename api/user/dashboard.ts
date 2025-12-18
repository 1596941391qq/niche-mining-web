import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';

/**
 * Dashboard API - 返回仪表板所需的所有数据
 * GET /api/user/dashboard
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 验证 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = payload.userId;

    // 获取当前时间范围
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // **性能优化：并发执行所有查询**
    const [
      creditsResult,
      subscriptionResult,
      recentActivityResult,
      modeStatsResult,
      sevenDayStatsResult
    ] = await Promise.all([
      // 1. 获取 Credits 信息
      sql`
        SELECT
          total_credits,
          used_credits,
          bonus_credits,
          last_reset_at,
          next_reset_at
        FROM user_credits
        WHERE user_id = ${userId}
      `,

      // 2. 获取订阅信息
      sql`
        SELECT
          us.plan_id,
          us.status,
          us.current_period_start,
          us.current_period_end,
          sp.name_en,
          sp.name_cn,
          sp.credits_monthly
        FROM user_subscriptions us
        LEFT JOIN subscription_plans sp ON us.plan_id = sp.plan_id
        WHERE us.user_id = ${userId}
        ORDER BY us.created_at DESC
        LIMIT 1
      `,

      // 3. 获取最近活动（最近10条）
      sql`
        SELECT
          type,
          credits_delta,
          description,
          created_at,
          related_entity,
          metadata
        FROM credits_transactions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 10
      `,

      // 4. 获取模式使用统计
      sql`
        SELECT
          mode_id,
          COUNT(*) as usage_count,
          SUM(ABS(credits_delta)) as total_credits
        FROM credits_transactions
        WHERE user_id = ${userId}
          AND type = 'usage'
          AND mode_id IS NOT NULL
        GROUP BY mode_id
      `,

      // 5. 获取最近7天的详细统计
      sql`
        SELECT
          DATE(created_at) as date,
          mode_id,
          SUM(ABS(credits_delta)) as credits_used
        FROM credits_transactions
        WHERE user_id = ${userId}
          AND type = 'usage'
          AND created_at >= ${sevenDaysAgo}
          AND mode_id IS NOT NULL
        GROUP BY DATE(created_at), mode_id
        ORDER BY date ASC
      `
    ]);

    const credits = creditsResult.rows[0] || {
      total_credits: 0,
      used_credits: 0,
      bonus_credits: 0,
      last_reset_at: null,
      next_reset_at: null
    };

    const subscription = subscriptionResult.rows[0] || null;

    const recentActivity = recentActivityResult.rows.map(row => ({
      action: row.description || getActionDescription(row.type, row.related_entity),
      timestamp: row.created_at,
      credits: row.credits_delta,
      status: row.credits_delta < 0 ? 'success' : 'info',
      type: row.type
    }));

    // 处理模式统计
    const modeStats: Record<string, any> = {};
    modeStatsResult.rows.forEach(row => {
      modeStats[row.mode_id] = {
        usageCount: parseInt(row.usage_count),
        totalCredits: parseInt(row.total_credits)
      };
    });

    // 组织7天数据
    const sevenDayData: Record<string, any> = {};
    sevenDayStatsResult.rows.forEach(row => {
      const dateKey = row.date;
      if (!sevenDayData[dateKey]) {
        sevenDayData[dateKey] = {
          date: dateKey,
          total: 0,
          keyword_mining: 0,
          batch_translation: 0,
          deep_mining: 0
        };
      }
      const credits = parseInt(row.credits_used);
      sevenDayData[dateKey][row.mode_id] = credits;
      sevenDayData[dateKey].total += credits;
    });

    // 填充缺失的日期
    const sevenDayArray = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      sevenDayArray.push(sevenDayData[dateKey] || {
        date: dateKey,
        total: 0,
        keyword_mining: 0,
        batch_translation: 0,
        deep_mining: 0
      });
    }

    return res.status(200).json({
      userId,
      credits: {
        total: credits.total_credits,
        used: credits.used_credits,
        remaining: credits.total_credits - credits.used_credits,
        bonus: credits.bonus_credits,
        lastResetAt: credits.last_reset_at,
        nextResetAt: credits.next_reset_at
      },
      subscription: subscription ? {
        plan: subscription.plan_id,
        planName: subscription.name_en,
        planNameCn: subscription.name_cn,
        status: subscription.status,
        creditsMonthly: subscription.credits_monthly,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end
      } : null,
      recentActivity,
      modeStats,
      sevenDayStats: sevenDayArray
    });

  } catch (error) {
    console.error('Dashboard API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to fetch dashboard data',
      details: errorMessage
    });
  }
}

/**
 * 根据交易类型生成描述
 */
function getActionDescription(type: string, relatedEntity?: string): string {
  switch (type) {
    case 'usage':
      return relatedEntity || 'API Usage';
    case 'purchase':
      return 'Credits Purchased';
    case 'bonus':
      return 'Bonus Credits';
    case 'refund':
      return 'Credits Refunded';
    case 'reset':
      return 'Monthly Reset';
    default:
      return 'Transaction';
  }
}
