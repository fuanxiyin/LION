import { NextResponse } from 'next/server';
import { 
  getAllTeamMembers, 
  createTeamMember, 
  getTeamMembersByCategory,
  searchTeamMembers
} from '@/lib/db/teamMembers';
import { TeamMember } from '@/lib/data/models';

// 获取所有团队成员
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('search');
    
    let teamMembers: TeamMember[];
    
    // 按查询参数处理请求
    if (category) {
      teamMembers = getTeamMembersByCategory(category);
    } else if (query) {
      teamMembers = searchTeamMembers(query);
    } else {
      teamMembers = getAllTeamMembers();
    }
    
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// 创建新团队成员
export async function POST(request: Request) {
  try {
    const data: Omit<TeamMember, 'id'> = await request.json();
    
    // 基本验证
    if (!data.name || !data.title || !data.category || !data.research || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 确保joinDate有值
    if (!data.joinDate) {
      data.joinDate = new Date().toISOString().split('T')[0];
    }
    
    const newMember = createTeamMember(data);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
} 