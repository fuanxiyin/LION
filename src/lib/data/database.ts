import { TeamMember, Publication, Project, News, Page, Media, User, TodoItem } from './models';

// 团队成员数据
export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: '张明',
    title: '教授/博士生导师',
    degree: '博士（美国加州大学戴维斯分校）',
    research: '土壤污染修复、重金属稳定化技术、土壤-植物系统修复',
    email: 'zhangming@university.edu.cn',
    category: 'professor',
    googleScholar: 'https://scholar.google.com',
    researchGate: 'https://www.researchgate.net',
    orcid: 'https://orcid.org',
    isActive: true,
    joinDate: '2005-09-01'
  },
  {
    id: 2,
    name: '李华',
    title: '教授/博士生导师',
    degree: '博士（中国科学院）',
    research: '土壤微生物生态学、环境微生物组学、土壤健康评价',
    email: 'lihua@university.edu.cn',
    category: 'professor',
    googleScholar: 'https://scholar.google.com',
    researchGate: 'https://www.researchgate.net',
    orcid: 'https://orcid.org',
    isActive: true,
    joinDate: '2008-03-01'
  }
];

// 论文数据
export const publications: Publication[] = [
  {
    id: 1,
    title: '纳米零价铁固定化重金属污染土壤的长期稳定性研究12311',
    authors: '张明, 李华, 王强, 刘伟',
    journal: 'Environmental Science & Technology',
    year: 2023,
    volume: '57',
    issue: '6',
    pages: '2512-2525',
    doi: '10.1021/acs.est.2c08876',
    isHighlighted: true
  },
  {
    id: 2,
    title: '土壤微生物组功能基因与土壤肥力的关系研究',
    authors: '李华, 张明, 郑青',
    journal: 'Soil Biology and Biochemistry',
    year: 2023,
    volume: '178',
    pages: '108952',
    doi: '10.1016/j.soilbio.2023.108952',
    isHighlighted: false
  }
];

// 研究项目数据
export const projects: Project[] = [
  {
    id: 1,
    name: '农田土壤重金属污染源解析与风险评估',
    source: '国家自然科学基金重点项目',
    fundingAmount: 3000000,
    startDate: '2021-01-01',
    endDate: '2025-12-31',
    leader: '张明',
    leaderId: 1,
    isActive: true
  },
  {
    id: 2,
    name: '土壤微生物组与植物互作机制研究',
    source: '国家重点研发计划项目',
    fundingAmount: 2500000,
    startDate: '2022-01-01',
    endDate: '2026-12-31',
    leader: '李华',
    leaderId: 2,
    isActive: true
  }
];

// 新闻数据
export const news: News[] = [
  {
    id: 1,
    title: '课题组获批国家自然科学基金重点项目',
    content: '近日，我课题组张明教授主持的"农田土壤重金属污染源解析与风险评估"项目获批国家自然科学基金重点项目资助。',
    publish_date: '2023-09-15',
    author: '管理员',
    isPublished: true
  },
  {
    id: 2,
    title: '课题组在Environmental Science & Technology发表重要研究成果',
    content: '我课题组在纳米材料修复重金属污染土壤方面取得重要进展，相关成果发表在环境领域顶级期刊Environmental Science & Technology。',
    publish_date: '2023-08-20',
    author: '管理员',
    isPublished: true
  }
];

// 页面数据
export const pages: Page[] = [
  {
    id: 1,
    title: '课题组简介',
    slug: 'about',
    content: '土壤科学课题组成立于2005年，是某某大学环境科学与工程学院的重点研究团队...',
    lastUpdated: '2023-12-01',
    updatedBy: '管理员',
    isPublished: true
  }
];

// 媒体数据
export const media: Media[] = [
  {
    id: 1,
    filename: 'lab-1.jpg',
    mimeType: 'image/jpeg',
    type: 'image',
    url: '/images/lab-1.jpg',
    uploadDate: '2023-12-01',
    uploadedBy: '管理员',
    size: 1024000,
    description: '实验室环境照片示例'
  }
];

// 用户数据
// 注意：用户数据已移至 database.mjs，请在那里维护用户信息
// 此处保留接口兼容性，但实际使用的是 database.mjs 中的数据
export const users: User[] = [];

// 待办事项数据
export const todoItems: TodoItem[] = [
  {
    id: 1,
    text: '更新课题组简介',
    deadline: '2024-01-15',
    completed: false,
    createdBy: 1,
    createdAt: '2023-12-01',
    priority: 'high'
  },
  {
    id: 2,
    text: '准备年度总结报告',
    deadline: '2024-01-20',
    completed: false,
    createdBy: 1,
    createdAt: '2023-12-01',
    priority: 'medium'
  }
]; 