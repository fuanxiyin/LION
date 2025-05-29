'use server';

import { getAllPublications } from '@/lib/server/api';
import { Publication } from '@/lib/data/models';

export async function getLatestPublicationsServer(): Promise<Publication[]> {
  try {
    const allPublications = await getAllPublications();
    // 按年份排序并获取最新的4篇论文，明确参数类型
    const sorted = allPublications.sort((a: Publication, b: Publication) => b.year - a.year);
    return sorted.slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch latest publications on server:', error);
    return [];
  }
} 