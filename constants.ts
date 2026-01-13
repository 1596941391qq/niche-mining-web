import { Translations } from './types';

export const CONTENT: Record<string, Translations> = {
  en: {
    nav: {
      features: 'Methodology',
      agents: 'Agents',
      howItWorks: 'Process',
      pricing: 'Pricing',
      start: 'Deploy Agent',
    },
    console: {
      sidebar: {
        dashboard: 'Dashboard',
        agents: 'Agents',
        api: 'API Keys',
        subscription: 'Subscription',
        team: 'Team',
        settings: 'Settings',
        backHome: 'Back to Home',
      },
      userInfo: {
        currentPlan: 'Current Plan',
      },
      settings: {
        profile: {
          title: 'Profile Settings',
          avatar: 'Profile Picture',
          changeAvatar: 'Change Avatar',
          fullName: 'Full Name',
          email: 'Email Address',
          save: 'Save Changes',
          noSave: 'Feature disabled (demo only)',
        },
        preferences: {
          title: 'Preferences',
          language: 'Language',
          timezone: 'Timezone',
        },
        notifications: {
          title: 'Notifications',
          email: 'Email Notifications',
          emailDesc: 'Receive updates about your account and usage',
          usage: 'Usage Alerts',
          usageDesc: 'Get notified when you reach 80% of your credit limit',
          marketing: 'Marketing Emails',
          marketingDesc: 'Receive news about new features and promotions',
        },
        security: {
          title: 'Security',
          twoFactor: 'Two-Factor Authentication',
          twoFactorDesc: 'Add an extra layer of security to your account',
          password: 'Password',
          passwordDesc: 'You\'re signed in with Google OAuth. No password needed.',
          sessions: 'Active Sessions',
          sessionsDesc: 'Manage and logout from your active sessions',
          viewSessions: 'View Sessions',
          notAvailable: 'Feature not available',
          enable: 'Enable',
          disable: 'Disable',
        },
        danger: {
          title: 'Danger Zone',
          delete: 'Delete Account',
          deleteDesc: 'Once you delete your account, there is no going back. Please be certain.',
        },
        deleteModal: {
          title: 'Delete Account',
          warning: 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.',
          cancel: 'Cancel',
          delete: 'Delete Forever',
        },
      },
    },
    hero: {
      badge: 'SYSTEM READY // CLAIM 200 FREE CREDITS',
      title: 'Stop Competing.\nStart Domination.',
      subtitle: 'Stop managing scripts. Launch your 24/7 AI Growth Engine. Scale high-authority content and dominate Google & AI search automatically.',
      placeholder: 'Enter seed keyword...',
      ctaPrimary: 'Start Production',
      stats_efficiency: 'Automated Growth',
      stats_depth: 'Expert Quality',
    },
    features: {
      heading: 'The Growth Factory',
      subheading: 'Our autonomous production line doesn\'t just search; it builds your online presence and captures revenue.',
      description: 'Tested and proven: Dominate your niche 10x faster with automated high-authority content generation.',
      steps: [
        { title: 'The Mining', desc: 'Find hidden "low-competition" keywords your competitors missed for an easy traffic boost.' },
        { title: 'The Content', desc: 'Generate expert-level, original content that Google loves—zero risk of AI content penalties.' },
        { title: 'The Posting', desc: 'One-click auto-posting to WordPress and more. Build a high-authority blog matrix instantly.' },
        { title: 'The ROI', desc: 'Track real revenue from every single post. See exactly how your traffic turns into profit.' },
      ],
    },
    tools: {
      badge: 'AUTONOMOUS AGENT TEAM',
      heading: 'Your 24/7 Production Engine',
      subheading: 'A specialized team of agents working in an 8-step industrial chain. We don\'t just generate content; we engineer authority based on Information Gain and EEAT principles.',
      action: 'Deploy Agent',
      items: [
        {
          id: 'google',
          name: 'SEO Researcher',
          desc: 'Performs SERP Gap Analysis (Google/ChatGPT/Perplexity), identifying "weak slots" occupied by forums and outdated content.',
          features: ['SERP Intent Mapping', 'Competitor Gap Analysis', 'LSI/Entity Extraction'],
        },
        {
          id: 'yandex',
          name: 'Content Architect',
          desc: 'Engineers high-citation content with structural Information Gain, optimized for AIO/GEO and Google HCU standards.',
          features: ['HCU/AIO Optimization', 'Information Gain Engineering', 'EEAT-Driven Writing'],
        },
        {
          id: 'bing',
          name: 'Quality Controller',
          desc: 'Automates 200+ ranking factor audits. Validates factual accuracy, AI detection, and structural integrity.',
          features: ['Ranking Factor Audit', 'Humanization Check', 'Compliance Validation'],
        },
      ],
    },
    howItWorks: {
      badge: 'Industrial Pipeline (Strategic Insight)',
      coreValue: {
        title: 'Core Value',
        subtitle: 'Eliminate Growth Bottlenecks',
        description: 'Traditional SEO is failing due to high CAC and shifting algorithms. We provide the industrial infrastructure to secure your organic traffic share in the AI era.',
      },
      dualMission: {
        retrieval: {
          title: 'Establish Search Dominance',
          desc: 'Flood Google Search with your high-authority content. Use massive pSEO matrices to capture every relevant long-tail search lead.'
        },
        synthesis: {
          title: 'Be the AI Answer',
          desc: 'Ensure ChatGPT and Perplexity recommend your brand as the definitive source when synthesizing answers for your customers.'
        }
      },
      workflow: {
        title: 'Automated Growth Flow',
        description: 'AI agents and auto-publishing units working in sync to build your 24/7 content production line.',
        customizable: {
          title: 'Build Your Content Factory',
          description: 'Customize production parameters to match your niche and specific market growth goals.',
          features: [
            'Customizable workflows',
            'Tailored AI writing logic',
            'Full SEO API integration',
            'Auto-generated unique visuals',
            'Real-time revenue tracking',
          ],
        },
        steps: [
          {
            id: '1',
            title: 'Keyword Mining (Mining)',
            description: '',
            agents: [
              { name: 'Intelligence Agent', desc: 'Discover hidden "low-competition" keywords your competitors missed.' },
              { name: 'Intent Architect', desc: 'Identify keywords with the highest buying intent for maximum ROI.' },
            ],
            tools: [
              { name: 'SERP Analyzer', desc: 'Identify easy-to-rank search slots held by weak content.' },
              { name: 'Volume Validator', desc: 'Ensure every keyword has the potential to drive real sales.' },
            ],
            value: 'Identify high-value targets for instant ranking and traffic growth.',
          },
          {
            id: '2',
            title: 'Expert AI Writing (Factory)',
            description: '',
            agents: [
              { name: 'Content Engineer', desc: 'Generate deep, expert-level content that builds brand authority.' },
              { name: 'Reviewer Agent', desc: 'Ensure 100% original quality that passes all Google audits.' },
            ],
            tools: [
              { name: 'Authority Guard', desc: 'Inject unique data points to stand out from generic AI content.' },
              { name: 'AIO Optimization Unit', desc: 'Format content to be the top choice for AI search summaries.' },
            ],
            value: 'Convert raw keywords into high-authority, original digital assets.',
          },
          {
            id: '3',
            title: 'Auto-Sync Posting (Posting)',
            description: '',
            agents: [
              { name: 'Publisher Agent', desc: 'Connect to your sites and publish content automatically in seconds.' },
              { name: 'Matrix Architect', desc: 'Build citation networks across your sites to skyrocket domain trust.' },
            ],
            tools: [
              { name: 'CMS Integrator', desc: 'Full support for WordPress, Shopify, and other major platforms.' },
            ],
            value: 'Dominate search results with a content moat competitors can\'t copy.',
          },
          {
            id: '4',
            title: 'Revenue Tracker (Radar)',
            description: '',
            agents: [
              { name: 'Profit Analyst', desc: 'Track rankings, AI citations, and actual lead conversions in real-time.' },
              { name: 'Growth Strategist', desc: 'Analyze the revenue from every post to optimize your future strategy.' },
            ],
            tools: [
              { name: 'Full Transparency Tracker', desc: 'Monitor the performance of all your pages in one dashboard.' },
            ],
            value: 'Get a clear breakdown of the financial contribution from every article.',
          },
        ],
      },
      invincible: {
        title: 'Automated Growth vs Traditional Struggles',
        items: [
          {
            title: 'The Legacy Struggle',
            desc: 'Expensive Ads -> Unpredictable CAC -> Algorithm Penalties -> Generic Content -> Customers hijacked by Competitors.',
          },
          {
            title: 'The NicheDigger Fast-track',
            desc: 'Find Low-competition Keywords -> Auto Expert Writing -> Instant Site Posting -> High Authority Growth -> Reliable Profits.',
          },
        ],
      },
      complianceMatrix: {
        title: 'Authority Protection Protocol (2026)',
        description: 'We don\'t just write content; we use advanced strategies to ensure Google loves your site and you lead the AI search era.',
        items: [
          { title: "Originality Guard", desc: "Inject unique empirical data to ensure your content is irreplaceable by generic AI.", status: "ACTIVE" },
          { title: "Expert Backing (EEAT)", desc: "Automate high-authority citation patterns to build instant trust with search engines.", status: "VERIFIED" },
          { title: "Intent Fulfillment", desc: "Answer user queries precisely to earn top marks in relevance algorithms.", status: "READY" },
          { title: "Knowledge Graph Mapping", desc: "Deep anchor your brand as a leader within Google\'s Knowledge Graph infrastructure.", status: "SYNCED" }
        ]
      },
      trends: {
        title: 'The AI Search Era is Here',
        subtitle: 'Over 1 Billion users now ask AI engines before they buy. Show up in the results, or miss the sale.',
        stats: [
          { label: 'ChatGPT', value: '800M users', icon: 'chatgpt' },
          { label: 'Gemini', value: '400M users', icon: 'gemini' },
          { label: 'Grok', value: '64M users', icon: 'grok' },
        ],
      },
      factors: {
        title: 'Google\'s 200+ Ranking Factors',
        subtitle: 'SEO is a complex engineering task. Our agents automate the optimization of every critical dimension.',
        items: [
          { category: 'Content Quality', details: 'Depth, Originality, Topic Coverage, Structure, Readability' },
          { category: 'Relevancy', details: 'H1/H2 keywords, Meta tags, LSI/Entity matching, URL structure' },
          { category: 'AIO Optimization', details: 'Q&A format, Structured data, Information gain, LLM-friendly phrasing' },
          { category: 'Authority (EEAT)', details: 'Knowledge Graph, High-citation patterns, Domain reputation' },
        ],
      },
    },
    footer: {
      tagline: 'Automated SEO warfare for the modern age.',
      product: 'Product',
      legal: 'Legal',
      about: 'About Us',
      rights: 'Soulcraft Limited. All rights reserved.',
      system: 'All Systems Operational',
      privacyLink: 'Privacy',
      termsLink: 'Terms',
      company: 'Soulcraft Limited',
      email: 'soulcraftlimited@galatea.bar',
      aboutDescription: 'We are an artificial intelligence applications company dedicated to providing innovative AI-powered solutions.',
      companyName: 'SOULCRAFT LIMITED',
      chineseCompanyName: '靈靈柒科技有限公司',
      businessRegNo: 'Business Registration No.',
      incorporationDate: 'Date of Incorporation',
      companyType: 'Company Type',
      companyStatus: 'Company Status',
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'January 2024',
      back: 'Back to Home',
      sections: [
        {
          title: '1. Information We Collect',
          content: [
            'We collect information that you provide directly to us, including when you use our SEO mining services, create an account, or contact us for support. This may include your name, email address, payment information, and any keywords or data you input into our system.',
            'We automatically collect certain information about your device and how you interact with our services, including IP address, browser type, usage patterns, and performance metrics related to our mining agents.',
          ],
        },
        {
          title: '2. How We Use Your Information',
          content: [
            'We use the information we collect to provide, maintain, and improve our services, including processing your mining requests, generating reports, and optimizing our algorithms.',
            'We may use your information to communicate with you about your account, send you service updates, respond to your inquiries, and provide customer support.',
            'We analyze usage patterns to improve our services, develop new features, and ensure the security and integrity of our platform.',
          ],
        },
        {
          title: '3. Data Security',
          content: [
            'We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.',
            'However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.',
          ],
        },
        {
          title: '4. Data Sharing and Disclosure',
          content: [
            'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:',
            'With your explicit consent;',
            'To comply with legal obligations or respond to lawful requests from authorities;',
            'To protect our rights, privacy, safety, or property, or that of our users;',
            'In connection with a business transfer, merger, or acquisition.',
          ],
        },
        {
          title: '5. Your Rights',
          content: [
            'You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.',
            'You may opt out of certain data collection practices, though this may limit your ability to use some features of our services.',
            'You can request a copy of your data or request that we delete your account and associated data.',
          ],
        },
        {
          title: '6. Cookies and Tracking',
          content: [
            'We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie preferences through your browser settings.',
          ],
        },
        {
          title: '7. Changes to This Policy',
          content: [
            'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.',
            'Your continued use of our services after any changes constitutes acceptance of the updated policy.',
          ],
        },
      ],
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about this Privacy Policy, please contact us at:',
        email: 'soulcraftlimited@galatea.bar',
        company: 'Soulcraft Limited',
      },
    },
    about: {
      title: 'About Us',
      subtitle: 'Learn more about our company',
      back: 'Back to Home',
      companyInfo: {
        title: 'Company Overview',
        content: [
          'We are an artificial intelligence applications company dedicated to providing innovative AI-powered solutions. Our mission is to leverage cutting-edge artificial intelligence technology to solve real-world problems and create value for our customers.',
          'Soulcraft Limited was incorporated on 05-Jul-2025 as a Private company limited by shares registered in Hong Kong. We have been operating for 5 months, focusing on developing and delivering advanced AI applications that transform how businesses operate and interact with technology.',
          'Our team is passionate about artificial intelligence and committed to pushing the boundaries of what\'s possible with AI technology. We believe in creating solutions that are not only technologically advanced but also practical and accessible.',
        ],
      },
      companyDetails: {
        title: 'Company Information',
        companyName: 'Company Name',
        companyNameValue: 'SOULCRAFT LIMITED',
        chineseCompanyName: '靈靈柒科技有限公司',
        businessRegNo: 'Business Registration No.',
        incorporationDate: 'Date of Incorporation',
        companyType: 'Company Type',
        companyStatus: 'Company Status',
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about our company or services, please contact us at:',
        company: 'Soulcraft Limited',
        email: 'soulcraftlimited@galatea.bar',
      },
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'January 2024',
      back: 'Back to Home',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: [
            'By accessing or using Niche Mining services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.',
            'We reserve the right to modify these terms at any time. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.',
          ],
        },
        {
          title: '2. Description of Service',
          content: [
            'Niche Mining provides automated SEO keyword mining and analysis services through specialized agents designed for different search engines (Google, Yandex, Bing).',
            'Our services include keyword discovery, SERP analysis, competition assessment, and opportunity identification. We do not guarantee specific results or rankings.',
          ],
        },
        {
          title: '3. User Accounts and Responsibilities',
          content: [
            'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
            'You agree to provide accurate, current, and complete information when creating an account and to update such information as necessary.',
            'You must be at least 18 years old or have parental consent to use our services.',
          ],
        },
        {
          title: '4. Acceptable Use',
          content: [
            'You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair our services or interfere with other users\' access.',
            'Prohibited activities include: attempting to reverse engineer our algorithms, using automated systems to abuse our services, sharing account credentials, or using our services to violate any third-party rights.',
            'We reserve the right to suspend or terminate accounts that violate these terms.',
          ],
        },
        {
          title: '5. Intellectual Property',
          content: [
            'All content, features, and functionality of our services, including but not limited to text, graphics, logos, software, and algorithms, are owned by Niche Mining Inc. and are protected by international copyright, trademark, and other intellectual property laws.',
            'You may not copy, modify, distribute, sell, or lease any part of our services without our prior written consent.',
            'Data generated through your use of our services belongs to you, but our analysis methods and algorithms remain our proprietary property.',
          ],
        },
        {
          title: '6. Payment and Billing',
          content: [
            'Our services may be offered on a subscription or pay-per-use basis. All fees are non-refundable unless otherwise stated.',
            'You are responsible for all charges incurred under your account, including applicable taxes.',
            'We reserve the right to change our pricing with reasonable notice to existing subscribers.',
          ],
        },
        {
          title: '7. Disclaimer of Warranties',
          content: [
            'Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
            'We do not guarantee that our services will be uninterrupted, error-free, or secure, or that any defects will be corrected.',
            'We do not warrant that the results obtained from using our services will meet your expectations or produce specific SEO outcomes.',
          ],
        },
        {
          title: '8. Limitation of Liability',
          content: [
            'To the maximum extent permitted by law, Niche Mining Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.',
            'Our total liability for any claims arising from or related to our services shall not exceed the amount you paid to us in the 12 months preceding the claim.',
          ],
        },
        {
          title: '9. Termination',
          content: [
            'We may terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.',
            'You may terminate your account at any time by contacting us or through your account settings.',
            'Upon termination, your right to use our services will cease immediately, but provisions that by their nature should survive termination will remain in effect.',
          ],
        },
        {
          title: '10. Governing Law',
          content: [
            'These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Niche Mining Inc. is incorporated, without regard to its conflict of law provisions.',
            'Any disputes arising from these terms or our services shall be resolved through binding arbitration or in the courts of our jurisdiction.',
          ],
        },
      ],
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about these Terms of Service, please contact us at:',
        email: 'soulcraftlimited@galatea.bar',
        company: 'Soulcraft Limited',
      },
    },
  },
  cn: {
    nav: {
      features: '核心算法',
      agents: '挖掘工具',
      howItWorks: '工作原理',
      pricing: '定价方案',
      start: '开始挖掘',
    },
    console: {
      sidebar: {
        dashboard: '仪表板',
        agents: 'Agents',
        api: 'API 密钥',
        subscription: '订阅',
        team: '团队',
        settings: '设置',
        backHome: '返回首页',
      },
      userInfo: {
        currentPlan: '当前套餐',
      },
      settings: {
        profile: {
          title: '个人信息设置',
          avatar: '头像',
          changeAvatar: '更改头像',
          fullName: '全名',
          email: '邮箱地址',
          save: '保存更改',
          noSave: '功能未开放 (演示)',
        },
        preferences: {
          title: '偏好设置',
          language: '语言',
          timezone: '时区',
        },
        notifications: {
          title: '通知设置',
          email: '邮件通知',
          emailDesc: '接收关于账户和使用的更新',
          usage: '用量提醒',
          usageDesc: '当您的额度使用达到80%时收到通知',
          marketing: '营销邮件',
          marketingDesc: '接收新功能和促销信息',
        },
        security: {
          title: '安全设置',
          twoFactor: '双因素认证',
          twoFactorDesc: '为您的账户添加额外的安全层',
          password: '密码',
          passwordDesc: '您使用 Google OAuth 登录，无需密码',
          sessions: '活跃会话',
          sessionsDesc: '管理和登出您的活跃会话',
          viewSessions: '查看会话',
          notAvailable: '功能未开放',
          enable: '启用',
          disable: '禁用',
        },
        danger: {
          title: '危险操作',
          delete: '删除账户',
          deleteDesc: '一旦删除账户，将无法恢复。请谨慎操作。',
        },
        deleteModal: {
          title: '删除账户',
          warning: '此操作无法撤销。这将永久删除您的账户并从我们的服务器中移除所有数据。',
          cancel: '取消',
          delete: '永久删除',
        },
      },
    },
    hero: {
      badge: '系统就绪 // 注册即领 200 生产点数',
      title: '停止无效竞争。\n开始蓝海垄断。',
      subtitle: '告别琐碎脚本，启动你的 24/7 AI 增长引擎。全自动产出专家级高权重内容，在谷歌与 AI 搜索中轻松占据地盘。',
      placeholder: '输入核心种子词...',
      ctaPrimary: '启动全链路生产线',
      stats_efficiency: '全自动增长',
      stats_depth: '专家级内容',
    },
    features: {
      heading: '流量工厂',
      subheading: '我们的全链路自动化生产线不仅仅是搜索，它是在建造权威并收割收益。',
      description: '经过测试，通过自动化高权重内容生成，市场垄断速度可提升 10 倍以上。',
      steps: [
        { title: '挖掘期 | The Mining', desc: '发现竞争对手还没察觉的蓝海词，锁定容易排名的精准流量，抢占先机。' },
        { title: '内容期 | The Content', desc: '全自动生成专家级原创内容，完美符合谷歌收录标准，告别 AI 洗稿降权。' },
        { title: '发布期 | The Posting', desc: '一键全自动同步上站，支持多种内容导出和发布方式，打造高权重博客矩阵。' },
        { title: '收益期 | The ROI', desc: '实时查看每一篇文章带来的真实收益，让增长看得见摸得着，告别 SEO 玄学。' },
      ],
    },
    tools: {
      badge: '自动化代理人团队',
      heading: '你的 24/7 生产引擎',
      subheading: '由专业代理构成的 8 步工业化生产链。我们不仅是生成内容，更是基于信息增益 (Information Gain) 与 EEAT 原则构建权威。',
      action: '启动 Agent',
      items: [
        {
          id: 'google',
          name: 'SEO 研究官',
          desc: '执行 SERP 竞争缺口分析 (Google/ChatGPT/Perplexity)，识别由陈旧论坛和低质量内容占据的“防守薄弱位”。',
          features: ['SERP 意图映射', '竞争对手缺口分析', 'LSI/实体提取'],
        },
        {
          id: 'yandex',
          name: '内容架构师',
          desc: '通过结构化信息增益工程生成高引用权重内容，深度对冲 Google HCU 算法风险。',
          features: ['HCU/AIO 深度优化', '信息增益工程', 'EEAT 驱动写作'],
        },
        {
          id: 'bing',
          name: '质量把关官',
          desc: '自动化执行 200+ 项谷歌排名因素审计。严苛验证事实准确性、AI 痕迹与结构合规。',
          features: ['排名因素审计', '人类化风格校验', '合规性验证'],
        },
      ],
    },
    howItWorks: {
      badge: '全链路生产线（战略洞察）',
      coreValue: {
        title: '核心价值',
        subtitle: '粉碎业务增长瓶颈',
        description: '传统 SEO 正在因高昂的 CAC 和算法波动而失效。我们提供工业级基础设施，确保您在 AI 时代锁定确定性的自然流量份额。',
      },
      dualMission: {
        retrieval: {
          title: '把 Google 地盘占下来',
          desc: '让你的网站铺满 Google 搜索首页。通过海量高权重文章矩阵，截获所有相关的潜在客户流量。'
        },
        synthesis: {
          title: '让 AI 引擎主动推荐你',
          desc: '让 ChatGPT、Perplexity 在生成答案时，将你的品牌作为唯一权威来源引用，占领 AI 搜索心智。'
        }
      },
      workflow: {
        title: '自动化增长流程',
        description: 'AI 代理与全自动发布单元完美配合，为你打造不眠不休的内容生产线。',
        customizable: {
          title: '灵活配置你的工厂',
          description: '支持自定义生产参数，完美适配你的行业特色与市场需求。',
          features: [
            '自由编排工作流',
            '自定义 AI 写作逻辑',
            '多平台 API 深度集成',
            '独家视觉资产自动配图',
            '实时流量收益反馈',
          ],
        },
        steps: [
          {
            id: '1',
            title: '精准挖词 (Mining)',
            description: '',
            agents: [
              { name: '情报 Agent', desc: '扫描竞争对手还没发现的流量蓝海词。' },
              { name: '意图架构师', desc: '精准锁定用户搜索时的真实买单需求。' },
            ],
            tools: [
              { name: 'SERP 分析仪', desc: '识别容易排名的“弱防守”搜索位。' },
              { name: '流量验证器', desc: '计算真实的转化率，确保每一分投入都有回报。' },
            ],
            value: '锁定低阻力切入点，实现排名的瞬间爆发。',
          },
          {
            id: '2',
            title: '专家级写作 (Factory)',
            description: '',
            agents: [
              { name: '内容工程师', desc: '生成高权重、具备专家深度的高引用内容。' },
              { name: '审查 Agent', desc: '确保 100% 原创质感，完美通过谷歌合规审计。' },
            ],
            tools: [
              { name: '高权重保障单元', desc: '确保内容具备优于对手的独特价值，提升收录率。' },
              { name: 'AI 引用优化工具', desc: '针对 AI 引擎的推荐逻辑进行内容骨架优化。' },
            ],
            value: '将关键词转化为具备商业价值的高权重原创内容。',
          },
          {
            id: '3',
            title: '自动同步发布 (Deployment)',
            description: '',
            agents: [
              { name: '发布官 Agent', desc: '全自动打通站点接口，实现内容秒速发布。' },
              { name: '外链架构师', desc: '自动建立博客矩阵引用，快速推高站点权重。' },
            ],
            tools: [
              { name: '多平台对接单元', desc: '支持多种内容导出和发布方式。' },
            ],
            value: '自动占领搜索地盘，建立竞争对手无法逾越的内容护城河。',
          },
          {
            id: '4',
            title: '流量收益追踪 (Radar)',
            description: '',
            agents: [
              { name: '收益分析员', desc: '实时监控排名、AI 引用率与真实的询盘转化。' },
              { name: '增长策略师', desc: '分析每一篇文章的赚钱能力，优化后续生产。' },
            ],
            tools: [
              { name: '全透明追踪器', desc: '同步追踪所有页面的综合表现，数据触手可及。' },
            ],
            value: '为每一篇文章的赚钱贡献提供绝对透明的账单分析。',
          },
        ],
      },
      invincible: {
        title: '自动化增长 vs 传统流量困局',
        items: [
          {
            title: '传统模式的“泥潭”',
            desc: '广告费越来越贵 -> 流量成本不可控 -> 容易被算法惩罚 -> 内容同质化 -> 客户被对手截胡。',
          },
          {
            title: 'NicheDigger 的“快车道”',
            desc: '精准发现蓝海词 -> 全自动专家写作 -> 一键同步上站发布 -> 自动获得高权重引用 -> 确定的赚钱回报。',
          },
        ],
      },
      complianceMatrix: {
        title: '高权重保障协议 (2026)',
        description: '我们不只是写稿，更是通过一系列手段确保你的内容被谷歌喜爱，且在 AI 搜索时代站稳脚跟。',
        items: [
          { title: "原创性保障", desc: "通过深度数据注入，确保内容具备独一无二的参考价值，规避 AI 降权。", status: "ACTIVE" },
          { title: "专家背书 (EEAT)", desc: "自动化模拟高权威领域专家引用，快速建立站点在谷歌眼中的信任度。", status: "VERIFIED" },
          { title: "意图缺口填充", desc: "精准回答用户最想看的问题，确保内容在相关性评分中获得满分。", status: "READY" },
          { title: "权威地图锚定", desc: "通过结构化数据深埋，让谷歌知识图谱把你的品牌当作该领域的领头羊。", status: "SYNCED" }
        ]
      },
      trends: {
        title: 'AI 搜索时代全面来临',
        subtitle: '超过 10 亿用户现在在购买前先询问 AI 引擎。出现在结果中，否则就失去这笔交易。',
        stats: [
          { label: 'ChatGPT', value: '8亿用户', icon: 'chatgpt' },
          { label: 'Gemini', value: '4亿用户', icon: 'gemini' },
          { label: 'Grok', value: '6400万用户', icon: 'grok' },
        ],
      },
      factors: {
        title: '谷歌 200+ 核心排名因素',
        subtitle: 'SEO 是一项复杂的系统工程。我们的代理人实现了每一个关键维度的自动化优化。',
        items: [
          { category: '内容质量 (Content)', details: '深度、原创性、主题覆盖、结构清晰度、可读性' },
          { category: '相关性 (Relevancy)', details: 'H1/H2 关键词、Meta 标签、语义相关词 (LSI/Entity)、URL 结构' },
          { category: 'AIO 优化', details: 'Q&A 格式、结构化数据、信息增益 (Information Gain)、AI 友好措辞' },
          { category: '权威性 (EEAT)', details: '知识图谱 (Knowledge Graph)、高引用模式、域名声誉' },
        ],
      },
    },
    footer: {
      tagline: '现代 SEO 战争的自动化武器。',
      product: '产品',
      legal: '法律',
      about: '关于我们',
      rights: 'Soulcraft Limited 保留所有权利。',
      system: '系统运行正常',
      privacyLink: '隐私政策',
      termsLink: '服务条款',
      company: 'Soulcraft Limited',
      email: 'soulcraftlimited@galatea.bar',
      aboutDescription: '我们是一家专注于人工智能应用的公司，致力于提供创新的AI驱动解决方案。',
      companyName: 'SOULCRAFT LIMITED',
      chineseCompanyName: '靈靈柒科技有限公司',
      businessRegNo: '商业登记号码',
      incorporationDate: '成立日期',
      companyType: '公司类型',
      companyStatus: '公司状态',
    },
    privacy: {
      title: '隐私政策',
      lastUpdated: '2024年1月',
      back: '返回首页',
      sections: [
        {
          title: '1. 我们收集的信息',
          content: [
            '我们收集您直接提供给我们的信息，包括您使用我们的SEO挖掘服务、创建账户或联系我们寻求支持时提供的信息。这可能包括您的姓名、电子邮件地址、支付信息以及您输入到我们系统中的任何关键词或数据。',
            '我们会自动收集有关您的设备以及您如何与我们服务交互的某些信息，包括IP地址、浏览器类型、使用模式以及与我们的挖掘代理相关的性能指标。',
          ],
        },
        {
          title: '2. 我们如何使用您的信息',
          content: [
            '我们使用收集的信息来提供、维护和改进我们的服务，包括处理您的挖掘请求、生成报告和优化我们的算法。',
            '我们可能使用您的信息与您就您的账户进行沟通，向您发送服务更新，回应您的询问，并提供客户支持。',
            '我们分析使用模式以改进我们的服务，开发新功能，并确保我们平台的安全性和完整性。',
          ],
        },
        {
          title: '3. 数据安全',
          content: [
            '我们实施行业标准的安全措施，以保护您的信息免受未经授权的访问、更改、披露或破坏。这包括加密、安全服务器和定期安全审计。',
            '但是，通过互联网传输或电子存储的方法都不是100%安全的。虽然我们努力保护您的数据，但我们不能保证绝对安全。',
          ],
        },
        {
          title: '4. 数据共享和披露',
          content: [
            '我们不会向第三方出售、交易或出租您的个人信息。我们仅在以下情况下共享您的信息：',
            '在您明确同意的情况下；',
            '为遵守法律义务或响应当局的合法请求；',
            '为保护我们的权利、隐私、安全或财产，或保护我们用户的权利、隐私、安全或财产；',
            '与业务转让、合并或收购相关的情况。',
          ],
        },
        {
          title: '5. 您的权利',
          content: [
            '您有权随时通过您的账户设置或联系我们访问、更新或删除您的个人信息。',
            '您可以选择退出某些数据收集做法，尽管这可能会限制您使用我们服务的某些功能的能力。',
            '您可以请求您的数据副本，或请求我们删除您的账户和相关数据。',
          ],
        },
        {
          title: '6. Cookie和跟踪',
          content: [
            '我们使用Cookie和类似的跟踪技术来增强您的体验，分析使用模式并改进我们的服务。您可以通过浏览器设置控制Cookie首选项。',
          ],
        },
        {
          title: '7. 政策变更',
          content: [
            '我们可能会不时更新本隐私政策。我们将通过在此页面上发布新政策并更新"最后更新"日期来通知您任何重大变更。',
            '您在变更后继续使用我们的服务即表示接受更新后的政策。',
          ],
        },
      ],
      contact: {
        title: '联系我们',
        content: '如果您对本隐私政策有任何疑问，请通过以下方式联系我们：',
        email: 'soulcraftlimited@galatea.bar',
        company: 'Soulcraft Limited',
      },
    },
    about: {
      title: '关于我们',
      subtitle: '了解更多关于我们公司的信息',
      back: '返回首页',
      companyInfo: {
        title: '公司概述',
        content: [
          '我们是一家专注于人工智能应用的公司，致力于提供创新的AI驱动解决方案。我们的使命是利用前沿的人工智能技术解决现实世界的问题，为客户创造价值。',
          'Soulcraft Limited 于 2025年7月5日 在香港注册成立，是一家私人股份有限公司。我们已运营5个月，专注于开发和交付先进的AI应用，改变企业运营和与技术交互的方式。',
          '我们的团队对人工智能充满热情，致力于推动AI技术可能性的边界。我们相信创建不仅技术先进，而且实用且易于访问的解决方案。',
        ],
      },
      companyDetails: {
        title: '公司信息',
        companyName: '公司名称',
        companyNameValue: 'SOULCRAFT LIMITED',
        chineseCompanyName: '靈靈柒科技有限公司',
        businessRegNo: '商业登记号码',
        incorporationDate: '成立日期',
        companyType: '公司类型',
        companyStatus: '公司状态',
      },
      contact: {
        title: '联系我们',
        content: '如果您对我们的公司或服务有任何疑问，请通过以下方式联系我们：',
        company: 'Soulcraft Limited',
        email: 'soulcraftlimited@galatea.bar',
      },
    },
    terms: {
      title: '服务条款',
      lastUpdated: '2024年1月',
      back: '返回首页',
      sections: [
        {
          title: '1. 接受条款',
          content: [
            '通过访问或使用Niche Mining服务，您同意受本服务条款以及所有适用的法律法规约束。如果您不同意这些条款中的任何一项，则禁止使用我们的服务。',
            '我们保留随时修改这些条款的权利。您在发布变更后继续使用我们的服务即表示接受修改后的条款。',
          ],
        },
        {
          title: '2. 服务说明',
          content: [
            'Niche Mining通过专为不同搜索引擎（Google、Yandex、Bing）设计的专业代理提供自动化SEO关键词挖掘和分析服务。',
            '我们的服务包括关键词发现、SERP分析、竞争评估和机会识别。我们不保证特定结果或排名。',
          ],
        },
        {
          title: '3. 用户账户和责任',
          content: [
            '您有责任维护账户凭据的机密性，并对您账户下发生的所有活动负责。',
            '您同意在创建账户时提供准确、最新和完整的信息，并在必要时更新此类信息。',
            '您必须年满18岁或获得父母同意才能使用我们的服务。',
          ],
        },
        {
          title: '4. 可接受的使用',
          content: [
            '您同意不将我们的服务用于任何非法目的，或以任何可能损坏、禁用或损害我们的服务或干扰其他用户访问的方式使用。',
            '禁止的活动包括：试图逆向工程我们的算法、使用自动化系统滥用我们的服务、共享账户凭据，或使用我们的服务侵犯任何第三方权利。',
            '我们保留暂停或终止违反这些条款的账户的权利。',
          ],
        },
        {
          title: '5. 知识产权',
          content: [
            '我们服务的所有内容、功能和特性，包括但不限于文本、图形、徽标、软件和算法，均归Niche Mining Inc.所有，并受国际版权、商标和其他知识产权法保护。',
            '未经我们事先书面同意，您不得复制、修改、分发、出售或租赁我们服务的任何部分。',
            '通过使用我们的服务生成的数据归您所有，但我们的分析方法和算法仍是我们专有财产。',
          ],
        },
        {
          title: '6. 付款和账单',
          content: [
            '我们的服务可能以订阅或按使用付费的方式提供。除非另有说明，否则所有费用均不可退还。',
            '您对账户下产生的所有费用负责，包括适用的税费。',
            '我们保留在合理通知现有订阅者的情况下更改定价的权利。',
          ],
        },
        {
          title: '7. 免责声明',
          content: [
            '我们的服务按"现状"和"可用"提供，不提供任何形式的明示或暗示保证，包括但不限于适销性、特定用途适用性或非侵权性的保证。',
            '我们不保证我们的服务将不间断、无错误或安全，或任何缺陷将被纠正。',
            '我们不保证使用我们的服务获得的结果将满足您的期望或产生特定的SEO结果。',
          ],
        },
        {
          title: '8. 责任限制',
          content: [
            '在法律允许的最大范围内，Niche Mining Inc.不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任，包括利润、数据或商业机会的损失。',
            '我们对因我们的服务引起或与之相关的任何索赔的总责任不得超过您在索赔前12个月内向我们支付的金额。',
          ],
        },
        {
          title: '9. 终止',
          content: [
            '如果我们认为您的行为违反本服务条款或对其他用户、我们或第三方有害，我们可以在不事先通知的情况下立即终止或暂停您的账户和对我们服务的访问。',
            '您可以随时通过联系我们或通过您的账户设置来终止您的账户。',
            '终止后，您使用我们服务的权利将立即停止，但按其性质应在终止后继续有效的条款将继续有效。',
          ],
        },
        {
          title: '10. 适用法律',
          content: [
            '本服务条款应受Niche Mining Inc.注册所在司法管辖区的法律管辖并根据其解释，不考虑其法律冲突条款。',
            '因这些条款或我们的服务引起的任何争议应通过具有约束力的仲裁或在我们司法管辖区的法院解决。',
          ],
        },
      ],
      contact: {
        title: '联系我们',
        content: '如果您对这些服务条款有任何疑问，请通过以下方式联系我们：',
        email: 'soulcraftlimited@galatea.bar',
        company: 'Soulcraft Limited',
      },
    },
  },
};
