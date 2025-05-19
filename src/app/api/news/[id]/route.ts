import { NextResponse } from 'next/server';
import { getNewsById, updateNews, deleteNews } from '@/lib/db/news';
import { News } from '@/lib/data/models';

// 获取单个新闻
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid news ID' },
        { status: 400 }
      );
    }
    
    const news = getNewsById(id);
    
    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// 更新新闻
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid news ID' },
        { status: 400 }
      );
    }
    
    // 检查新闻是否存在
    const existingNews = getNewsById(id);
    if (!existingNews) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    // 获取更新数据
    const data: Partial<News> = await request.json();
    
    // 更新新闻
    const success = updateNews(id, data);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update news' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// 删除新闻
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid news ID' },
        { status: 400 }
      );
    }
    
    // 检查新闻是否存在
    const existingNews = getNewsById(id);
    if (!existingNews) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }
    
    // 删除新闻
    const success = deleteNews(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete news' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
} 