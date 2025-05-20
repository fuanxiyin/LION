'use client';

import { useCallback } from 'react';
import { TeamMember, Publication, Project, News, TodoItem, Patent, ResearchArea, ResearchDirection, ResearchFeature } from '@/lib/data/models';

// 创建一个简单的缓存系统，避免频繁请求
const cache = {
  teamMembers: null as TeamMember[] | null,
  publications: null as Publication[] | null,
  projects: null as Project[] | null,
  news: null as News[] | null,
  todos: null as TodoItem[] | null,
  patents: null as Patent[] | null,
  researchAreas: null as ResearchArea[] | null,
  researchDirections: null as ResearchDirection[] | null,
  researchFeatures: null as ResearchFeature[] | null,
  lastFetch: {
    teamMembers: 0,
    publications: 0,
    projects: 0,
    news: 0,
    todos: 0,
    patents: 0,
    researchAreas: 0,
    researchDirections: 0,
    researchFeatures: 0
  }
};

// 缓存有效期（毫秒）
const CACHE_DURATION = 5000; // 修改为5秒，便于更快刷新数据

// 团队成员 API 钩子
export function useTeamMemberApi() {
  // 获取所有团队成员
  const getAll = useCallback(async (forceRefresh = false): Promise<TeamMember[]> => {
    const now = Date.now();
    // 检查缓存是否有效，如果强制刷新则跳过缓存
    if (!forceRefresh && cache.teamMembers && (now - cache.lastFetch.teamMembers) < CACHE_DURATION) {
      return cache.teamMembers;
    }
    
    const response = await fetch('/api/team-members');
    if (!response.ok) throw new Error('Failed to fetch team members');
    const data = await response.json();
    
    // 更新缓存
    cache.teamMembers = data;
    cache.lastFetch.teamMembers = now;
    
    return data;
  }, []);

  // 获取单个团队成员
  const getById = useCallback(async (id: number): Promise<TeamMember | null> => {
    // 尝试从缓存中查找
    if (cache.teamMembers) {
      const member = cache.teamMembers.find(m => m.id === id);
      if (member) return member;
    }
    
    const response = await fetch(`/api/team-members/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch team member with id ${id}`);
    }
    return response.json();
  }, []);

  // 创建新团队成员
  const create = useCallback(async (data: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    const response = await fetch('/api/team-members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create team member');
    const newMember = await response.json();
    
    // 更新缓存
    if (cache.teamMembers) {
      cache.teamMembers = [...cache.teamMembers, newMember];
    }
    
    return newMember;
  }, []);

  // 更新团队成员
  const update = useCallback(async (id: number, data: Partial<TeamMember>): Promise<boolean> => {
    const response = await fetch(`/api/team-members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error('Failed to update team member');
      return false;
    }
    
    try {
      // 获取服务器返回的更新后的成员数据
      const updatedMember = await response.json();
      
      // 更新缓存
      if (cache.teamMembers) {
        cache.teamMembers = cache.teamMembers.map(member => 
          member.id === id ? updatedMember : member
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error processing response:', error);
      return false;
    }
  }, []);

  // 删除团队成员
  const delete_ = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/team-members/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      console.error('Failed to delete team member');
      return false;
    }
    
    try {
      // 确保服务器已成功删除
      const result = await response.json();
      
      // 更新缓存
      if (result.success && cache.teamMembers) {
        cache.teamMembers = cache.teamMembers.filter(member => member.id !== id);
      }
      
      return result.success;
    } catch (error) {
      console.error('Error processing response:', error);
      return false;
    }
  }, []);

  return { getAll, getById, create, update, delete: delete_ };
}

// 论文 API 钩子
export function usePublicationApi() {
  // 获取所有论文
  const getAll = useCallback(async (): Promise<Publication[]> => {
    const now = Date.now();
    // 检查缓存是否有效
    if (cache.publications && (now - cache.lastFetch.publications) < CACHE_DURATION) {
      return cache.publications;
    }
    
    const response = await fetch('/api/publications');
    if (!response.ok) throw new Error('Failed to fetch publications');
    const data = await response.json();
    
    // 更新缓存
    cache.publications = data;
    cache.lastFetch.publications = now;
    
    return data;
  }, []);

  // 获取单个论文
  const getById = useCallback(async (id: number): Promise<Publication | null> => {
    // 尝试从缓存中查找
    if (cache.publications) {
      const publication = cache.publications.find(p => p.id === id);
      if (publication) return publication;
    }
    
    const response = await fetch(`/api/publications/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch publication with id ${id}`);
    }
    return response.json();
  }, []);

  // 创建新论文
  const create = useCallback(async (data: Omit<Publication, 'id'>): Promise<Publication> => {
    const response = await fetch('/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create publication');
    const newPublication = await response.json();
    
    // 更新缓存
    if (cache.publications) {
      cache.publications.push(newPublication);
    }
    
    return newPublication;
  }, []);

  // 更新论文
  const update = useCallback(async (id: number, data: Partial<Publication>): Promise<boolean> => {
    const response = await fetch(`/api/publications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // 如果成功，更新缓存
    if (response.ok && cache.publications) {
      cache.publications = cache.publications.map(pub => 
        pub.id === id ? { ...pub, ...data } : pub
      );
    }
    
    return response.ok;
  }, []);

  // 删除论文
  const delete_ = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/publications/${id}`, {
      method: 'DELETE'
    });
    
    // 如果成功，更新缓存
    if (response.ok && cache.publications) {
      cache.publications = cache.publications.filter(pub => pub.id !== id);
    }
    
    return response.ok;
  }, []);

  return { getAll, getById, create, update, delete: delete_ };
}

// 项目 API 钩子
export function useProjectApi() {
  // 获取所有项目
  const getAll = useCallback(async (): Promise<Project[]> => {
    const now = Date.now();
    // 检查缓存是否有效
    if (cache.projects && (now - cache.lastFetch.projects) < CACHE_DURATION) {
      return cache.projects;
    }
    
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    
    // 更新缓存
    cache.projects = data;
    cache.lastFetch.projects = now;
    
    return data;
  }, []);

  // 获取单个项目
  const getById = useCallback(async (id: number): Promise<Project | null> => {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch project with id ${id}`);
    }
    return response.json();
  }, []);

  // 创建新项目
  const create = useCallback(async (data: Omit<Project, 'id'>): Promise<Project> => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  }, []);

  // 更新项目
  const update = useCallback(async (id: number, data: Partial<Project>): Promise<boolean> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error('Failed to update project');
      return false;
    }
    
    try {
      // 获取服务器返回的更新后的项目数据
      const updatedProject = await response.json();
      
      // 更新缓存
      if (cache.projects) {
        cache.projects = cache.projects.map(project => 
          project.id === id ? updatedProject : project
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error processing response:', error);
      return false;
    }
  }, []);

  // 删除项目
  const delete_ = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }, []);

  return { getAll, getById, create, update, delete: delete_ };
}

