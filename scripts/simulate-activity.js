#!/usr/bin/env node

const userId = '7e23b466-4c18-455a-97fa-cb5290a5000a';
const apiUrl = process.argv[2] || 'http://localhost:3000';

/**
 * 模拟一些API调用活动
 */
const simulateActivity = async () => {
  try {
    console.log('🔄 开始模拟API活动...\n');

    // 模拟5次不同的API调用
    const activities = [
      { description: 'Google SEO Agent - Keyword Mining', credits: 50 },
      { description: 'Yandex SEO Agent - SERP Analysis', credits: 30 },
      { description: 'Bing SEO Agent - Competition Check', credits: 40 },
      { description: 'DuckDuckGo SEO - Trend Analysis', credits: 25 },
      { description: 'Google SEO Agent - Content Optimization', credits: 35 }
    ];

    for (const activity of activities) {
      console.log(`📊 模拟: ${activity.description} (-${activity.credits} credits)`);

      const response = await fetch(`${apiUrl}/api/credits/consume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          credits: activity.credits,
          description: activity.description,
          relatedEntity: 'seo_agent'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ 成功 - 剩余: ${data.remaining} credits`);
      } else {
        console.log(`   ⚠️  API响应: ${response.status}`);
      }

      // 等待一小段时间
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n✅ 活动模拟完成！');
    console.log('\n现在访问 Dashboard 应该能看到真实数据：');
    console.log(`   - API 调用: ${activities.length}`);
    console.log(`   - 已使用积分: ${activities.reduce((sum, a) => sum + a.credits, 0)}`);
    console.log(`   - 最近活动: ${activities.length} 条记录`);

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
};

simulateActivity();
