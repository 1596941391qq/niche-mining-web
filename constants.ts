import { Translations } from './types';

export const CONTENT: Record<string, Translations> = {
  en: {
    nav: {
      features: 'Methodology',
      agents: 'Agents',
      howItWorks: 'Process',
      start: 'Deploy Agent',
    },
    hero: {
      badge: 'SYSTEM ONLINE // V2.0',
      title: 'Stop Competing.\nStart Domination.',
      subtitle: 'Automated recursive mining for "Blue Ocean" keywords. We find the gaps where only forums and PDF files exist.',
      placeholder: 'Enter seed keyword...',
      ctaPrimary: 'Initialize Mining',
      ctaSecondary: 'View Documentation',
      stats_efficiency: '99.8% Efficiency',
      stats_depth: 'Deep SERP Analysis',
    },
    features: {
      heading: 'Protocol',
      subheading: 'Our autonomous agents don\'t just search; they excavate until a profitable vacuum is found.',
      description: 'Tested and proven: keyword mining through this platform, followed by page optimization, can achieve first-page rankings within three days.',
      steps: [
        { title: 'Recursive Loop', desc: 'Expands root keywords into thousands of long-tail variations automatically.' },
        { title: 'SERP Analysis', desc: 'Scans top 10 results for Domain Authority and content types in real-time.' },
        { title: 'Weakness Detection', desc: 'Identifies slots occupied by forums (Reddit/Quora) or static files (PDFs).' },
        { title: 'Opportunity Lock', desc: 'Validates traffic potential and flags the keyword for immediate takeover.' },
      ],
    },
    tools: {
      badge: 'SELECT WORKER',
      heading: 'Specialized Extraction Units',
      subheading: 'Different algorithms for different ecosystems. Choose your target market.',
      action: 'Launch Agent',
      items: [
        {
          id: 'google',
          name: 'Google Miner',
          desc: 'Global intent targeting. Optimized for high-volume markets.',
          features: ['NLP Intent Matching', 'Zero-Click Analysis', 'US/UK/AU Databases'],
        },
        {
          id: 'yandex',
          name: 'Yandex Unit',
          desc: 'CIS region specialist. Navigates Cyrillic semantics.',
          features: ['ICS Score Check', 'Regional Geo-Filter', 'Cyrillic Core Mapping'],
        },
        {
          id: 'bing',
          name: 'Bing Probe',
          desc: 'High-value demographic targeting. Lower CPA, higher conversion.',
          features: ['Desktop User Focus', 'Low-Competition Scan', 'Affluent Demographic'],
        },
      ],
    },
    footer: {
      tagline: 'Automated SEO warfare for the modern age.',
      product: 'Product',
      legal: 'Legal',
      rights: 'Niche Mining Inc. All rights reserved.',
      system: 'All Systems Operational',
      privacyLink: 'Privacy',
      termsLink: 'Terms',
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
        email: 'privacy@nichemining.com',
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
        email: 'legal@nichemining.com',
      },
    },
  },
  cn: {
    nav: {
      features: '核心算法',
      agents: '挖掘工具',
      howItWorks: '工作原理',
      start: '开始挖掘',
    },
    hero: {
      badge: '系统在线 // V2.0',
      title: '停止无效竞争。\n开始蓝海垄断。',
      subtitle: '全自动循环挖掘“蓝海词”。Agent 持续下钻，直到发现只有论坛、PDF文件占位的弱竞争机会。',
      placeholder: '输入核心种子词...',
      ctaPrimary: '启动挖掘任务',
      ctaSecondary: '查看技术文档',
      stats_efficiency: '99.8% 挖掘效率',
      stats_depth: '深度 SERP 穿透',
    },
    features: {
      heading: '挖掘协议',
      subheading: '我们的自动化 Agent 不仅仅是搜索，它们会持续挖掘，直到发现市场中的真空地带。',
      description: '经过测试，通过此平台进行词挖掘，优化页面后，能在三天后排在首页',
      steps: [
        { title: '循环裂变', desc: '基于种子词，自动裂变出数千个长尾变体，层层下钻。' },
        { title: '竞争对手分析', desc: '实时扫描 SERP 前10名结果，分析域名权重(DA)与内容类型。' },
        { title: '弱点识别', desc: '自动标记由论坛 (Reddit, Quora) 或 静态文件 (PDF) 占据的易攻占位。' },
        { title: '机会锁定', desc: '验证流量潜力并锁定关键词，生成可直接执行的SEO方案。' },
      ],
    },
    tools: {
      badge: '选择挖掘机',
      heading: '专用挖掘单元',
      subheading: '针对不同搜索引擎算法定制的挖掘策略。选择你的目标战场。',
      action: '启动 Agent',
      items: [
        {
          id: 'google',
          name: 'Google 挖掘机',
          desc: '全球意图定位。专为高流量、高竞争的全球市场设计。',
          features: ['NLP 意图匹配', '零点击搜索分析', 'US/UK/AU 数据库'],
        },
        {
          id: 'yandex',
          name: 'Yandex 专员',
          desc: 'CIS 俄语区专家。精通西里尔语义核心与 Yandex 算法。',
          features: ['ICS 权重分析', '区域地理定位', '俄语语义核心映射'],
        },
        {
          id: 'bing',
          name: 'Bing 探测器',
          desc: '高净值人群锁定。针对被忽视的桌面端高转化用户群。',
          features: ['桌面端用户聚焦', '低竞争蓝海扫描', '高消费人群画像'],
        },
      ],
    },
    footer: {
      tagline: '现代 SEO 战争的自动化武器。',
      product: '产品',
      legal: '法律',
      rights: 'Niche Mining Inc. 保留所有权利。',
      system: '系统运行正常',
      privacyLink: '隐私政策',
      termsLink: '服务条款',
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
        email: 'privacy@nichemining.com',
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
        email: 'legal@nichemining.com',
      },
    },
  },
};
