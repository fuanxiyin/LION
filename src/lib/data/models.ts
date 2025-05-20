// 定义团队成员数据模型
export interface TeamMember {
  id: number;
  name: string;
  title: string;
  degree?: string;
  research: string;
  email: string;
  category: 'professor' | 'associate' | 'postdoc' | 'student';
  googleScholar?: string;
  researchGate?: string;
  orcid?: string;
  bio?: string;
  photoUrl?: string;
  publications?: number[];
  projects?: number[];
  isActive: boolean;
  joinDate: string;
}

// 定义论文数据模型
export interface Publication {
  id: number;
  title: string;
  authors: string;
  authorIds?: number[]; // 关联团队成员
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  abstract?: string;
  keywords?: string[];
  pdfUrl?: string;
  highlight?: string;
  citationCount?: number;
  isHighlighted: boolean;
}

// 定义研究项目数据模型
export interface Project {
  id: number;
  name: string;
  source: string;
  fundingAmount?: number;
  startDate: string;
  endDate: string;
  leader: string;
  leaderId?: number; // 关联团队成员
  members?: number[]; // 关联团队成员
  description?: string;
  achievements?: string[];
  isActive: boolean;
}

// 定义新闻动态数据模型
export interface News {
  id: number;
  title: string;
  content: string;
  publish_date: string;
  author: string;
  isPublished: boolean;
  imageUrl?: string;
  tags?: string[];
}

// 定义网站页面数据模型
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
  updatedBy: string;
  isPublished: boolean;
}

// 定义媒体资源数据模型
export interface Media {
  id: number;
  filename: string;
  mimeType: string;
  type: 'image' | 'video' | 'document';
  url: string;
  uploadDate: string;
  uploadedBy: string;
  size: number;
  description?: string;
  tags?: string[];
}

// 定义用户数据模型
export interface User {
  id: number;
  username: string;
  password: string; // 实际应用中应存储加密后的密码
  name: string;
  email: string;
  role: 'admin' | 'editor';
  lastLogin?: string;
  isActive: boolean;
}

// 定义专利数据模型
export interface Patent {
  id: number;
  title: string;
  inventors: string;
  inventorIds?: number[]; // 关联团队成员
  patentNumber: string;
  applicationDate: string;
  grantDate?: string | null;
  abstract?: string | null;
  keywords?: string[];
  status: 'pending' | 'granted' | 'expired';
  type: 'invention' | 'utility' | 'design';
  pdfUrl?: string | null;
  isHighlighted: boolean;
}

// 定义待办事项数据模型
export interface TodoItem {
  id: number;
  text: string;
  deadline?: string;
  completed: boolean;
  createdBy: number; // 关联用户
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
  completedAt?: string;
}

// 定义研究方向数据模型
export interface ResearchDirection {
  id: number;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 定义研究特色数据模型
export interface ResearchFeature {
  id: number;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResearchArea {
  id: number;
  title: string;
  description: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
} 