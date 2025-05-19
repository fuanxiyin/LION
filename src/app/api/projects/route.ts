import { NextResponse } from 'next/server';
import { getAllProjects, createProject, getProjectsByStatus, searchProjects } from '@/lib/db/projects';
import { Project } from '@/lib/data/models';

// 获取所有项目或根据查询参数过滤
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActiveParam = searchParams.get('isActive');
    const searchQuery = searchParams.get('search');

    let projects: Project[];

    if (searchQuery) {
      // 如果有搜索查询，执行搜索
      projects = searchProjects(searchQuery);
    } else if (isActiveParam !== null) {
      // 如果有状态参数，按状态筛选
      const isActive = isActiveParam === 'true';
      projects = getProjectsByStatus(isActive);
    } else {
      // 否则获取所有项目
      projects = getAllProjects();
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// 创建新项目
export async function POST(request: Request) {
  try {
    const data: Omit<Project, 'id'> = await request.json();
    
    // 基本验证
    if (!data.name || !data.startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newProject = createProject(data);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 