// 新闻 API 钩子
export function useNewsApi() {
  // 获取所有新闻
  const getAll = useCallback(async (): Promise<News[]> => {
    const response = await fetch('/api/news');
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  }, []);

  // 获取单个新闻
  const getById = useCallback(async (id: number): Promise<News | null> => {
    const response = await fetch(`/api/news/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch news with id ${id}`);
    }
    return response.json();
  }, []);

  // 创建新新闻
  const create = useCallback(async (data: Omit<News, 'id'>): Promise<News> => {
    const response = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create news');
    return response.json();
  }, []);

  // 更新新闻
  const update = useCallback(async (id: number, data: Partial<News>): Promise<boolean> => {
    const response = await fetch(`/api/news/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.ok;
  }, []);

  // 删除新闻
  const delete_ = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/news/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }, []);

  return { getAll, getById, create, update, delete: delete_ };
}

// 专利 API 钩子
export function usePatentApi() {
  // 获取所有专利
  const getAll = useCallback(async (): Promise<Patent[]> => {
    const now = Date.now();
    // 检查缓存是否有效
    if (cache.patents && (now - cache.lastFetch.patents) < CACHE_DURATION) {
      return cache.patents;
    }
    
    const response = await fetch('/api/patents');
    if (!response.ok) throw new Error('Failed to fetch patents');
    const data = await response.json();
    
    // 更新缓存
    cache.patents = data;
    cache.lastFetch.patents = now;
    
    return data;
  }, []);

  // 获取单个专利
  const getById = useCallback(async (id: number): Promise<Patent | null> => {
    const response = await fetch(`/api/patents/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch patent with id ${id}`);
    }
    return response.json();
  }, []);

  // 创建新专利
  const create = useCallback(async (data: Omit<Patent, 'id'>): Promise<Patent> => {
    const response = await fetch('/api/patents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create patent');
    return response.json();
  }, []);

  // 更新专利
  const update = useCallback(async (id: number, data: Partial<Patent>): Promise<boolean> => {
    const response = await fetch(`/api/patents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error('Failed to update patent');
      return false;
    }
    
    try {
      // 获取服务器返回的更新后的专利数据
      const updatedPatent = await response.json();
      
      // 更新缓存
      if (cache.patents) {
        cache.patents = cache.patents.map(patent => 
          patent.id === id ? updatedPatent : patent
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error processing response:', error);
      return false;
    }
  }, []);

  // 删除专利
  const delete_ = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/patents/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }, []);

  return { getAll, getById, create, update, delete: delete_ };
}

