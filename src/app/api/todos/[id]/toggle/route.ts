import { NextResponse } from 'next/server';
import { toggleTodoComplete } from '@/lib/server/api';

// 定义路由参数接口
interface RouteParams {
  params: {
    id: string;
  };
}

// 切换待办事项完成状态
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const success = await toggleTodoComplete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Todo item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error toggling todo item with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to toggle todo item' },
      { status: 500 }
    );
  }
} 