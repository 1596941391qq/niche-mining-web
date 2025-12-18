import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './lib/db.js';

/**
 * 初始化挖掘模式定价表
 * GET /api/init-pricing
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 创建定价表
    await sql`
      CREATE TABLE IF NOT EXISTS mining_modes (
        id SERIAL PRIMARY KEY,
        mode_id VARCHAR(50) UNIQUE NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        name_cn VARCHAR(100) NOT NULL,
        description_en TEXT,
        description_cn TEXT,
        workflow_en TEXT,
        workflow_cn TEXT,
        credits_per_use INT NOT NULL,
        ai_model VARCHAR(100) DEFAULT 'gemini-3.0-flash',
        data_source VARCHAR(100) DEFAULT 'SE Ranking',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 插入三种模式的定价
    await sql`
      INSERT INTO mining_modes (
        mode_id, name_en, name_cn, description_en, description_cn,
        workflow_en, workflow_cn, credits_per_use, sort_order
      ) VALUES
      (
        'keyword_mining',
        'Keyword Mining',
        '关键词挖掘',
        'Discover high-potential keywords for your niche',
        '发现高潜力的利基关键词',
        '1. Generate keywords → 2. Research with SEO tools → 3. Search SERP → 4. Analyze ranking probability',
        '1. 生成关键词 → 2. 使用SEO工具研究 → 3. 搜索SERP → 4. 分析排名概率',
        20,
        1
      ),
      (
        'batch_translation',
        'Batch Translation',
        '批量翻译',
        'Translate keywords to multiple languages for global reach',
        '将关键词批量翻译成多种语言，触达全球市场',
        '1. Translate keywords → 2. Research with SEO tools → 3. Search SERP → 4. Analyze opportunities',
        '1. 翻译关键词 → 2. 使用SEO工具研究 → 3. 搜索SERP → 4. 分析机会',
        20,
        2
      ),
      (
        'deep_mining',
        'Deep Mining',
        '深度挖掘',
        'Advanced analysis with competitive intelligence and trend prediction',
        '深度分析，包含竞争情报和趋势预测',
        '1. Generate content strategy → 2. Extract core keywords → 3. Research with SEO tools → 4. Verify SERP → 5. Analyze ranking probability',
        '1. 生成内容策略 → 2. 提取核心关键词 → 3. 使用SEO工具研究 → 4. 验证SERP → 5. 分析排名概率',
        30,
        3
      )
      ON CONFLICT (mode_id) DO UPDATE SET
        name_en = EXCLUDED.name_en,
        name_cn = EXCLUDED.name_cn,
        description_en = EXCLUDED.description_en,
        description_cn = EXCLUDED.description_cn,
        workflow_en = EXCLUDED.workflow_en,
        workflow_cn = EXCLUDED.workflow_cn,
        credits_per_use = EXCLUDED.credits_per_use,
        updated_at = CURRENT_TIMESTAMP
    `;

    // 为 credits_transactions 添加 mode_id 字段（如果不存在）
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'credits_transactions' AND column_name = 'mode_id'
        ) THEN
          ALTER TABLE credits_transactions ADD COLUMN mode_id VARCHAR(50);
        END IF;
      END $$;
    `;

    // 创建索引
    await sql`
      CREATE INDEX IF NOT EXISTS idx_credits_transactions_mode_id
      ON credits_transactions(mode_id)
    `;

    return res.status(200).json({
      success: true,
      message: 'Mining modes pricing table initialized successfully',
      modes: [
        { mode: 'keyword_mining', credits: 20 },
        { mode: 'batch_translation', credits: 20 },
        { mode: 'deep_mining', credits: 30 }
      ]
    });

  } catch (error) {
    console.error('Init pricing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to initialize pricing table',
      details: errorMessage
    });
  }
}
