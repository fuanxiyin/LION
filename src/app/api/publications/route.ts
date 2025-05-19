import { NextResponse } from 'next/server';
import { getAllPublications, createPublication } from '@/lib/db/publications';
import { Publication } from '@/lib/data/models';

// 获取所有论文
export async function GET() {
  try {
    const publications = getAllPublications();
    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

// 创建新论文
export async function POST(request: Request) {
  try {
    const data: Omit<Publication, 'id'> = await request.json();
    
    // 基本验证
    if (!data.title || !data.authors || !data.journal || !data.year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newPublication = createPublication(data);
    return NextResponse.json(newPublication, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json(
      { error: 'Failed to create publication' },
      { status: 500 }
    );
  }
} 