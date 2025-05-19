import { NextResponse } from 'next/server';
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from '@/lib/db/teamMembers';

// 定义路由参数接口
interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个团队成员
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const member = getTeamMemberById(id);
    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error(`Error fetching team member with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

// 更新团队成员
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
    const success = updateTeamMember(id, data);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // 返回更新后的成员数据
    const updatedMember = getTeamMemberById(id);
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error(`Error updating team member with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// 删除团队成员
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const success = deleteTeamMember(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting team member with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
} 