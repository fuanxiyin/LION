import { useCallback, useMemo } from 'react';
import { Publication } from '@/lib/data/models';

export function usePublicationApi() {
  // 获取所有出版物
  const getAll = useCallback(async (): Promise<Publication[]> => {
    const response = await fetch('/api/publications');
    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }
    return response.json();
  }, []);

  // 获取单个出版物
  const getById = useCallback(async (id: number): Promise<Publication | null> => {
    const response = await fetch(`/api/publications/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch publication with id ${id}`);
    }
    return response.json();
  }, []);

  // 创建新出版物
  const create = useCallback(async (data: Omit<Publication, 'id'>): Promise<Publication> => {
    const response = await fetch('/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to create publication');
    }
    return response.json();
  }, []);

  // 更新出版物
  const update = useCallback(async (id: number, data: Partial<Publication>): Promise<Publication> => {
    const response = await fetch(`/api/publications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update publication');
    }
    
    return response.json();
  }, []);

  // 删除出版物
  const deletePublication = useCallback(async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/publications/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete publication');
    }
    
    const result = await response.json();
    return result.success;
  }, []);

  // 使用useMemo记忆化整个API对象，确保它不会在每次渲染时重新创建
  return useMemo(() => ({ 
    getAll, 
    getById, 
    create, 
    update, 
    delete: deletePublication
  }), [getAll, getById, create, update, deletePublication]);
} 