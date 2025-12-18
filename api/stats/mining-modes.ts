import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';

/**
 * 获取挖掘模式统计数据
 * GET /api/stats/mining-modes
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 验证token
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

    // 获取时间范围
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. 获取所有模式及定价
    const modesResult = await sql`
      SELECT
        mode_id,
        name_en,
        name_cn,
        description_en,
        description_cn,
        workflow_en,
        workflow_cn,
        credits_per_use,
        ai_model,
        data_source
      FROM mining_modes
      WHERE is_active = TRUE
      ORDER BY sort_order ASC
    `;

    // 2. 获取用户各模式的使用统计（总计）
    const modeUsageResult = await sql`
      SELECT
        mode_id,
        COUNT(*) as usage_count,
        SUM(ABS(credits_delta)) as total_credits
      FROM credits_transactions
      WHERE user_id = ${userId}
        AND type = 'usage'
        AND mode_id IS NOT NULL
      GROUP BY mode_id
    `;

    // 3. 获取最近7天的每日统计
    const dailyStatsResult = await sql`
      SELECT
        DATE(created_at) as date,
        mode_id,
        COUNT(*) as usage_count,
        SUM(ABS(credits_delta)) as credits_used
      FROM credits_transactions
      WHERE user_id = ${userId}
        AND type = 'usage'
        AND created_at >= ${sevenDaysAgo}
        AND mode_id IS NOT NULL
      GROUP BY DATE(created_at), mode_id
      ORDER BY date ASC
    `;

    // 构建模式统计对象
    const modeStats: Record<string, any> = {};
    modeUsageResult.rows.forEach(row => {
      modeStats[row.mode_id] = {
        usageCount: parseInt(row.usage_count),
        totalCredits: parseInt(row.total_credits)
      };
    });

    // 构建每日统计
    const dailyStats: Record<string, any> = {};
    dailyStatsResult.rows.forEach(row => {
      const dateKey = row.date;
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          total: 0,
          modes: {}
        };
      }
      dailyStats[dateKey].modes[row.mode_id] = {
        count: parseInt(row.usage_count),
        credits: parseInt(row.credits_used)
      };
      dailyStats[dateKey].total += parseInt(row.credits_used);
    });

    // 填充缺失的日期（确保7天都有数据）
    const dailyArray = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      dailyArray.push(dailyStats[dateKey] || {
        date: dateKey,
        total: 0,
        modes: {}
      });
    }

    // 返回结果
    return res.status(200).json({
      modes: modesResult.rows.map(mode => ({
        modeId: mode.mode_id,
        nameEn: mode.name_en,
        nameCn: mode.name_cn,
        descriptionEn: mode.description_en,
        descriptionCn: mode.description_cn,
        workflowEn: mode.workflow_en,
        workflowCn: mode.workflow_cn,
        creditsPerUse: mode.credits_per_use,
        aiModel: mode.ai_model,
        dataSource: mode.data_source,
        stats: modeStats[mode.mode_id] || { usageCount: 0, totalCredits: 0 }
      })),
      dailyStats: dailyArray
    });

  } catch (error) {
    console.error('Get mining modes stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to get mining modes stats',
      details: errorMessage
    });
  }
}
