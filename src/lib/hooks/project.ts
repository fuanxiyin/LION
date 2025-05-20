import { useCallback, useMemo } from 'react';
import { Project } from '@/lib/data/models';

export function useProjectApi() {
  // 获取所有项目
  const getAll = useCallback(async (): Promise<Project[]> => {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
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
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  }, []);

  // 更新项目
  const update = useCallback(async (id: number, data: Partial<Project>): Promise<Project> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    
    return response.json();
  }, []);

  // 删除项目
  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
    
    const result = await response.json();
    return result.success;
  }, []);

  // 按状态获取项目
  const getByStatus = useCallback(async (isActive: boolean): Promise<Project[]> => {
    const response = await fetch(`/api/projects?isActive=${isActive}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects by status: ${isActive ? '进行中' : '已结题'}`);
    }
    return response.json();
  }, []);

  // 搜索项目
  const search = useCallback(async (query: string): Promise<Project[]> => {
    const response = await fetch(`/api/projects?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search projects');
    }
    return response.json();
  }, []);

  // 使用useMemo记忆化整个API对象，确保它不会在每次渲染时重新创建
  return useMemo(() => ({ 
    getAll, 
    getById, 
    create, 
    update, 
    delete: deleteProject,
    getByStatus,
    search
  }), [getAll, getById, create, update, deleteProject, getByStatus, search]);
} 