// 创建单例研究领域API实例，避免重复创建
const researchAreaApiInstance = (() => {
  const getAll = async (forceRefresh = false): Promise<ResearchArea[]> => {
    const now = Date.now();
    // 检查缓存是否有效，如果强制刷新则跳过缓存
    if (!forceRefresh && cache.researchAreas && (now - cache.lastFetch.researchAreas) < CACHE_DURATION) {
      return cache.researchAreas;
    }

    const response = await fetch('/api/research-areas');
    if (!response.ok) {
      throw new Error('Failed to fetch research areas');
    }
    const data = await response.json();
    
    // 更新缓存
    cache.researchAreas = data.researchAreas;
    cache.lastFetch.researchAreas = now;
    
    return data.researchAreas;
  };

  const getById = async (id: number): Promise<ResearchArea | null> => {
    // 尝试从缓存中查找
    if (cache.researchAreas) {
      const area = cache.researchAreas.find(a => a.id === id);
      if (area) return area;
    }
    
    const response = await fetch(`/api/research-areas/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch research area with id ${id}`);
    }
    const data = await response.json();
    return data.researchArea;
  };

  const create = async (researchArea: Omit<ResearchArea, 'id'>): Promise<ResearchArea> => {
    const response = await fetch('/api/research-areas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(researchArea),
    });
    if (!response.ok) {
      throw new Error('Failed to create research area');
    }
    const data = await response.json();
    
    // 更新缓存
    if (cache.researchAreas) {
      cache.researchAreas.push(data.researchArea);
    }
    
    return data.researchArea;
  };

  const update = async (id: number, researchArea: Partial<ResearchArea>): Promise<ResearchArea> => {
    const response = await fetch(`/api/research-areas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(researchArea),
    });
    if (!response.ok) {
      throw new Error(`Failed to update research area with id ${id}`);
    }
    const data = await response.json();
    
    // 更新缓存
    if (cache.researchAreas) {
      cache.researchAreas = cache.researchAreas.map(area => 
        area.id === id ? data.researchArea : area
      );
    }
    
    return data.researchArea;
  };

  const delete_ = async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/research-areas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete research area with id ${id}`);
    }
    
    // 更新缓存
    if (cache.researchAreas) {
      cache.researchAreas = cache.researchAreas.filter(area => area.id !== id);
    }
    
    return true;
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: delete_,
  };
})();

// 研究领域API钩子，返回稳定的单例引用
export const useResearchAreaApi = () => {
  return researchAreaApiInstance;
};

