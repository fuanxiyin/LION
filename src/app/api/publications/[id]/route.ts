import { NextResponse } from 'next/server';
import { getPublicationById, updatePublication, deletePublication } from '@/lib/db/publications';

// 定义路由参数接口
interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个论文
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const publication = getPublicationById(id);
    if (!publication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error(`Error fetching publication with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch publication' },
      { status: 500 }
    );
  }
}

// 更新论文
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
    const success = updatePublication(id, data);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error updating publication with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update publication' },
      { status: 500 }
    );
  }
}

// 删除论文
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const success = deletePublication(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting publication with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
} 