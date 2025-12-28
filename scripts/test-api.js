#!/usr/bin/env node

/**
 * SEO Agent API 测试脚本
 * 
 * 使用方法:
 *   node scripts/test-api.js
 * 
 * 环境变量:
 *   API_BASE_URL - API 基础 URL (默认: http://localhost:3000/api/v1)
 *   JWT_TOKEN - JWT Token 或 API Key (可选，可以在脚本中设置)
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const JWT_TOKEN = process.env.JWT_TOKEN || '';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// 测试函数
async function testAPI(method, endpoint, body = null, description = '') {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (JWT_TOKEN) {
    options.headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    logInfo(`测试: ${description || `${method} ${endpoint}`}`);
    
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      logSuccess(`成功 (${response.status})`);
      console.log(JSON.stringify(data, null, 2));
      return { success: true, data };
    } else {
      logError(`失败 (${response.status})`);
      console.log(JSON.stringify(data, null, 2));
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    logError(`请求失败: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// 主测试流程
async function runTests() {
  log('\n' + '='.repeat(60), 'bright');
  log('SEO Agent API 测试脚本', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  if (!JWT_TOKEN) {
    logWarning('未设置 JWT_TOKEN 环境变量');
    logInfo('请设置: export JWT_TOKEN="your_token_here"');
    logInfo('或在脚本中直接设置 TOKEN 变量\n');
    
    log('继续测试（某些需要认证的测试会失败）...\n', 'yellow');
  } else {
    logSuccess(`使用 Token: ${JWT_TOKEN.substring(0, 20)}...\n`);
  }

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  // 测试 1: 查看 API 文档
  log('\n📄 测试 1: 查看 API 文档', 'blue');
  const docResult = await testAPI('GET', '/doc', null, 'GET /doc');
  if (docResult.success) {
    results.passed++;
  } else {
    results.failed++;
  }

  // 测试 2: 创建 API Key (需要认证)
  log('\n🔑 测试 2: 创建 API Key', 'blue');
  if (JWT_TOKEN) {
    const apiKeyResult = await testAPI(
      'POST',
      '/api-keys',
      {
        name: `Test API Key ${Date.now()}`,
      },
      'POST /api-keys'
    );
    
    if (apiKeyResult.success) {
      results.passed++;
      const apiKey = apiKeyResult.data?.data?.apiKey;
      
      if (apiKey) {
        logSuccess(`API Key 已创建: ${apiKey.substring(0, 30)}...`);
        logWarning('请保存此 API Key，创建后无法再次查看！');
        
        // 测试 3: 使用 API Key 进行认证
        log('\n🔐 测试 3: 使用 API Key 认证', 'blue');
        const apiKeyTestResult = await testAPI(
          'POST',
          '/seo-agent',
          {
            mode: 'keyword_mining',
            seedKeyword: 'test keyword',
            wordsPerRound: 5,
            skipCreditsCheck: true, // 跳过 credits 检查用于测试
          },
          'POST /seo-agent (使用 API Key)'
        );
        
        if (apiKeyTestResult.success) {
          results.passed++;
        } else {
          results.failed++;
        }
      }
    } else {
      results.failed++;
    }
  } else {
    logWarning('跳过（需要认证）');
    results.skipped++;
  }

  // 测试 4: 获取 API Keys 列表
  log('\n📋 测试 4: 获取 API Keys 列表', 'blue');
  if (JWT_TOKEN) {
    const listResult = await testAPI('GET', '/api-keys', null, 'GET /api-keys');
    if (listResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  } else {
    logWarning('跳过（需要认证）');
    results.skipped++;
  }

  // 测试 5: 关键词挖掘
  log('\n🔍 测试 5: 关键词挖掘', 'blue');
  if (JWT_TOKEN) {
    const miningResult = await testAPI(
      'POST',
      '/seo-agent',
      {
        mode: 'keyword_mining',
        seedKeyword: 'coffee shop',
        systemInstruction: 'Generate high-potential SEO keywords.',
        targetLanguage: 'ko',
        wordsPerRound: 5,
        analyzeRanking: false, // 跳过分析以加快测试
        skipCreditsCheck: true, // 跳过 credits 检查用于测试
      },
      'POST /seo-agent (keyword_mining)'
    );
    
    if (miningResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  } else {
    logWarning('跳过（需要认证）');
    results.skipped++;
  }

  // 测试 6: 批量翻译分析
  log('\n🌐 测试 6: 批量翻译分析', 'blue');
  if (JWT_TOKEN) {
    const batchResult = await testAPI(
      'POST',
      '/seo-agent',
      {
        mode: 'batch_translation',
        keywords: 'coffee shop, espresso machine',
        systemInstruction: 'Analyze SEO opportunities.',
        targetLanguage: 'ko',
        skipCreditsCheck: true, // 跳过 credits 检查用于测试
      },
      'POST /seo-agent (batch_translation)'
    );
    
    if (batchResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  } else {
    logWarning('跳过（需要认证）');
    results.skipped++;
  }

  // 测试 7: 深度策略
  log('\n📊 测试 7: 深度策略', 'blue');
  if (JWT_TOKEN) {
    const deepDiveResult = await testAPI(
      'POST',
      '/seo-agent',
      {
        mode: 'deep_dive',
        keyword: 'coffee shop',
        targetLanguage: 'ko',
        skipCreditsCheck: true, // 跳过 credits 检查用于测试
      },
      'POST /seo-agent (deep_dive)'
    );
    
    if (deepDiveResult.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  } else {
    logWarning('跳过（需要认证）');
    results.skipped++;
  }

  // 测试 8: 错误处理 - 缺少认证
  log('\n🚫 测试 8: 错误处理 - 缺少认证', 'blue');
  const noAuthResult = await testAPI(
    'POST',
    '/seo-agent',
    {
      mode: 'keyword_mining',
      seedKeyword: 'test',
    },
    'POST /seo-agent (无认证)'
  );
  
  if (!noAuthResult.success && noAuthResult.status === 401) {
    logSuccess('正确返回 401 Unauthorized');
    results.passed++;
  } else {
    logError('未正确返回 401 错误');
    results.failed++;
  }

  // 测试 9: 错误处理 - 缺少必填字段
  log('\n🚫 测试 9: 错误处理 - 缺少必填字段', 'blue');
  if (JWT_TOKEN) {
    const missingFieldResult = await testAPI(
      'POST',
      '/seo-agent',
      {
        // 缺少 mode 字段
      },
      'POST /seo-agent (缺少 mode)'
    );
    
    if (!missingFieldResult.success && missingFieldResult.status === 400) {
      logSuccess('正确返回 400 Bad Request');
      results.passed++;
    } else {
      logError('未正确返回 400 错误');
      results.failed++;
    }
  } else {
    logWarning('跳过（需要认证）');
    results.skipped++;
  }

  // 总结
  log('\n' + '='.repeat(60), 'bright');
  log('测试总结', 'bright');
  log('='.repeat(60), 'bright');
  log(`✅ 通过: ${results.passed}`, 'green');
  log(`❌ 失败: ${results.failed}`, 'red');
  log(`⏭️  跳过: ${results.skipped}`, 'yellow');
  log('='.repeat(60) + '\n', 'bright');

  process.exit(results.failed > 0 ? 1 : 0);
}

// 运行测试
if (require.main === module) {
  runTests().catch((error) => {
    logError(`测试脚本执行失败: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { testAPI, runTests };

