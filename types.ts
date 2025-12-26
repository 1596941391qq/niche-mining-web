import { LucideIcon } from 'lucide-react';

export type Language = 'en' | 'cn';

export interface Translations {
  nav: {
    features: string;
    agents: string;
    howItWorks: string;
    start: string;
  };
  console?: {
    sidebar?: {
      dashboard?: string;
      agents?: string;
      api?: string;
      subscription?: string;
      team?: string;
      settings?: string;
      backHome?: string;
    };
    userInfo?: {
      currentPlan?: string;
    };
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    placeholder: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats_efficiency: string;
    stats_depth: string;
  };
  features: {
    heading: string;
    subheading: string;
    description?: string;
    steps: {
      title: string;
      desc: string;
    }[];
  };
  tools: {
    badge: string;
    heading: string;
    subheading: string;
    action: string;
    items: {
      id: string;
      name: string;
      desc: string;
      features: string[];
    }[];
  };
  howItWorks: {
    badge: string;
    coreValue: {
      title: string;
      subtitle: string;
      description: string;
    };
    workflow: {
      title: string;
      description: string;
      customizable?: {
        title: string;
        description: string;
        features?: string[];
      };
      steps: {
        id: string;
        title: string;
        description: string;
        agents: {
          name: string;
          desc: string;
        }[];
        tools: {
          name: string;
          desc: string;
        }[];
        value?: string;
      }[];
    };
  };
  footer: {
    tagline: string;
    product: string;
    legal: string;
    about?: string;
    rights: string;
    system: string;
    privacyLink: string;
    termsLink: string;
    company?: string;
    email?: string;
    aboutDescription?: string;
    companyName?: string;
    chineseCompanyName?: string;
    businessRegNo?: string;
    incorporationDate?: string;
    companyType?: string;
    companyStatus?: string;
  };
  privacy: {
    title: string;
    lastUpdated: string;
    back: string;
    sections: {
      title: string;
      content: string[];
    }[];
    contact: {
      title: string;
      content: string;
      email: string;
      company?: string;
    };
  };
  about: {
    title: string;
    subtitle: string;
    back: string;
    companyInfo: {
      title: string;
      content: string[];
    };
    companyDetails: {
      title: string;
      companyName: string;
      companyNameValue: string;
      chineseCompanyName: string;
      businessRegNo: string;
      incorporationDate: string;
      companyType: string;
      companyStatus: string;
    };
    contact: {
      title: string;
      content: string;
      company: string;
      email: string;
    };
  };
  terms: {
    title: string;
    lastUpdated: string;
    back: string;
    sections: {
      title: string;
      content: string[];
    }[];
    contact: {
      title: string;
      content: string;
      email: string;
      company?: string;
    };
  };
}

export interface ToolFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface SEOTool {
  id: string;
  name: string;
  description: string;
  iconName: 'google' | 'yandex' | 'bing';
  accentColor: string; // Tailwind color class
  features: string[];
}