// 研究方向API钩子
export const useResearchDirectionApi = () => {
  // 获取所有研究方向
  const getAll = useCallback(async (forceRefresh = false): Promise<ResearchDirection[]> => {
    const now = Date.now();
    // 检查缓存是否有效，如果强制刷新则跳过缓存
    if (!forceRefresh && cache.researchDirections && (now - cache.lastFetch.researchDirections) < CACHE_DURATION) {
      return cache.researchDirections;
    }

    const response = await fetch('/api/research-directions');
    if (!response.ok) {
      throw new Error('Failed to fetch research directions');
    }
    const data = await response.json();
    
    // 更新缓存
    cache.researchDirections = data.researchDirections;
    cache.lastFetch.researchDirections = now;
    
    return data.researchDirections;
  }, []);

  // 获取活跃的研究方向
  const getActive = useCallback(async (): Promise<ResearchDirection[]> => {
    const response = await fetch('/api/research-directions?active=true');
    if (!response.ok) {
      throw new Error('Failed to fetch active research directions');
    }
    const data = await response.json();
    return data.researchDirections;
  }, []);

  // 获取单个研究方向
  const getById = useCallback(async (id: number): Promise<ResearchDirection | null> => {
    // 尝试从缓存中查找
    if (cache.researchDirections) {
      const direction = cache.researchDirections.find(d => d.id === id);
      if (direction) return direction;
    }
    
    const response = await fetch(`/api/research-directions/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch research direction with id ${id}`);
    }
    const data = await response.json();
    return data.researchDirection;
  }, []);

  // 创建新研究方向
  const create = useCallback(async (direction: Omit<ResearchDirection, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchDirection> => {
    const response = await fetch('/api/research-directions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(direction)
    });
    if (!response.ok) {
      throw new Error('Failed to create research direction');
    }
    const data = await response.json();
    
    // 更新缓存
    if (cache.researchDirections) {
      cache.researchDirections.push(data.researchDirection);
    }
    
    return data.researchDirection;
  }, []);

  // 更新研究方向
  const update = useCallback(async (id: number, direction: Partial<ResearchDirection>): Promise<ResearchDirection> => {
    const response = await fetch(`/api/research-directions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(direction)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update research direction with id ${id}`);
    }
    
    const data = await response.json();
    
    // 更新缓存
    if (cache.researchDirections) {
      cache.researchDirections = cache.researchDirections.map(d => 
        d.id === id ? data.researchDirection : d
      );
    }
    
    return data.researchDirection;
  }, []);

  // 删除研究方向
  const delete_ = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/research-directions/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete research direction with id ${id}`);
    }
    
    // 更新缓存
    if (cache.researchDirections) {
      cache.researchDirections = cache.researchDirections.filter(d => d.id !== id);
    }
    
    return true;
  }, []);

  return { getAll, getActive, getById, create, update, delete: delete_ };
};

// 研究特色API钩子
export const useResearchFeatureApi = () => {
  // 获取所有研究特色
  const getAll = useCallback(async (forceRefresh = false): Promise<ResearchFeature[]> => {
    const now = Date.now();
    // 检查缓存是否有效，如果强制刷新则跳过缓存
    if (!forceRefresh && cache.researchFeatures && (now - cache.lastFetch.researchFeatures) < CACHE_DURATION) {
      return cache.researchFeatures;
    }

    const response = await fetch('/api/research-features');
    if (!response.ok) {
      throw new Error('Failed to fetch research features');
    }
    const data = await response.json();
    
    // 更新缓存
    cache.researchFeatures = data.researchFeatures;
    cache.lastFetch.researchFeatures = now;
    
    return data.researchFeatures;
  }, []);

  // 获取活跃的研究特色
  const getActive = useCallback(async (): Promise<ResearchFeature[]> => {
    const response = await fetch('/api/research-features?active=true');
    if (!response.ok) {
      throw new Error('Failed to fetch active research features');
    }
    const data = await response.json();
    return data.researchFeatures;
  }, []);

  // 获取单个研究特色
  const getById = useCallback(async (id: number): Promise<ResearchFeature | null> => {
    // 尝试从缓存中查找
    if (cache.researchFeatures) {
      const feature = cache.researchFeatures.find(f => f.id === id);
      if (feature) return feature;
    }
    
    const response = await fetch(`/api/research-features/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch research feature with id ${id}`);
    }
    const data = await response.json();
    return data.researchFeature;
  }, []);

  // 创建新研究特色
  const create = useCallback(async (feature: Omit<ResearchFeature, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchFeature> => {
    const response = await fetch('/api/research-features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feature)
    });
    if (!response.ok) {
      throw new Error('Failed to create research feature');
    }
    const data = await response.json();
    
    // 更新缓存
    if (cache.researchFeatures) {
      cache.researchFeatures.push(data.researchFeature);
    }
    
    return data.researchFeature;
  }, []);

  // 更新研究特色
  const update = useCallback(async (id: number, feature: Partial<ResearchFeature>): Promise<ResearchFeature> => {
    const response = await fetch(`/api/research-features/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feature)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update research feature with id ${id}`);
    }
    
    const data = await response.json();
    
    // 更新缓存
    if (cache.researchFeatures) {
      cache.researchFeatures = cache.researchFeatures.map(f => 
        f.id === id ? data.researchFeature : f
      );
    }
    
    return data.researchFeature;
  }, []);

  // 删除研究特色
  const delete_ = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/research-features/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete research feature with id ${id}`);
    }
    
    // 更新缓存
    if (cache.researchFeatures) {
      cache.researchFeatures = cache.researchFeatures.filter(f => f.id !== id);
    }
    
    return true;
  }, []);

  return { getAll, getActive, getById, create, update, delete: delete_ };
};