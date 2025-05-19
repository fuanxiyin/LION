import { NextResponse } from 'next/server';
import { getAllPatents, createPatent } from '@/lib/db/patents';

// GET /api/patents
export async function GET() {
  try {
    const patents = await getAllPatents();
    return NextResponse.json(patents);
  } catch (error) {
    console.error('Failed to fetch patents:', error);
    return NextResponse.json(
      { error: '获取专利列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/patents
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const patent = await createPatent(data);
    return NextResponse.json(patent);
  } catch (error) {
    console.error('Failed to create patent:', error);
    return NextResponse.json(
      { error: '创建专利失败' },
      { status: 500 }
    );
  }
} 