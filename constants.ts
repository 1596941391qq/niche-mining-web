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
      subtitle: 'Stop managing scripts. Start commanding an autonomous SEO production empire. Through multi-platform intelligence and industrial-grade content engineering, we secure deterministic commercial returns.',
      placeholder: 'Enter seed keyword...',
      ctaPrimary: 'Start Production',
      stats_efficiency: 'Industrial Production',
      stats_depth: 'Asymmetric Advantage',
    },
    features: {
      heading: 'The Protocol',
      subheading: 'Our autonomous production line doesn\'t just search; it engineers authority and captures revenue.',
      description: 'Tested and proven: 10x faster market dominance through strategic intelligence and industrial-grade content generation.',
      steps: [
        { title: 'The Mining', desc: 'Identify "market vacuums" occupied by legacy forums and PDFs for immediate asymmetric takeover.' },
        { title: 'The Factory', desc: '8-step industrial production engineering high-citation content optimized for AIO/GEO algorithms.' },
        { title: 'The Studio', desc: 'Synthesize unique visual SEO assets to create a citation moat and dominate visual search results.' },
        { title: 'The Radar', desc: 'Full-spectrum ROI radar linking every pixel to revenue, turning SEO into a predictable investment.' },
      ],
    },
    tools: {
      badge: 'AUTONOMOUS AGENT TEAM',
      heading: 'Your 24/7 Production Engine',
      subheading: 'A specialized team of 4 core agents working in an 8-step industrial chain. We don\'t just generate content; we engineer authority based on real-time AI/SERP intelligence.',
      action: 'Deploy Agent',
      items: [
        {
          id: 'google',
          name: 'SEO Researcher',
          desc: 'Analyzes SERP preferences (Google/ChatGPT/Claude), extracts LSI keywords, and reverse-engineers competitor structures.',
          features: ['SERP Intent Mapping', 'Competitor Gap Analysis', 'LSI/Entity Extraction'],
        },
        {
          id: 'yandex',
          name: 'Content Architect',
          desc: 'Generates structured drafts optimized for AIO (Q&A format, structured answer blocks) and EEAT principles.',
          features: ['AIO/GEO Optimization', 'EEAT-Driven Writing', 'Citation Architecture'],
        },
        {
          id: 'bing',
          name: 'Quality Controller',
          desc: 'Trained on 200+ Google ranking factors. Validates keyword density, AI detection, and factual accuracy.',
          features: ['Ranking Factor Audit', 'Humanization Check', 'Compliance Validation'],
        },
      ],
    },
    howItWorks: {
      badge: 'Industrial Pipeline (Strategic Insight)',
      coreValue: {
        title: 'Core Value',
        subtitle: 'Engineering "Blue Ocean Dominance"',
        description: 'We automate the entire lifecycle—from tactical discovery to industrial production and ROI attribution—ensuring your brand becomes the definitive "standard answer" in the AI search era.',
      },
      workflow: {
        title: 'The Production Pipeline',
        description: 'A closed-loop system of AI agents and specialized SEO engineering units working in perfect synchronization.',
        customizable: {
          title: 'Customizable Production Flow',
          description: 'Configure your own production parameters to match specific market dynamics and vertical requirements.',
          features: [
            'Modular workflow sequencing',
            'Custom AI agent decision logic',
            'Multi-source SEO API integration',
            'Proprietary visual asset generation',
            'Real-time ROI feedback loops',
          ],
        },
        steps: [
          {
            id: '1',
            title: 'Mining (Strategic Intelligence)',
            description: '',
            agents: [
              { name: 'Intelligence Agent', desc: 'Scans for market vacuums and weak competition zones.' },
              { name: 'Intent Architect', desc: 'Maps seed keywords to high-value user search intent.' },
            ],
            tools: [
              { name: 'SERP Analyzer', desc: 'Identifies "weak slots" occupied by forums and PDFs.' },
              { name: 'Volume Validator', desc: 'Calculates real traffic potential and conversion probability.' },
            ],
            value: 'Input seed keywords or domains, output market vacuums.',
          },
          {
            id: '2',
            title: 'Factory (Content Engineering)',
            description: '',
            agents: [
              { name: 'Authority Engineer', desc: 'Generates high-citation content structured for AIO/GEO.' },
              { name: 'Reviewer Agent', desc: 'Ensures 100% human-like quality and factual accuracy.' },
            ],
            tools: [
              { name: 'AIO Optimizer', desc: 'Injects structural markers favored by AI search engines.' },
              { name: 'GEO Architect', desc: 'Optimizes content for localized and contextual relevance.' },
            ],
            value: '4 specialized agents injecting AIO/GEO DNA.',
          },
          {
            id: '3',
            title: 'Studio (Visual Lab)',
            description: '',
            agents: [
              { name: 'Visual Entity Agent', desc: 'Extracts core visual concepts from content.' },
              { name: 'Studio Artist', desc: 'Generates industry-standard, unique visual assets.' },
            ],
            tools: [
              { name: 'Visual SEO Unit', desc: 'Embeds visual fingerprinting for image search dominance.' },
            ],
            value: 'Synthesize unique visual assets with industrial quality.',
          },
          {
            id: '4',
            title: 'Radar (Revenue Tracker)',
            description: '',
            agents: [
              { name: 'Radar Analyst', desc: 'Tracks rank movements and citation rates in real-time.' },
              { name: 'ROI Strategist', desc: 'Links traffic performance directly to revenue metrics.' },
            ],
            tools: [
              { name: 'Full-Spectrum Tracker', desc: 'Monitors main site and visual asset rankings.' },
            ],
            value: 'Link every pixel to the upward ROI revenue stream.',
          },
        ],
      },
      invincible: {
        title: 'Asymmetric Advantage vs. Legacy SEO',
        items: [
          {
            title: 'Legacy SEO (The Human Way)',
            desc: 'Lazy Research -> Low Quality Content -> Stock Images -> Static Thinking -> Unpredictable Luck.',
          },
          {
            title: 'NicheDigger Protocol (The Industrial Way)',
            desc: 'Cross-platform Intel (SERP / Keyword Research) -> 8-Step Autonomous AIO Engineering -> Visual DNA Synthesis -> One-Click Deployment -> Deterministic ROI.',
          },
        ],
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
      subtitle: '停止管理繁琐脚本，开始指挥你的自动化生产帝国。通过全平台情报探测与工业级内容工程，在 AI 搜索时代为您锁定确定性的商业收益。',
      placeholder: '输入核心种子词...',
      ctaPrimary: '启动全链路生产线',
      stats_efficiency: '工业化生产',
      stats_depth: '非对称优势',
    },
    features: {
      heading: '生产核心',
      subheading: '我们的全链路自动化生产线不仅仅是搜索，它是在建造权威并收割收益。',
      description: '经过测试，通过非对称情报与工业级内容生成，市场垄断速度可提升 10 倍以上。',
      steps: [
        { title: '挖掘期 | The Mining', desc: '识别被陈旧论坛和 PDF 占据的“市场真空”，在竞争对手察觉前完成降维打击。' },
        { title: '生成期 | The Factory', desc: '8步透明工业化生产，将 AIO 与 GEO 深度注入内容骨架，确保 AI 搜索的高频引用。' },
        { title: '视觉期 | The Studio', desc: '自动合成高保真行业质感配图，建立“视觉 SEO”护城河，从视觉维度霸占搜索权重。' },
        { title: '追踪期 | The Radar', desc: '全频谱 ROI 雷达将每一像素挂钩收益，让 SEO 彻底告别玄学，变成确定性投资。' },
      ],
    },
    tools: {
      badge: '自动化代理人团队',
      heading: '你的 24/7 生产引擎',
      subheading: '由 4 个核心代理构成的 8 步工业化生产链。我们不仅是生成内容，更是基于实时 AI/SERP 情报构建权威。',
      action: '启动 Agent',
      items: [
        {
          id: 'google',
          name: 'SEO 研究官',
          desc: '分析搜索引擎偏好 (Google/ChatGPT/Claude)，提取 LSI 关键词，并逆向工程对手结构。',
          features: ['SERP 意图映射', '竞争对手缺口分析', 'LSI/关键词提取'],
        },
        {
          id: 'yandex',
          name: '内容架构师',
          desc: '生成专为 AIO 优化的结构化初稿 (Q&A 格式、结构化答案块)，并注入 EEAT 核心原则。',
          features: ['AIO/GEO 深度优化', 'EEAT 驱动写作', '引用架构设计'],
        },
        {
          id: 'bing',
          name: '质量把关官',
          desc: '基于 200+ 项谷歌排名因素训练。验证关键词密度、AI 痕迹，并确保事实引用的准确性。',
          features: ['排名因素审计', '人类化风格校验', '合规性验证'],
        },
      ],
    },
    howItWorks: {
      badge: '全链路生产线（战略洞察）',
      coreValue: {
        title: '核心价值',
        subtitle: '工程化实现“蓝海垄断”',
        description: '我们实现了从战略发现、工业化生产到 ROI 归因的全生命周期自动化，确保您的品牌成为 AI 搜索时代不可撼动的“标准答案”。',
      },
      workflow: {
        title: '工业化工作流',
        description: '由 AI 代理与专业 SEO 工程单元构成的闭环系统，在完美同步中高效运转。',
        customizable: {
          title: '可自定义生产流程',
          description: '支持灵活配置生产参数，以适配特定的市场动态和行业垂直需求。',
          features: [
            '模块化工作流编排',
            '自定义 AI 代理决策逻辑',
            '多源 SEO API 集成',
            '独家视觉资产合成系统',
            '实时 ROI 反馈闭环',
          ],
        },
        steps: [
          {
            id: '1',
            title: '挖掘期 (非对称情报搜寻)',
            description: '',
            agents: [
              { name: '情报 Agent', desc: '扫描市场真空地带与弱竞争区域。' },
              { name: '意图架构师', desc: '将种子词映射为高价值用户搜索意图。' },
            ],
            tools: [
              { name: 'SERP 分析仪', desc: '识别由论坛和 PDF 占据的“防守薄弱位”。' },
              { name: '流量验证器', desc: '计算真实流量潜力和转化概率。' },
            ],
            value: '寻找阻力最小的路径，实现排名的瞬间爆发。',
          },
          {
            id: '2',
            title: '生成期 (内容工程化生产)',
            description: '',
            agents: [
              { name: '权威工程师', desc: '生成专为 AIO/GEO 优化的高引用权重内容。' },
              { name: '审查 Agent', desc: '确保 100% 人类级质感与事实准确性。' },
            ],
            tools: [
              { name: 'AIO 优化单元', desc: '注入 AI 搜索引擎青睐的结构化标记。' },
              { name: 'GEO 架构工具', desc: '针对地理位置与语境相关性进行深度优化。' },
            ],
            value: '将原始关键词转化为具备极高权威性的数字资产。',
          },
          {
            id: '3',
            title: '视觉期 (原生视觉合成)',
            description: '',
            agents: [
              { name: '视觉实体 Agent', desc: '从内容中提取核心视觉概念。' },
              { name: 'Studio 艺术家', desc: '生成行业标准且独一无二的视觉资产。' },
            ],
            tools: [
              { name: '视觉 SEO 单元', desc: '嵌入视觉指纹，霸占图片搜索权重。' },
            ],
            value: '建立竞争对手无法复制的视觉引用护城河。',
          },
          {
            id: '4',
            title: '追踪期 (全频谱收益雷达)',
            description: '',
            agents: [
              { name: '雷达分析员', desc: '实时监控排名异动与 AI 引用率。' },
              { name: 'ROI 策略师', desc: '将流量表现直接挂钩收入指标。' },
            ],
            tools: [
              { name: '全频谱追踪器', desc: '同步追踪主站与视觉资产的搜索表现。' },
            ],
            value: '为每一篇内容的投资回报率提供绝对透明度。',
          },
        ],
      },
      invincible: {
        title: '2026 降维打击：非对称优势 vs 传统模式',
        items: [
          {
            title: '传统 SEO (平庸的人工作业)',
            desc: '经验主义猜词 -> 低质内容堆砌 -> 侵权/素材图 -> 固化思维 -> 纯看运气的收录。',
          },
          {
            title: 'NicheDigger 协议 (高效的工业引擎)',
            desc: '全平台情报 (SERP结果 / Keyword Research) -> 8步自动化 AIO 工程化生成 -> 独家视觉 DNA 合成 -> 一键全平台部署 -> 确定性 ROI 实时追踪。',
          },
        ],
      },
      trends: {
        title: 'AI 搜索时代已全面降临',
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
