import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects';

// 定义路由参数接口
interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个项目
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const project = getProjectById(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error fetching project with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// 更新项目
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const success = updateProject(id, data);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // 获取更新后的项目完整数据返回给前端
    const updatedProject = getProjectById(id);
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`Error updating project with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// 删除项目
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const success = deleteProject(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting project with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 