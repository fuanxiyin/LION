import { useCallback, useMemo } from 'react';
import { TeamMember } from '@/lib/data/models';

export function useTeamMemberApi() {
  // 获取所有团队成员
  const getAll = useCallback(async (): Promise<TeamMember[]> => {
    const response = await fetch('/api/team-members');
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    return response.json();
  }, []);

  // 获取单个团队成员
  const getById = useCallback(async (id: number): Promise<TeamMember | null> => {
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
    if (!response.ok) {
      throw new Error('Failed to create team member');
    }
    return response.json();
  }, []);

  // 更新团队成员
  const update = useCallback(async (id: number, data: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await fetch(`/api/team-members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update team member');
    }
    
    return response.json();
  }, []);

  // 删除团队成员
  const deleteTeamMember = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/team-members/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete team member');
    }
    
    const result = await response.json();
    return result.success;
  }, []);

  // 按类别获取团队成员
  const getByCategory = useCallback(async (category: string): Promise<TeamMember[]> => {
    const response = await fetch(`/api/team-members?category=${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch team members by category: ${category}`);
    }
    return response.json();
  }, []);

  // 搜索团队成员
  const search = useCallback(async (query: string): Promise<TeamMember[]> => {
    const response = await fetch(`/api/team-members?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search team members');
    }
    return response.json();
  }, []);

  // 使用useMemo记忆化整个API对象，确保它不会在每次渲染时重新创建
  return useMemo(() => ({ 
    getAll, 
    getById, 
    create, 
    update, 
    delete: deleteTeamMember,
    getByCategory,
    search
  }), [getAll, getById, create, update, deleteTeamMember, getByCategory, search]);
} 