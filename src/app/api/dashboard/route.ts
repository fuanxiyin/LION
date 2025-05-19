import { NextResponse } from 'next/server';
import { getAllTeamMembers } from '@/lib/db/teamMembers';
import { getAllPublications } from '@/lib/db/publications';
import { getAllProjects } from '@/lib/db/projects';
import { getAllNews } from '@/lib/db/news';
import { getAllPatents } from '@/lib/db/patents';

export async function GET() {
  try {
    // 从数据库获取所有数据
    const teamMembers = getAllTeamMembers();
    const publications = getAllPublications();
    const projects = getAllProjects();
    const news = getAllNews();
    const patents = await getAllPatents();

    // 对新闻按日期排序并获取最近的4条
    const recentNews = news
      .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
      .slice(0, 4);

    // 构建仪表板数据
    const dashboardData = {
      teamMemberCount: teamMembers.length,
      publicationCount: publications.length,
      projectCount: projects.length,
      newsCount: news.length,
      patentCount: patents.length,
      recentNews,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        teamMemberCount: 0,
        publicationCount: 0,
        projectCount: 0,
        newsCount: 0,
        patentCount: 0,
        recentNews: [],
      },
      { status: 500 }
    );
  }
} 