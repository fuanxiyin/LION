'use server';

import { News, TodoItem } from '@/lib/data/models'; // 导入 News 和 TodoItem 类型
import { getAllTeamMembers } from '@/lib/db/teamMembers';
import { getAllPublications } from '@/lib/db/publications';
import { getAllProjects } from '@/lib/db/projects'; 
import { getAllNews } from '@/lib/db/news';
import { getAllTodos, toggleTodoComplete } from '@/lib/server/api';

// 定义仪表板数据类型
export type DashboardData = {
  teamMemberCount: number;
  publicationCount: number;
  projectCount: number;
  newsCount: number;
  todoItemCount: number;
  recentNews: News[];
  todoItems: TodoItem[];
};

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // 从数据库获取所有数据
    const teamMembers = getAllTeamMembers();
    const publications = getAllPublications();
    const projects = getAllProjects();
    const news = getAllNews();
    const todoItems = await getAllTodos();

    // 对新闻按日期排序并获取最近的4条
    const recentNews = news.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()).slice(0, 4);

    return {
      teamMemberCount: teamMembers.length,
      publicationCount: publications.length,
      projectCount: projects.length,
      newsCount: news.length,
      todoItemCount: todoItems.length,
      recentNews: recentNews,
      todoItems: todoItems,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data on server:', error);
    return {
      teamMemberCount: 0,
      publicationCount: 0,
      projectCount: 0,
      newsCount: 0,
      todoItemCount: 0,
      recentNews: [],
      todoItems: [],
    };
  }
}

export async function toggleTodoServer(id: number): Promise<boolean> {
  try {
    return toggleTodoComplete(id);
  } catch (error) {
    console.error(`Failed to toggle todo item ${id} on server:`, error);
    return false;
  }
} 