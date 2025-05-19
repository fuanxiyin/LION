import { NextResponse } from 'next/server';
import { getAllNews, createNews, getPublishedNews, getNewsById, updateNews, deleteNews } from '@/lib/db/news';
import { News } from '@/lib/data/models';

// 获取新闻
export async function GET(request: Request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const publishedOnly = searchParams.get('published') === 'true';
    
    // 根据参数获取所有新闻或仅已发布的新闻
    let news = publishedOnly ? getPublishedNews() : getAllNews();
    
    // 如果指定了limit参数，则只返回指定数量的新闻
    if (limit && !isNaN(limit) && limit > 0) {
      news = news.slice(0, limit);
    }
    
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// 创建新闻
export async function POST(request: Request) {
  try {
    const data: Omit<News, 'id'> = await request.json();
    
    // 基本验证
    if (!data.title || !data.content || !data.publish_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newNews = createNews(data);
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

// 更新新闻
export async function PATCH(request: Request) {
  try {
    // 从URL获取新闻ID
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idString = pathParts[pathParts.length - 1];
    const id = parseInt(idString, 10);
    
    // 验证ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid news ID' },
        { status: 400 }
      );
    }
    
    // 获取现有新闻
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
export async function DELETE(request: Request) {
  try {
    // 从URL获取新闻ID
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const idString = pathParts[pathParts.length - 1];
    const id = parseInt(idString, 10);
    
    // 验证ID
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid news ID' },
        { status: 400 }
      );
    }
    
    // 获取现有新闻
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